/**
 * Property-Based Test for File Validation
 * 
 * Feature: integracao-templates, Property 12: File Validation
 * Validates: Requirements 13.2, 13.6
 * 
 * Property: For any file selected for upload, the UploadModal_Component SHALL:
 * (a) accept files with allowed types (pdf, docx, xlsx, pptx, jpg, png, zip)
 * (b) reject files with disallowed types
 * (c) accept files under 50MB
 * (d) reject files over 50MB with an error message
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateFile,
  DEFAULT_ALLOWED_EXTENSIONS,
  DEFAULT_MAX_SIZE,
  getFileExtension,
  formatFileSize,
} from '../../utils/fileValidation';

// Allowed extensions for testing
const allowedExtensions = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.jpg', '.jpeg', '.png', '.zip'];

// Disallowed extensions for testing
const disallowedExtensions = ['.exe', '.bat', '.sh', '.cmd', '.msi', '.dll', '.js', '.html', '.php', '.py'];

// MIME types mapping
const extensionToMimeType: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xls': 'application/vnd.ms-excel',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.zip': 'application/zip',
};

// Helper to create a mock File object
function createMockFile(name: string, size: number, type: string): File {
  const blob = new Blob(['x'.repeat(Math.min(size, 1000))], { type });
  Object.defineProperty(blob, 'size', { value: size });
  Object.defineProperty(blob, 'name', { value: name });
  return blob as File;
}

// Arbitraries
const allowedExtensionArb = fc.constantFrom(...allowedExtensions);
const disallowedExtensionArb = fc.constantFrom(...disallowedExtensions);
const filenameBaseArb = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => s.trim().length > 0 && !s.includes('.') && !s.includes('/') && !s.includes('\\'));

// Size under 50MB (1 byte to 50MB - 1 byte)
const validSizeArb = fc.integer({ min: 1, max: DEFAULT_MAX_SIZE - 1 });

// Size over 50MB (50MB + 1 byte to 100MB)
const invalidSizeArb = fc.integer({ min: DEFAULT_MAX_SIZE + 1, max: DEFAULT_MAX_SIZE * 2 });

describe('File Validation Property Tests', () => {
  describe('Property 12a: Accept files with allowed types', () => {
    it('For any file with allowed extension and valid size, validation SHALL pass', () => {
      fc.assert(
        fc.property(filenameBaseArb, allowedExtensionArb, validSizeArb, (baseName, extension, size) => {
          const filename = `${baseName}${extension}`;
          const mimeType = extensionToMimeType[extension] || 'application/octet-stream';
          const file = createMockFile(filename, size, mimeType);
          
          const result = validateFile(file);
          
          return result.valid === true && result.error === undefined;
        }),
        { numRuns: 100 }
      );
    });

    it('For any allowed extension, getFileExtension SHALL correctly extract it', () => {
      fc.assert(
        fc.property(filenameBaseArb, allowedExtensionArb, (baseName, extension) => {
          const filename = `${baseName}${extension}`;
          const extractedExtension = getFileExtension(filename);
          
          return extractedExtension === extension.toLowerCase();
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 12b: Reject files with disallowed types', () => {
    it('For any file with disallowed extension, validation SHALL fail with error', () => {
      fc.assert(
        fc.property(filenameBaseArb, disallowedExtensionArb, validSizeArb, (baseName, extension, size) => {
          const filename = `${baseName}${extension}`;
          // Use a generic MIME type that's not in the allowed list
          const file = createMockFile(filename, size, 'application/octet-stream');
          
          const result = validateFile(file);
          
          return result.valid === false && 
                 result.error !== undefined && 
                 result.error.includes('Tipo de arquivo não permitido');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 12c: Accept files under 50MB', () => {
    it('For any file size under 50MB with allowed type, validation SHALL pass', () => {
      fc.assert(
        fc.property(validSizeArb, (size) => {
          const file = createMockFile('document.pdf', size, 'application/pdf');
          
          const result = validateFile(file);
          
          return result.valid === true;
        }),
        { numRuns: 100 }
      );
    });

    it('For any file exactly at 50MB boundary, validation SHALL pass', () => {
      const file = createMockFile('document.pdf', DEFAULT_MAX_SIZE, 'application/pdf');
      const result = validateFile(file);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('Property 12d: Reject files over 50MB with error message', () => {
    it('For any file size over 50MB, validation SHALL fail with size error', () => {
      fc.assert(
        fc.property(invalidSizeArb, (size) => {
          const file = createMockFile('document.pdf', size, 'application/pdf');
          
          const result = validateFile(file);
          
          return result.valid === false && 
                 result.error !== undefined && 
                 result.error.includes('Arquivo muito grande');
        }),
        { numRuns: 100 }
      );
    });

    it('For any file over 50MB, error message SHALL include max size', () => {
      fc.assert(
        fc.property(invalidSizeArb, (size) => {
          const file = createMockFile('document.pdf', size, 'application/pdf');
          
          const result = validateFile(file);
          
          // Error should mention the max size (50 MB)
          return result.error !== undefined && result.error.includes('50');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('formatFileSize utility', () => {
    it('For any file size, formatFileSize SHALL return a human-readable string', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: DEFAULT_MAX_SIZE * 10 }), (size) => {
          const formatted = formatFileSize(size);
          
          // Should contain a number and a unit
          const hasNumber = /\d/.test(formatted);
          const hasUnit = /[BKMG]/.test(formatted);
          
          return hasNumber && hasUnit;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge cases', () => {
    it('Files with no extension SHALL be rejected', () => {
      fc.assert(
        fc.property(filenameBaseArb, validSizeArb, (baseName, size) => {
          // Ensure no dot in filename
          const filename = baseName.replace(/\./g, '');
          const file = createMockFile(filename, size, 'application/octet-stream');
          
          const result = validateFile(file);
          
          return result.valid === false;
        }),
        { numRuns: 100 }
      );
    });

    it('Files with uppercase extensions SHALL be accepted', () => {
      fc.assert(
        fc.property(filenameBaseArb, allowedExtensionArb, validSizeArb, (baseName, extension, size) => {
          const filename = `${baseName}${extension.toUpperCase()}`;
          const mimeType = extensionToMimeType[extension] || 'application/octet-stream';
          const file = createMockFile(filename, size, mimeType);
          
          const result = validateFile(file);
          
          return result.valid === true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
