import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types/collaboration';

interface CollaborationChatProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export const CollaborationChat: React.FC<CollaborationChatProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  disabled = false,
}) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && !disabled) {
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return `Hoje, ${formatTime(date)}`;
    }
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: ChatMessage[] }[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = formatDate(message.timestamp);
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Nenhuma mensagem ainda. Inicie a conversa!
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {/* Date separator */}
              <div className="flex justify-center my-2">
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[11px] px-3 py-1 rounded-full">
                  {group.date}
                </span>
              </div>

              {/* Messages in group */}
              {group.messages.map((message) => {
                const isOwn = message.userId === currentUserId;
                const isSystem = message.type === 'system';

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <span className="text-gray-400 text-xs italic">
                        {message.content}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    {message.userAvatar ? (
                      <div
                        className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 mt-1"
                        style={{ backgroundImage: `url(${message.userAvatar})` }}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1"
                        style={{ backgroundColor: message.userColor }}
                      >
                        {getInitials(message.userName)}
                      </div>
                    )}

                    {/* Message content */}
                    <div className={`flex flex-col gap-1 max-w-[85%] ${isOwn ? 'items-end' : ''}`}>
                      <div className={`flex items-baseline gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {isOwn ? 'Você' : message.userName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div
                        className={`p-3 shadow-sm ${
                          isOwn
                            ? 'bg-blue-600 rounded-l-lg rounded-br-lg text-white'
                            : 'bg-white dark:bg-gray-700 rounded-r-lg rounded-bl-lg border border-gray-100 dark:border-gray-600'
                        }`}
                      >
                        <p className={`text-sm ${isOwn ? '' : 'text-gray-800 dark:text-gray-200'}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Conectando...' : 'Digite sua mensagem...'}
            disabled={disabled}
            className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={disabled || !messageInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationChat;
