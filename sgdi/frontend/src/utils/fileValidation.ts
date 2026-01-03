/**
 * File validation utilities for upload functionality
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileValidationOptions {
  /** Maximum file size in bytes (default: 50MB) */
  maxSize?: number;
  /** Allowed file extensions (with dot, e.g., '.pdf') */
  allowedExtensions?: string[];
  /** Allowed MIME types */
  allowedMimeTypes?: string[];
}

/** Default allowed file extensions */
export const DEFAULT_ALLOWED_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.doc',
  '.xlsx',
  '.xls',
  '.pptx',
  '.ppt',
  '.jpg',
  '.jpeg',
  '.png',
  '.zip',
];

/** Default allowed MIME types */
export const DEFAULT_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'application/zip',
  'application/x-zip-compressed',
];

/** Default maximum file size: 50MB */
export const DEFAULT_MAX_SIZE = 50 * 1024 * 1024;

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Validate a single file against the specified options
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxSize = DEFAULT_MAX_SIZE,
    allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
    allowedMimeTypes = DEFAULT_ALLOWED_MIME_TYPES,
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${formatFileSize(maxSize)}`,
    };
  }

  // Check file extension
  const extension = getFileExtension(file.name);
  const isExtensionAllowed = allowedExtensions.some(
    (ext) => ext.toLowerCase() === extension
  );

  // Check MIME type
  const isMimeTypeAllowed = allowedMimeTypes.includes(file.type);

  // Accept if either extension or MIME type is valid
  // (some browsers may not report MIME type correctly)
  if (!isExtensionAllowed && !isMimeTypeAllowed) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedExtensions.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate multiple files and return results for each
 */
export function validateFiles(
  files: File[],
  options: FileValidationOptions = {}
): Map<File, FileValidationResult> {
  const results = new Map<File, FileValidationResult>();
  
  for (const file of files) {
    results.set(file, validateFile(file, options));
  }
  
  return results;
}

/**
 * Get file type category for icon display
 */
export function getFileTypeCategory(
  file: File
): 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'jpg' | 'png' | 'zip' | 'unknown' {
  const extension = getFileExtension(file.name);
  
  switch (extension) {
    case '.pdf':
      return 'pdf';
    case '.doc':
    case '.docx':
      return 'docx';
    case '.xls':
    case '.xlsx':
      return 'xlsx';
    case '.ppt':
    case '.pptx':
      return 'pptx';
    case '.jpg':
    case '.jpeg':
      return 'jpg';
    case '.png':
      return 'png';
    case '.zip':
      return 'zip';
    default:
      return 'unknown';
  }
}
