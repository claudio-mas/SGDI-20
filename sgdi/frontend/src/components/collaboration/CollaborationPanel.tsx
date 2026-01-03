import React, { useState } from 'react';
import { User } from '../../types';

export type ParticipantStatus = 'online' | 'idle' | 'offline';
export type ParticipantRole = 'editor' | 'viewer' | 'owner';

export interface Participant {
  id: string;
  user: User;
  status: ParticipantStatus;
  role: ParticipantRole;
  color: string;
  lastActivity?: Date;
  isEditing?: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userColor: string;
  content: string;
  timestamp: Date;
  isOwn?: boolean;
}

interface CollaborationPanelProps {
  participants: Participant[];
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage?: (content: string) => void;
  onRoleChange?: (participantId: string, role: ParticipantRole) => void;
  onManageParticipants?: () => void;
}

type TabType = 'chat' | 'participants' | 'history';

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  participants,
  messages,
  currentUserId,
  onSendMessage,
  onRoleChange,
  onManageParticipants,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [messageInput, setMessageInput] = useState('');

  const onlineParticipants = participants.filter(p => p.status !== 'offline');
  const unreadCount = messages.length;

  const handleSendMessage = () => {
    if (messageInput.trim() && onSendMessage) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getIdleTime = (lastActivity?: Date) => {
    if (!lastActivity) return '';
    const diff = Date.now() - lastActivity.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `Ocioso há ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `Ocioso há ${hours}h`;
  };

  const getStatusColor = (status: ParticipantStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: ParticipantRole) => {
    switch (role) {
      case 'editor': return 'edit';
      case 'viewer': return 'visibility';
      case 'owner': return 'admin_panel_settings';
    }
  };

  const getRoleLabel = (role: ParticipantRole) => {
    switch (role) {
      case 'editor': return 'Editor';
      case 'viewer': return 'Leitor';
      case 'owner': return 'Dono';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${formatTime(date)}`;
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <aside className="w-[360px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shrink-0 shadow-xl">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Chat ({unreadCount})
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'participants'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Participantes ({participants.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Histórico
        </button>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900/50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Nenhuma mensagem ainda
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                  
                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-2">
                          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[11px] px-3 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                        {message.userAvatar ? (
                          <div
                            className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 mt-1"
                            style={{ backgroundColor: message.userColor, backgroundImage: `url(${message.userAvatar})` }}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1"
                            style={{ backgroundColor: message.userColor }}
                          >
                            {getInitials(message.userName)}
                          </div>
                        )}
                        <div className={`flex flex-col gap-1 max-w-[85%] ${message.isOwn ? 'items-end' : ''}`}>
                          <div className={`flex items-baseline gap-2 ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                              {message.isOwn ? 'Você' : message.userName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div
                            className={`p-3 shadow-sm ${
                              message.isOwn
                                ? 'bg-blue-600 rounded-l-lg rounded-br-lg text-white'
                                : 'bg-white dark:bg-gray-700 rounded-r-lg rounded-bl-lg border border-gray-100 dark:border-gray-600'
                            }`}
                          >
                            <p className={`text-sm ${message.isOwn ? '' : 'text-gray-800 dark:text-gray-200'}`}>
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Online agora ({onlineParticipants.length})
            </h3>
            {onManageParticipants && (
              <button
                onClick={onManageParticipants}
                className="text-blue-600 text-xs font-semibold hover:underline"
              >
                Gerenciar
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {participants.map((participant) => (
              <ParticipantItem
                key={participant.id}
                participant={participant}
                isCurrentUser={participant.user.id === currentUserId}
                onRoleChange={onRoleChange}
                getInitials={getInitials}
                getIdleTime={getIdleTime}
                getStatusColor={getStatusColor}
                getRoleIcon={getRoleIcon}
                getRoleLabel={getRoleLabel}
              />
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center text-gray-400 text-sm py-8">
            Histórico de alterações em breve
          </div>
        </div>
      )}

      {/* Online Preview (always visible at bottom) */}
      {activeTab === 'chat' && onlineParticipants.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Online agora
            </h3>
            {onManageParticipants && (
              <button
                onClick={onManageParticipants}
                className="text-blue-600 text-xs font-semibold hover:underline"
              >
                Gerenciar
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {onlineParticipants.slice(0, 2).map((participant) => (
              <ParticipantItem
                key={participant.id}
                participant={participant}
                isCurrentUser={participant.user.id === currentUserId}
                onRoleChange={onRoleChange}
                getInitials={getInitials}
                getIdleTime={getIdleTime}
                getStatusColor={getStatusColor}
                getRoleIcon={getRoleIcon}
                getRoleLabel={getRoleLabel}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};


// Participant Item Component
interface ParticipantItemProps {
  participant: Participant;
  isCurrentUser: boolean;
  onRoleChange?: (participantId: string, role: ParticipantRole) => void;
  getInitials: (name: string) => string;
  getIdleTime: (lastActivity?: Date) => string;
  getStatusColor: (status: ParticipantStatus) => string;
  getRoleIcon: (role: ParticipantRole) => string;
  getRoleLabel: (role: ParticipantRole) => string;
  compact?: boolean;
}

const ParticipantItem: React.FC<ParticipantItemProps> = ({
  participant,
  isCurrentUser,
  onRoleChange,
  getInitials,
  getIdleTime,
  getStatusColor,
  getRoleIcon,
  getRoleLabel,
  compact = false,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleRoleSelect = (role: ParticipantRole) => {
    if (onRoleChange && !isCurrentUser && participant.role !== 'owner') {
      onRoleChange(participant.id, role);
    }
    setShowRoleMenu(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          {participant.user.avatar ? (
            <div
              className="w-8 h-8 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${participant.user.avatar})` }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: participant.color }}
            >
              {getInitials(participant.user.name)}
            </div>
          )}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusColor(participant.status)} border-2 border-white dark:border-gray-800 rounded-full`}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {participant.user.name}
            {isCurrentUser && <span className="text-gray-400 ml-1">(você)</span>}
          </span>
          {participant.isEditing ? (
            <span className="text-[10px] font-medium" style={{ color: participant.color }}>
              Editando...
            </span>
          ) : participant.status === 'idle' ? (
            <span className="text-[10px] text-gray-400">
              {getIdleTime(participant.lastActivity)}
            </span>
          ) : participant.status === 'offline' ? (
            <span className="text-[10px] text-gray-400">Offline</span>
          ) : (
            <span className="text-[10px] text-green-500">Online</span>
          )}
        </div>
      </div>
      
      {!compact && (
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            disabled={isCurrentUser || participant.role === 'owner'}
            className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300 ${
              !isCurrentUser && participant.role !== 'owner' ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {getRoleIcon(participant.role)}
            </span>
            <span>{getRoleLabel(participant.role)}</span>
            {!isCurrentUser && participant.role !== 'owner' && (
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            )}
          </button>
          
          {showRoleMenu && !isCurrentUser && participant.role !== 'owner' && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => handleRoleSelect('editor')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Editor
              </button>
              <button
                onClick={() => handleRoleSelect('viewer')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Leitor
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaborationPanel;
