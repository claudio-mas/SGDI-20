import React from 'react';
import { ParticipantStatus } from './CollaborationPanel';

interface IdleIndicatorProps {
  status: ParticipantStatus;
  lastActivity?: Date;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const IdleIndicator: React.FC<IdleIndicatorProps> = ({
  status,
  lastActivity,
  showLabel = false,
  size = 'md',
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'idle':
        return getIdleTimeLabel();
      case 'offline':
        return 'Offline';
    }
  };

  const getIdleTimeLabel = () => {
    if (!lastActivity) return 'Ocioso';
    
    const diff = Date.now() - lastActivity.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `Ocioso há ${minutes}m`;
    if (hours < 24) return `Ocioso há ${hours}h`;
    return 'Ocioso há mais de 1 dia';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-2.5 h-2.5';
      case 'lg':
        return 'w-3 h-3';
    }
  };

  const getLabelSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-[9px]';
      case 'md':
        return 'text-[10px]';
      case 'lg':
        return 'text-xs';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'idle':
        return 'text-yellow-600 dark:text-yellow-500';
      case 'offline':
        return 'text-gray-400';
    }
  };

  if (showLabel) {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className={`${getSizeClasses()} ${getStatusColor()} rounded-full ${
            status === 'idle' ? 'animate-pulse' : ''
          }`}
        />
        <span className={`${getLabelSizeClasses()} ${getStatusTextColor()} font-medium`}>
          {getStatusLabel()}
        </span>
      </div>
    );
  }

  return (
    <span
      className={`${getSizeClasses()} ${getStatusColor()} rounded-full ${
        status === 'idle' ? 'animate-pulse' : ''
      }`}
      title={getStatusLabel()}
    />
  );
};

export default IdleIndicator;
