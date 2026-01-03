import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '../types';
import {
  CollaborationSession,
  CollaborationEvents,
  CollaborationParticipant,
  RemoteCursor,
  ChatMessage,
  CursorPosition,
  ParticipantStatus,
  ParticipantRole,
  WebSocketMessage,
  JoinPayload,
  CursorMovePayload,
  ChatMessagePayload,
  StatusChangePayload,
  PresenceUpdatePayload,
  ErrorPayload,
} from '../types/collaboration';

interface UseCollaborationOptions {
  documentId: string;
  user: User;
  role?: ParticipantRole;
  wsUrl?: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  events?: CollaborationEvents;
}

interface UseCollaborationResult {
  session: CollaborationSession;
  sendCursorPosition: (position: CursorPosition) => void;
  hideCursor: () => void;
  sendChatMessage: (content: string) => void;
  updateStatus: (status: ParticipantStatus, isEditing?: boolean) => void;
  disconnect: () => void;
  reconnect: () => void;
}

// Generate a random color for the user
const generateUserColor = (): string => {
  const colors = [
    '#8B5CF6', // purple
    '#F97316', // orange
    '#10B981', // green
    '#3B82F6', // blue
    '#EF4444', // red
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F59E0B', // amber
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate a unique message ID
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export function useCollaboration(options: UseCollaborationOptions): UseCollaborationResult {
  const {
    documentId,
    user,
    role = 'viewer',
    wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/collaboration`,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    events = {},
  } = options;

  const [session, setSession] = useState<CollaborationSession>({
    documentId,
    participants: [],
    cursors: [],
    messages: [],
    isConnected: false,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userColorRef = useRef(generateUserColor());

  // Send a message through WebSocket
  const sendMessage = useCallback(<T>(type: string, payload: T) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage<T> = {
        type: type as WebSocketMessage['type'],
        documentId,
        userId: user.id,
        timestamp: new Date(),
        payload,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, [documentId, user.id]);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Ignore messages from self
      if (message.userId === user.id && message.type !== 'presence_update') {
        return;
      }

      switch (message.type) {
        case 'join': {
          const payload = message.payload as JoinPayload;
          const newParticipant: CollaborationParticipant = {
            id: message.userId,
            user: payload.user,
            status: 'online',
            role: payload.role,
            color: payload.color,
            lastActivity: new Date(),
            isEditing: false,
          };
          setSession(prev => ({
            ...prev,
            participants: [...prev.participants.filter(p => p.id !== message.userId), newParticipant],
          }));
          events.onParticipantJoin?.(newParticipant);
          break;
        }

        case 'leave': {
          setSession(prev => ({
            ...prev,
            participants: prev.participants.filter(p => p.id !== message.userId),
            cursors: prev.cursors.filter(c => c.userId !== message.userId),
          }));
          events.onParticipantLeave?.(message.userId);
          break;
        }

        case 'cursor_move': {
          const payload = message.payload as CursorMovePayload;
          const participant = session.participants.find(p => p.id === message.userId);
          if (participant) {
            const cursor: RemoteCursor = {
              id: `cursor_${message.userId}`,
              userId: message.userId,
              userName: participant.user.name,
              userColor: participant.color,
              position: payload.position,
              lastUpdate: new Date(),
            };
            setSession(prev => ({
              ...prev,
              cursors: [...prev.cursors.filter(c => c.userId !== message.userId), cursor],
            }));
            events.onCursorMove?.(cursor);
          }
          break;
        }

        case 'cursor_hide': {
          setSession(prev => ({
            ...prev,
            cursors: prev.cursors.filter(c => c.userId !== message.userId),
          }));
          events.onCursorHide?.(message.userId);
          break;
        }

        case 'chat_message': {
          const payload = message.payload as ChatMessagePayload;
          const participant = session.participants.find(p => p.id === message.userId);
          if (participant) {
            const chatMessage: ChatMessage = {
              id: payload.messageId,
              documentId,
              userId: message.userId,
              userName: participant.user.name,
              userAvatar: participant.user.avatar,
              userColor: participant.color,
              content: payload.content,
              timestamp: new Date(message.timestamp),
              type: 'message',
            };
            setSession(prev => ({
              ...prev,
              messages: [...prev.messages, chatMessage],
            }));
            events.onChatMessage?.(chatMessage);
          }
          break;
        }

        case 'status_change': {
          const payload = message.payload as StatusChangePayload;
          setSession(prev => ({
            ...prev,
            participants: prev.participants.map(p =>
              p.id === message.userId
                ? { ...p, status: payload.status, isEditing: payload.isEditing ?? p.isEditing, lastActivity: new Date() }
                : p
            ),
          }));
          events.onStatusChange?.(message.userId, payload.status);
          break;
        }

        case 'presence_update': {
          const payload = message.payload as PresenceUpdatePayload;
          setSession(prev => ({
            ...prev,
            participants: payload.participants,
          }));
          break;
        }

        case 'error': {
          const payload = message.payload as ErrorPayload;
          setSession(prev => ({
            ...prev,
            connectionError: payload.message,
          }));
          events.onError?.(payload);
          break;
        }
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [documentId, user.id, session.participants, events]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(`${wsUrl}/${documentId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectCountRef.current = 0;
        setSession(prev => ({
          ...prev,
          isConnected: true,
          connectionError: undefined,
        }));
        events.onConnectionChange?.(true);

        // Send join message
        const joinPayload: JoinPayload = {
          user,
          role,
          color: userColorRef.current,
        };
        sendMessage('join', joinPayload);
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        setSession(prev => ({
          ...prev,
          isConnected: false,
        }));
        events.onConnectionChange?.(false);

        // Attempt to reconnect
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setSession(prev => ({
          ...prev,
          connectionError: 'Connection error',
        }));
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }, [wsUrl, documentId, user, role, reconnectAttempts, reconnectInterval, sendMessage, handleMessage, events]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      sendMessage('leave', { userId: user.id });
      wsRef.current.close();
      wsRef.current = null;
    }
    setSession(prev => ({
      ...prev,
      isConnected: false,
      participants: [],
      cursors: [],
    }));
  }, [sendMessage, user.id]);

  // Reconnect to WebSocket
  const reconnect = useCallback(() => {
    disconnect();
    reconnectCountRef.current = 0;
    connect();
  }, [disconnect, connect]);

  // Send cursor position
  const sendCursorPosition = useCallback((position: CursorPosition) => {
    const payload: CursorMovePayload = { position };
    sendMessage('cursor_move', payload);
  }, [sendMessage]);

  // Hide cursor
  const hideCursor = useCallback(() => {
    sendMessage('cursor_hide', {});
  }, [sendMessage]);

  // Send chat message
  const sendChatMessage = useCallback((content: string) => {
    const payload: ChatMessagePayload = {
      content,
      messageId: generateMessageId(),
    };
    sendMessage('chat_message', payload);

    // Add message to local state immediately
    const chatMessage: ChatMessage = {
      id: payload.messageId,
      documentId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userColor: userColorRef.current,
      content,
      timestamp: new Date(),
      type: 'message',
    };
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, chatMessage],
    }));
  }, [sendMessage, documentId, user]);

  // Update status
  const updateStatus = useCallback((status: ParticipantStatus, isEditing?: boolean) => {
    const payload: StatusChangePayload = { status, isEditing };
    sendMessage('status_change', payload);
  }, [sendMessage]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    session,
    sendCursorPosition,
    hideCursor,
    sendChatMessage,
    updateStatus,
    disconnect,
    reconnect,
  };
}

export default useCollaboration;
