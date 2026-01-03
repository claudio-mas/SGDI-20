import { User } from './index';

// Cursor Types
export interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
  textOffset?: number;
}

export interface RemoteCursor {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  position: CursorPosition;
  lastUpdate: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userColor: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system';
}

// Participant Types
export type ParticipantStatus = 'online' | 'idle' | 'offline';
export type ParticipantRole = 'owner' | 'editor' | 'viewer';

export interface CollaborationParticipant {
  id: string;
  user: User;
  status: ParticipantStatus;
  role: ParticipantRole;
  color: string;
  cursor?: CursorPosition;
  lastActivity: Date;
  isEditing: boolean;
}

// WebSocket Message Types
export type WebSocketMessageType =
  | 'join'
  | 'leave'
  | 'cursor_move'
  | 'cursor_hide'
  | 'chat_message'
  | 'status_change'
  | 'document_change'
  | 'presence_update'
  | 'error';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  documentId: string;
  userId: string;
  timestamp: Date;
  payload: T;
}

// Specific Message Payloads
export interface JoinPayload {
  user: User;
  role: ParticipantRole;
  color: string;
}

export interface LeavePayload {
  userId: string;
}

export interface CursorMovePayload {
  position: CursorPosition;
}

export interface ChatMessagePayload {
  content: string;
  messageId: string;
}

export interface StatusChangePayload {
  status: ParticipantStatus;
  isEditing?: boolean;
}

export interface DocumentChangePayload {
  operation: 'insert' | 'delete' | 'replace';
  position: number;
  content?: string;
  length?: number;
}

export interface PresenceUpdatePayload {
  participants: CollaborationParticipant[];
}

export interface ErrorPayload {
  code: string;
  message: string;
}

// Collaboration Session State
export interface CollaborationSession {
  documentId: string;
  participants: CollaborationParticipant[];
  cursors: RemoteCursor[];
  messages: ChatMessage[];
  isConnected: boolean;
  connectionError?: string;
}

// Collaboration Events
export interface CollaborationEvents {
  onParticipantJoin?: (participant: CollaborationParticipant) => void;
  onParticipantLeave?: (userId: string) => void;
  onCursorMove?: (cursor: RemoteCursor) => void;
  onCursorHide?: (userId: string) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onStatusChange?: (userId: string, status: ParticipantStatus) => void;
  onDocumentChange?: (change: DocumentChangePayload, userId: string) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onError?: (error: ErrorPayload) => void;
}
