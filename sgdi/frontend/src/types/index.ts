// Type definitions for SGDI
// This file will contain shared TypeScript interfaces and types

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user' | 'auditor' | 'visitor';
  departmentId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  folderId?: string;
  ownerId: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  ownerId: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  usageCount: number;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: string;
  modifiedAt: Date;
  modifiedBy: User;
  comment?: string;
  size: number;
  isCurrent: boolean;
}

// Workflow Types
export type WorkflowNodeType = 'start' | 'review' | 'approval' | 'condition' | 'publication' | 'email' | 'end';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  name: string;
  position: { x: number; y: number };
  config: WorkflowNodeConfig;
}

export interface WorkflowNodeConfig {
  approvers?: string[];
  approvalRule?: 'any' | 'all';
  slaHours?: number;
  slaUnit?: 'hours' | 'days';
  notifyOnAssign?: boolean;
  notifyOnDelay?: boolean;
  conditionField?: string;
  conditionOperator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  conditionValue?: string | number;
  emailTemplate?: string;
  emailRecipients?: string[];
  description?: string;
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  condition?: 'approved' | 'rejected' | 'yes' | 'no';
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'inactive';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowValidationError {
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
}

// Workflow Task Types
export type TaskPriority = 'normal' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'approved' | 'rejected';

export interface WorkflowTask {
  id: string;
  workflowInstanceId: string;
  documentId: string;
  documentName: string;
  documentType: string;
  documentSize?: number;
  documentVersion?: string;
  assigneeId: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  department?: string;
  type: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  metadata?: Record<string, string | number>;
}

export interface WorkflowHistoryItem {
  id: string;
  action: string;
  description?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  status: 'completed' | 'current' | 'pending';
}


// Audit Types
export type AuditAction = 'create' | 'edit' | 'delete' | 'share' | 'view' | 'restore';

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  action: AuditAction;
  documentId?: string;
  documentName: string;
  documentDeleted?: boolean;
  ipAddress: string;
  details?: AuditLogDetails;
}

export interface AuditLogDetails {
  browser?: string;
  os?: string;
  location?: string;
  previousValue?: string;
  newValue?: string;
  sharedWith?: string[];
  permissionLevel?: string;
}

export interface AuditFiltersState {
  period: string;
  userId: string;
  action: AuditAction | '';
  documentName: string;
}
