import React, { useState } from 'react';
import { WorkflowTask, WorkflowHistoryItem } from '../../types';
import FileIcon, { FileType } from '../common/FileIcon';
import Button from '../common/Button';
import WorkflowTimeline from './WorkflowTimeline';

export interface TaskDetailProps {
  task: WorkflowTask | null;
  history?: WorkflowHistoryItem[];
  onApprove: (taskId: string, comment?: string) => void;
  onReject: (taskId: string, reason: string) => void;
  onClose?: () => void;
  onViewDocument?: (documentId: string) => void;
  onDownloadDocument?: (documentId: string) => void;
}

const getFileType = (documentType: string): FileType => {
  const typeMap: Record<string, FileType> = {
    'application/pdf': 'pdf',
    'pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'docx': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'xlsx': 'xlsx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'pptx': 'pptx',
    'image/jpeg': 'jpg',
    'jpg': 'jpg',
    'image/png': 'png',
    'png': 'png',
    'application/zip': 'zip',
    'zip': 'zip',
  };
  return typeMap[documentType.toLowerCase()] || 'unknown';
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Tamanho desconhecido';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  history = [],
  onApprove,
  onReject,
  onClose,
  onViewDocument,
  onDownloadDocument,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!task) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50/50 dark:bg-[#111827] p-8">
        <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-[#616f89] dark:text-gray-400 font-medium text-center">
          Selecione uma tarefa para ver os detalhes
        </p>
      </div>
    );
  }

  const fileType = getFileType(task.documentType);
  const createdDate = new Date(task.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(task.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-[#111827] relative" data-testid="task-detail">
      {/* Detail Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark sticky top-0 z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-primary dark:bg-primary/20 dark:text-blue-300 uppercase tracking-wide">
            {task.type}
          </span>
          <div className="flex gap-2">
            <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              title="Expandir"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            {onClose && (
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Fechar"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#111318] dark:text-white mb-2 leading-tight">
          {task.documentName}
        </h2>
        <div className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Iniciado em {createdDate}</span>
        </div>
      </div>

      {/* Detail Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {/* Document Card */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => onViewDocument?.(task.documentId)}
        >
          <div className="size-16 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
            <FileIcon type={fileType} size="lg" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#111318] dark:text-white mb-1 group-hover:text-primary">
              {task.documentName}
            </p>
            <p className="text-sm text-[#616f89] dark:text-gray-400">
              {formatFileSize(task.documentSize)} • Versão {task.documentVersion || '1.0'}
            </p>
          </div>
          <button
            className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-[#616f89] dark:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onViewDocument?.(task.documentId);
            }}
            title="Visualizar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-[#616f89] dark:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadDocument?.(task.documentId);
            }}
            title="Download"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#616f89] uppercase mb-1">Solicitante</p>
            <div className="flex items-center gap-2">
              {task.requesterAvatar ? (
                <img
                  src={task.requesterAvatar}
                  alt={task.requesterName}
                  className="size-6 rounded-full"
                />
              ) : (
                <div className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                  {task.requesterName.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="text-sm font-medium text-[#111318] dark:text-white">{task.requesterName}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#616f89] uppercase mb-1">Departamento</p>
            <p className="text-sm font-medium text-[#111318] dark:text-white">
              {task.department || 'Não especificado'}
            </p>
          </div>
          {task.metadata && Object.entries(task.metadata).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs font-semibold text-[#616f89] uppercase mb-1">{key}</p>
              <p className="text-sm font-medium text-[#111318] dark:text-white">{value}</p>
            </div>
          ))}
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Timeline */}
        {history.length > 0 && (
          <div>
            <h3 className="font-bold text-[#111318] dark:text-white mb-4">Histórico do Workflow</h3>
            <WorkflowTimeline items={history} />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark sticky bottom-0 z-10 flex gap-3">
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => onApprove(task.id)}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        >
          Aprovar
        </Button>
        <Button
          variant="secondary"
          className="flex-1 border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => setShowRejectModal(true)}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        >
          Rejeitar
        </Button>
        <button
          className="size-[42px] flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-[#616f89] hover:bg-gray-50 dark:hover:bg-gray-800"
          title="Mais opções"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-[#111318] dark:text-white">
                Rejeitar Tarefa
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-[#111318] dark:text-white mb-2">
                Motivo da rejeição *
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                placeholder="Descreva o motivo da rejeição..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                Confirmar Rejeição
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
