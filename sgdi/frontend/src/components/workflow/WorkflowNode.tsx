import React from 'react';
import { WorkflowNode, WorkflowNodeType } from '../../types';

interface WorkflowNodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const nodeTypeConfig: Record<WorkflowNodeType, {
  icon: string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconBg: string;
}> = {
  start: {
    icon: 'play_circle',
    label: 'Início',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    borderColor: 'border-green-500',
    textColor: 'text-green-700 dark:text-green-300',
    iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600',
  },
  review: {
    icon: 'rate_review',
    label: 'Revisão',
    bgColor: 'bg-white dark:bg-slate-800',
    borderColor: 'border-slate-200 dark:border-slate-600',
    textColor: 'text-slate-800 dark:text-white',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  },
  approval: {
    icon: 'approval_delegation',
    label: 'Aprovação',
    bgColor: 'bg-white dark:bg-slate-800',
    borderColor: 'border-slate-200 dark:border-slate-600',
    textColor: 'text-slate-800 dark:text-white',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  },
  condition: {
    icon: 'call_split',
    label: 'Condição',
    bgColor: 'bg-white dark:bg-slate-800',
    borderColor: 'border-slate-200 dark:border-slate-600',
    textColor: 'text-slate-800 dark:text-white',
    iconBg: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600',
  },
  publication: {
    icon: 'publish',
    label: 'Publicação',
    bgColor: 'bg-white dark:bg-slate-800',
    borderColor: 'border-slate-200 dark:border-slate-600',
    textColor: 'text-slate-800 dark:text-white',
    iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  },
  email: {
    icon: 'mail',
    label: 'Email',
    bgColor: 'bg-white dark:bg-slate-800',
    borderColor: 'border-slate-200 dark:border-slate-600',
    textColor: 'text-slate-800 dark:text-white',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  },
  end: {
    icon: 'stop_circle',
    label: 'Fim',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    borderColor: 'border-red-500',
    textColor: 'text-red-700 dark:text-red-300',
    iconBg: 'bg-red-100 dark:bg-red-900/30 text-red-600',
  },
};

const WorkflowNodeComponent: React.FC<WorkflowNodeComponentProps> = ({
  node,
  isSelected,
  onMouseDown,
  onClick,
}) => {
  const config = nodeTypeConfig[node.type];

  // Start and End nodes have special styling
  if (node.type === 'start' || node.type === 'end') {
    return (
      <div
        className={`absolute w-[100px] h-[40px] ${config.bgColor} border-2 ${config.borderColor} rounded-full 
          flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:scale-105 transition-transform
          ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#f8fafc] dark:ring-offset-[#0f172a]' : ''}`}
        style={{ left: node.position.x, top: node.position.y }}
        onMouseDown={onMouseDown}
        onClick={onClick}
      >
        <span className={`text-xs font-bold ${config.textColor}`}>
          {node.type === 'start' ? 'INÍCIO' : 'FIM'}
        </span>
      </div>
    );
  }

  // Condition node has diamond-like appearance
  if (node.type === 'condition') {
    return (
      <div
        className={`absolute w-[200px] ${config.bgColor} border ${config.borderColor} rounded-xl p-3 
          shadow-md cursor-pointer flex items-center justify-between hover:border-primary transition-colors
          ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#f8fafc] dark:ring-offset-[#0f172a]' : ''}`}
        style={{ left: node.position.x, top: node.position.y }}
        onMouseDown={onMouseDown}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className={`size-9 rounded-lg ${config.iconBg} flex items-center justify-center transform rotate-45 border border-purple-100 dark:border-purple-800/30`}>
            <span className="material-symbols-outlined text-[20px] transform -rotate-45">{config.icon}</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-bold ${config.textColor}`}>{node.name}</span>
            <span className="text-[10px] text-slate-500">Condicional</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard node (review, approval, publication, email)
  return (
    <div
      className={`absolute w-[240px] ${config.bgColor} border ${config.borderColor} rounded-xl p-4 
        shadow-sm hover:shadow-lg cursor-pointer group transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#f8fafc] dark:ring-offset-[#0f172a]' : ''}`}
      style={{ left: node.position.x, top: node.position.y }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 ${config.iconBg} rounded-lg shadow-sm`}>
          <span className="material-symbols-outlined text-[20px]">{config.icon}</span>
        </div>
        <span className="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-600">
          {config.label.toUpperCase()}
        </span>
      </div>
      <h4 className={`font-bold text-sm ${config.textColor} mb-1`}>{node.name}</h4>
      {node.config.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{node.config.description}</p>
      )}
      
      {/* Hover delete button */}
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-1">
        <div className="size-6 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:text-red-500">
          <span className="material-symbols-outlined text-[14px]">close</span>
        </div>
      </div>
    </div>
  );
};

export default WorkflowNodeComponent;
