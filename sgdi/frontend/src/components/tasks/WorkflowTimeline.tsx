import React from 'react';
import { WorkflowHistoryItem } from '../../types';

export interface WorkflowTimelineProps {
  items: WorkflowHistoryItem[];
}

const statusStyles: Record<string, { dot: string; text: string }> = {
  completed: {
    dot: 'bg-green-500',
    text: 'text-[#111318] dark:text-white',
  },
  current: {
    dot: 'bg-primary',
    text: 'text-primary',
  },
  pending: {
    dot: 'bg-gray-300 dark:bg-gray-600',
    text: 'text-[#616f89] dark:text-gray-400',
  },
};

const formatDate = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-[#616f89] dark:text-gray-400">
        Nenhum histórico disponível
      </div>
    );
  }

  return (
    <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-6" data-testid="workflow-timeline">
      {items.map((item) => {
        const styles = statusStyles[item.status] || statusStyles.pending;
        
        return (
          <div key={item.id} className="relative" data-testid={`timeline-item-${item.id}`}>
            <div className={`absolute -left-[21px] top-0 size-4 ${styles.dot} rounded-full border-4 border-white dark:border-[#111827]`}></div>
            <div className="flex flex-col gap-1">
              <p className={`text-sm font-bold ${styles.text}`}>
                {item.action}
              </p>
              <p className="text-xs text-[#616f89] dark:text-gray-400">
                {item.userName} • {formatDate(item.timestamp)}
              </p>
              {item.description && (
                <p className="text-sm text-[#111318] dark:text-gray-300 mt-1 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  "{item.description}"
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowTimeline;
