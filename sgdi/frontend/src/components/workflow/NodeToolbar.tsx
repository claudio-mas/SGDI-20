import React from 'react';
import { WorkflowNodeType } from '../../types';

interface NodeToolbarProps {
  onDragStart?: (type: WorkflowNodeType) => void;
}

const nodeTypes: { type: WorkflowNodeType; icon: string; label: string; bgClass: string; borderClass: string; textClass: string }[] = [
  {
    type: 'start',
    icon: 'play_circle',
    label: 'Início',
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    borderClass: 'border-green-200 dark:border-green-800',
    textClass: 'text-green-600',
  },
  {
    type: 'review',
    icon: 'rate_review',
    label: 'Revisão',
    bgClass: 'bg-white dark:bg-slate-800',
    borderClass: 'border-slate-200 dark:border-slate-600',
    textClass: 'text-slate-600 dark:text-slate-300',
  },
  {
    type: 'approval',
    icon: 'approval_delegation',
    label: 'Aprovação',
    bgClass: 'bg-white dark:bg-slate-800',
    borderClass: 'border-slate-200 dark:border-slate-600',
    textClass: 'text-slate-600 dark:text-slate-300',
  },
  {
    type: 'condition',
    icon: 'call_split',
    label: 'Condição',
    bgClass: 'bg-white dark:bg-slate-800',
    borderClass: 'border-slate-200 dark:border-slate-600',
    textClass: 'text-slate-600 dark:text-slate-300',
  },
  {
    type: 'publication',
    icon: 'publish',
    label: 'Publicação',
    bgClass: 'bg-white dark:bg-slate-800',
    borderClass: 'border-slate-200 dark:border-slate-600',
    textClass: 'text-slate-600 dark:text-slate-300',
  },
  {
    type: 'email',
    icon: 'mail',
    label: 'Email',
    bgClass: 'bg-white dark:bg-slate-800',
    borderClass: 'border-slate-200 dark:border-slate-600',
    textClass: 'text-slate-600 dark:text-slate-300',
  },
  {
    type: 'end',
    icon: 'stop_circle',
    label: 'Fim',
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    borderClass: 'border-red-200 dark:border-red-800',
    textClass: 'text-red-600',
  },
];

const NodeToolbar: React.FC<NodeToolbarProps> = ({ onDragStart }) => {
  const handleDragStart = (e: React.DragEvent, type: WorkflowNodeType) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(type);
  };

  return (
    <div className="w-16 sm:w-20 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] flex flex-col items-center py-4 gap-4 z-10">
      {nodeTypes.slice(0, -1).map((nodeType) => (
        <div
          key={nodeType.type}
          className="group relative flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={(e) => handleDragStart(e, nodeType.type)}
        >
          <div
            className={`size-10 rounded-lg ${nodeType.bgClass} border ${nodeType.borderClass} ${nodeType.textClass} 
              flex items-center justify-center hover:shadow-md hover:border-primary transition-all`}
          >
            <span className={`material-symbols-outlined ${nodeType.type === 'condition' ? 'rotate-45' : ''}`}>
              {nodeType.icon}
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500">{nodeType.label}</span>
        </div>
      ))}
      
      {/* End node at bottom */}
      <div
        className="mt-auto group relative flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => handleDragStart(e, 'end')}
      >
        <div className={`size-10 rounded-lg ${nodeTypes[nodeTypes.length - 1].bgClass} border ${nodeTypes[nodeTypes.length - 1].borderClass} ${nodeTypes[nodeTypes.length - 1].textClass} flex items-center justify-center hover:shadow-md transition-all`}>
          <span className="material-symbols-outlined">{nodeTypes[nodeTypes.length - 1].icon}</span>
        </div>
        <span className="text-[10px] font-medium text-slate-500">{nodeTypes[nodeTypes.length - 1].label}</span>
      </div>
    </div>
  );
};

export default NodeToolbar;
