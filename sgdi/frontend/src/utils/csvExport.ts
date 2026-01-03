import { AuditLog } from '../types';

// Action labels for CSV export
const actionLabels: Record<string, string> = {
  create: 'Criação',
  edit: 'Edição',
  delete: 'Exclusão',
  share: 'Compartilhamento',
  view: 'Visualização',
  restore: 'Restauração',
};

/**
 * Escapes a value for CSV format
 */
const escapeCSVValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/**
 * Formats a date for CSV export
 */
const formatDateForCSV = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Converts audit logs to CSV format
 */
export const auditLogsToCSV = (logs: AuditLog[]): string => {
  const headers = [
    'Data/Hora',
    'Usuário',
    'Email',
    'Ação',
    'Documento',
    'Endereço IP',
    'Navegador',
    'Sistema Operacional',
    'Localização',
  ];

  const rows = logs.map((log) => [
    formatDateForCSV(log.timestamp),
    escapeCSVValue(log.userName),
    escapeCSVValue(log.userEmail),
    actionLabels[log.action] || log.action,
    escapeCSVValue(log.documentName),
    log.ipAddress,
    escapeCSVValue(log.details?.browser || ''),
    escapeCSVValue(log.details?.os || ''),
    escapeCSVValue(log.details?.location || ''),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
};

/**
 * Downloads a CSV file
 */
export const downloadCSV = (content: string, filename: string): void => {
  // Add BOM for UTF-8 encoding (helps Excel recognize special characters)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Exports audit logs to a CSV file
 */
export const exportAuditLogsToCSV = (logs: AuditLog[]): void => {
  const csvContent = auditLogsToCSV(logs);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `auditoria_${timestamp}.csv`;
  downloadCSV(csvContent, filename);
};
