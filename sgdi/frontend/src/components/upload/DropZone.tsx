import React, { useCallback, useState, useRef } from 'react';

export interface DropZoneProps {
  /** Callback when files are selected or dropped */
  onFilesSelected: (files: File[]) => void;
  /** Accepted file types (MIME types or extensions) */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  accept = '.pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png,.zip',
  multiple = true,
  disabled = false,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesSelected(multiple ? droppedFiles : [droppedFiles[0]]);
    }
  }, [disabled, multiple, onFilesSelected]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFilesSelected]);

  const handleButtonClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const baseStyles = `
    group relative flex flex-col items-center justify-center w-full rounded-xl 
    border-2 border-dashed transition-all cursor-pointer px-6 py-10
  `;

  const stateStyles = isDragOver
    ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
    : 'border-[#dbdfe6] dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 hover:bg-[#f0f2f4] dark:hover:bg-gray-800/60 hover:border-primary/50';

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div
      className={`${baseStyles} ${stateStyles} ${disabledStyles} ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-testid="dropzone"
      data-dragging={isDragOver}
    >
      {/* Upload Icon */}
      <div className="mb-4 p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary">
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-[#111318] dark:text-white text-lg font-semibold mb-1">
        {isDragOver ? 'Solte os arquivos aqui' : 'Arraste e solte seus arquivos aqui'}
      </h3>

      {/* Description */}
      <p className="text-[#616f89] dark:text-gray-400 text-sm mb-6 text-center max-w-md">
        Suporta arquivos PDF, DOCX, XLSX, PNG e JPG até 50MB
      </p>

      {/* Select Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-[#111318] dark:text-white font-medium py-2.5 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="dropzone-button"
      >
        Selecionar Arquivos
      </button>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        data-testid="dropzone-input"
      />
    </div>
  );
};

export default DropZone;
