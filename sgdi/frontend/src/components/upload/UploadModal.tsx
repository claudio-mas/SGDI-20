import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { DropZone } from './DropZone';
import { FileProgress, UploadStatus } from './FileProgress';
import { Button } from '../common/Button';
import {
  validateFile,
  formatFileSize,
  FileValidationOptions,
} from '../../utils/fileValidation';

export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  metadata?: {
    folder?: string;
    tags?: string[];
    description?: string;
  };
}

export interface UploadModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when upload is complete */
  onUploadComplete?: (files: UploadFile[]) => void;
  /** Destination folder ID */
  destinationFolderId?: string;
  /** File validation options */
  validationOptions?: FileValidationOptions;
}

/** Generate unique ID for files */
const generateFileId = (): string => {
  return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  destinationFolderId,
  validationOptions = {},
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Calculate totals
  const totals = useMemo(() => {
    const totalSize = uploadFiles.reduce((sum, f) => sum + f.file.size, 0);
    const completedCount = uploadFiles.filter((f) => f.status === 'completed').length;
    const errorCount = uploadFiles.filter((f) => f.status === 'error').length;
    const pendingCount = uploadFiles.filter((f) => f.status === 'pending').length;
    const uploadingCount = uploadFiles.filter((f) => f.status === 'uploading').length;
    
    return {
      totalSize,
      totalCount: uploadFiles.length,
      completedCount,
      errorCount,
      pendingCount,
      uploadingCount,
      allCompleted: completedCount === uploadFiles.length && uploadFiles.length > 0,
      hasErrors: errorCount > 0,
      inProgress: uploadingCount > 0,
    };
  }, [uploadFiles]);

  // Handle files selected from DropZone
  const handleFilesSelected = useCallback((files: File[]) => {
    const newUploadFiles: UploadFile[] = files.map((file) => {
      const validation = validateFile(file, validationOptions);
      
      return {
        id: generateFileId(),
        file,
        progress: 0,
        status: validation.valid ? 'pending' : 'error',
        error: validation.error,
        metadata: {
          folder: destinationFolderId,
          tags: [],
          description: '',
        },
      };
    });

    setUploadFiles((prev) => [...prev, ...newUploadFiles]);
  }, [destinationFolderId, validationOptions]);

  // Remove a file from the list
  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  // Update file metadata
  const handleUpdateMetadata = useCallback(
    (fileId: string, metadata: Partial<UploadFile['metadata']>) => {
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, metadata: { ...f.metadata, ...metadata } }
            : f
        )
      );
    },
    []
  );

  // Simulate upload (in real app, this would call the API)
  const simulateUpload = useCallback(async (uploadFile: UploadFile): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? { ...f, progress: 100, status: 'completed' }
                : f
            )
          );
          resolve();
        } else {
          setUploadFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? { ...f, progress: Math.round(progress), status: 'uploading' }
                : f
            )
          );
        }
      }, 200);
    });
  }, []);

  // Start uploading all pending files
  const handleStartUpload = useCallback(async () => {
    const pendingFiles = uploadFiles.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    // Upload files sequentially (could be parallel in production)
    for (const uploadFile of pendingFiles) {
      await simulateUpload(uploadFile);
    }

    setIsUploading(false);
  }, [uploadFiles, simulateUpload]);

  // Finalize upload
  const handleFinalize = useCallback(() => {
    if (onUploadComplete) {
      onUploadComplete(uploadFiles.filter((f) => f.status === 'completed'));
    }
    setUploadFiles([]);
    onClose();
  }, [uploadFiles, onUploadComplete, onClose]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setUploadFiles([]);
    onClose();
  }, [onClose]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleCancel]
  );

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCancel();
      }
    },
    [handleCancel]
  );

  if (!isOpen) return null;

  const canFinalize = totals.allCompleted && !totals.inProgress;
  const hasFiles = uploadFiles.length > 0;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      data-testid="upload-modal"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1C2333] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
          <div>
            <h1
              id="upload-modal-title"
              className="text-[#111318] dark:text-white text-xl font-bold tracking-tight"
            >
              Upload de Arquivos
            </h1>
            <p className="text-[#616f89] dark:text-gray-400 text-sm mt-1">
              Adicione documentos ao sistema e preencha os detalhes.
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-[#616f89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Fechar modal"
            data-testid="upload-modal-close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Drop Zone */}
          <DropZone
            onFilesSelected={handleFilesSelected}
            disabled={isUploading}
            className="mb-8"
          />

          {/* File List */}
          {hasFiles && (
            <>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#111318] dark:text-white font-bold text-lg">
                  Arquivos ({uploadFiles.length})
                </h3>
                {totals.inProgress && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-200">
                    Em progresso
                  </span>
                )}
                {totals.allCompleted && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200">
                    Concluído
                  </span>
                )}
              </div>

              {/* File Items */}
              <div className="flex flex-col gap-4">
                {uploadFiles.map((uploadFile) => (
                  <FileProgressWithMetadata
                    key={uploadFile.id}
                    uploadFile={uploadFile}
                    onRemove={() => handleRemoveFile(uploadFile.id)}
                    onUpdateMetadata={(metadata) =>
                      handleUpdateMetadata(uploadFile.id, metadata)
                    }
                    disabled={isUploading}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-[#1C2333] border-t border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
          <div className="text-sm text-[#616f89] dark:text-gray-400 hidden sm:block">
            {hasFiles && (
              <span>
                Total: {uploadFiles.length} arquivo{uploadFiles.length !== 1 ? 's' : ''} (
                {formatFileSize(totals.totalSize)})
              </span>
            )}
          </div>
          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <Button variant="ghost" onClick={handleCancel}>
              Cancelar
            </Button>
            {!totals.allCompleted && hasFiles && (
              <Button
                variant="primary"
                onClick={handleStartUpload}
                loading={isUploading}
                disabled={totals.pendingCount === 0}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                }
              >
                Iniciar Upload
              </Button>
            )}
            {canFinalize && (
              <Button
                variant="primary"
                onClick={handleFinalize}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Finalizar Upload
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Sub-component for file progress with metadata form
interface FileProgressWithMetadataProps {
  uploadFile: UploadFile;
  onRemove: () => void;
  onUpdateMetadata: (metadata: Partial<UploadFile['metadata']>) => void;
  disabled?: boolean;
}

const FileProgressWithMetadata: React.FC<FileProgressWithMetadataProps> = ({
  uploadFile,
  onRemove,
  onUpdateMetadata,
  disabled,
}) => {
  const isCompleted = uploadFile.status === 'completed';
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = useCallback(() => {
    if (tagInput.trim()) {
      const currentTags = uploadFile.metadata?.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        onUpdateMetadata({ tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput('');
    }
  }, [tagInput, uploadFile.metadata?.tags, onUpdateMetadata]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      const currentTags = uploadFile.metadata?.tags || [];
      onUpdateMetadata({ tags: currentTags.filter((t) => t !== tag) });
    },
    [uploadFile.metadata?.tags, onUpdateMetadata]
  );

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  if (!isCompleted) {
    return (
      <FileProgress
        file={uploadFile.file}
        progress={uploadFile.progress}
        status={uploadFile.status}
        error={uploadFile.error}
        onRemove={onRemove}
      />
    );
  }

  // Completed file with metadata form
  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#252D3F] overflow-hidden shadow-sm">
      {/* File Header */}
      <FileProgress
        file={uploadFile.file}
        progress={uploadFile.progress}
        status={uploadFile.status}
        error={uploadFile.error}
        onRemove={onRemove}
      />

      {/* Metadata Form */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-700/50">
        {/* Folder Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-gray-400">
            Pasta de Destino
          </label>
          <select
            value={uploadFile.metadata?.folder || ''}
            onChange={(e) => onUpdateMetadata({ folder: e.target.value })}
            disabled={disabled}
            className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[#111318] dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8 disabled:opacity-50"
          >
            <option value="">Selecione uma pasta</option>
            <option value="marketing">Marketing / Assets</option>
            <option value="finance">Financeiro / Relatórios</option>
            <option value="hr">RH / Documentos</option>
          </select>
        </div>

        {/* Tags Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-gray-400">
            Tags
          </label>
          <div className="flex items-center gap-2 p-1.5 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
            {uploadFile.metadata?.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 dark:bg-gray-700 text-[#111318] dark:text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500"
                  disabled={disabled}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={handleAddTag}
              placeholder="Adicionar tag..."
              disabled={disabled}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-1 text-[#111318] dark:text-white placeholder-gray-400 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-gray-400">
            Descrição
          </label>
          <textarea
            value={uploadFile.metadata?.description || ''}
            onChange={(e) => onUpdateMetadata({ description: e.target.value })}
            placeholder="Adicione uma breve descrição sobre este arquivo..."
            rows={2}
            disabled={disabled}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[#111318] dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 resize-none disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
