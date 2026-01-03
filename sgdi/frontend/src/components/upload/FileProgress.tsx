import React from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { FileIcon } from '../common/FileIcon';
import { formatFileSize, getFileTypeCategory } from '../../utils/fileValidation';

export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'error';

export interface FileProgressProps {
  /** File being uploaded */
  file: File;
  /** Upload progress (0-100) */
  progress: number;
  /** Current upload status */
  status: UploadStatus;
  /** Error message if status is 'error' */
  error?: string;
  /** Callback to cancel/remove the file */
  onRemove?: () => void;
  /** Additional class name */
  className?: string;
}

const StatusIcon: React.FC<{ status: UploadStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Sucesso</span>
        </div>
      );
    case 'error':
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded text-xs font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>Erro</span>
        </div>
      );
    default:
      return null;
  }
};

export const FileProgress: React.FC<FileProgressProps> = ({
  file,
  progress,
  status,
  error,
  onRemove,
  className = '',
}) => {
  const fileType = getFileTypeCategory(file);
  const isUploading = status === 'uploading';
  const isCompleted = status === 'completed';
  const isError = status === 'error';
  const isPending = status === 'pending';

  const uploadedSize = Math.round((file.size * progress) / 100);

  return (
    <div
      className={`flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#252D3F] overflow-hidden ${className}`}
      data-testid="file-progress"
      data-status={status}
    >
      <div className="p-4 flex gap-4 items-center">
        {/* File Icon */}
        <div className="shrink-0">
          <FileIcon type={fileType} size="lg" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <p className="text-[#111318] dark:text-white font-medium truncate" title={file.name}>
              {file.name}
            </p>
            <div className="flex items-center gap-3 ml-4">
              <StatusIcon status={status} />
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title={isUploading ? 'Cancelar upload' : 'Remover arquivo'}
                  data-testid="file-remove-button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar (only when uploading) */}
          {isUploading && (
            <>
              <ProgressBar value={progress} size="sm" showLabel labelPosition="right" />
              <p className="text-xs text-[#616f89] dark:text-gray-500 mt-1">
                Carregando... {formatFileSize(uploadedSize)} de {formatFileSize(file.size)}
              </p>
            </>
          )}

          {/* Pending state */}
          {isPending && (
            <p className="text-xs text-[#616f89] dark:text-gray-500">
              {formatFileSize(file.size)} • Aguardando...
            </p>
          )}

          {/* Completed state */}
          {isCompleted && (
            <p className="text-xs text-[#616f89] dark:text-gray-500">
              {formatFileSize(file.size)} • Upload concluído
            </p>
          )}

          {/* Error state */}
          {isError && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {error || 'Erro ao fazer upload do arquivo'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileProgress;
