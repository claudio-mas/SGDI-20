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
