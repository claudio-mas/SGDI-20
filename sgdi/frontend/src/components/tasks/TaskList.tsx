import React from 'react';
import { WorkflowTask, TaskPriority } from '../../types';
import FileIcon, { FileType } from '../common/FileIcon';

export interface TaskListProps {
  tasks: WorkflowTask[];
  selectedTaskId?: string;
  onTaskSelect: (taskId: string) => void;
  loading?: boolean;
}

const priorityStyles: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  urgent: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    label: 'Urgente',
  },
  normal: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    label: 'Normal',
  },
};

const getDeadlineStatus = (dueDate?: Date): { style: string; label: string } => {
  if (!dueDate) {
    return { style: 'text-[#616f89] dark:text-gray-400', label: 'Sem prazo' };
  }

  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      style: 'text-red-600 font-bold',
      label: diffDays === -1 ? 'Venceu ontem' : `Venceu há ${Math.abs(diffDays)} dias`,
    };
  }
  if (diffDays === 0) {
    return { style: 'text-red-600 font-medium', label: 'Vence hoje' };
  }
  if (diffDays <= 3) {
    return { style: 'text-orange-600 font-medium', label: `Vence em ${diffDays} dias` };
  }
  return {
    style: 'text-[#616f89] dark:text-gray-400',
    label: due.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
};

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

const TaskListItem: React.FC<{
  task: WorkflowTask;
  isSelected: boolean;
  onClick: () => void;
}> = ({ task, isSelected, onClick }) => {
  const priority = priorityStyles[task.priority];
  const deadline = getDeadlineStatus(task.dueDate);
  const fileType = getFileType(task.documentType);

  return (
    <div
      className={`
        group flex items-start gap-4 p-4 border-b border-gray-100 dark:border-gray-800 
        cursor-pointer transition-all border-l-4
        ${isSelected
          ? 'bg-blue-50/60 dark:bg-blue-900/10 border-l-primary hover:bg-blue-50 dark:hover:bg-blue-900/20'
          : 'border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
      `}
      onClick={onClick}
      data-testid={`task-item-${task.id}`}
    >
      <div className="size-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm">
        <FileIcon type={fileType} size="md" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-semibold truncate pr-2 ${isSelected ? 'font-bold text-[#111318] dark:text-white' : 'text-[#111318] dark:text-white group-hover:text-primary transition-colors'}`}>
            {task.documentName}
          </h3>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.text}`}>
            {priority.label}
          </span>
        </div>
        <p className="text-sm text-[#616f89] dark:text-gray-400 mb-2">
          ID: #{task.id} • Enviado por {task.requesterName}
        </p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {task.type}
          </div>
          <div className={`flex items-center gap-1.5 ${deadline.style}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {deadline.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskId,
  onTaskSelect,
  loading = false,
}) => {
  const pendingCount = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
          <span className="text-xs font-bold text-[#616f89] uppercase tracking-wider">
            Lista de Tarefas
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="task-list">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
        <span className="text-xs font-bold text-[#616f89] uppercase tracking-wider">
          Lista de Tarefas ({pendingCount})
        </span>
        <button className="text-primary text-xs font-semibold hover:underline">
          Atualizar
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-[#616f89] dark:text-gray-400 font-medium">Nenhuma tarefa pendente</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Você está em dia!</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskListItem
              key={task.id}
              task={task}
              isSelected={task.id === selectedTaskId}
              onClick={() => onTaskSelect(task.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
