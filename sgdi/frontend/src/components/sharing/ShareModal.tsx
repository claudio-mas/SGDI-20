import React, { useState, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Dropdown, DropdownOption } from '../common/Dropdown';

export type PermissionLevel = 'owner' | 'editor' | 'viewer';

export interface SharePermission {
  id: string;
  type: 'user' | 'group';
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
  memberCount?: number;
  permission: PermissionLevel;
  isOwner?: boolean;
  isCurrentUser?: boolean;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentType?: string;
  permissions: SharePermission[];
  publicLinkEnabled?: boolean;
  publicLink?: string;
  onAddUser: (email: string, permission: PermissionLevel) => void;
  onUpdatePermission: (id: string, permission: PermissionLevel) => void;
  onRemoveAccess: (id: string) => void;
  onTogglePublicLink: (enabled: boolean) => void;
  onCopyLink: () => void;
  onSave: () => void;
  loading?: boolean;
}

const permissionOptions: DropdownOption[] = [
  { value: 'editor', label: 'Edição' },
  { value: 'viewer', label: 'Leitura' },
];

const permissionOptionsWithRemove: DropdownOption[] = [
  { value: 'editor', label: 'Edição' },
  { value: 'viewer', label: 'Leitura' },
  { value: 'remove', label: 'Remover acesso', variant: 'danger' },
];

const getPermissionLabel = (permission: PermissionLevel): string => {
  switch (permission) {
    case 'owner':
      return 'Proprietário';
    case 'editor':
      return 'Edição';
    case 'viewer':
      return 'Leitura';
    default:
      return permission;
  }
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  documentName,
  documentType = 'description',
  permissions,
  publicLinkEnabled = false,
  publicLink,
  onAddUser,
  onUpdatePermission,
  onRemoveAccess,
  onTogglePublicLink,
  onCopyLink,
  onSave,
  loading = false,
}) => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPermission, setNewUserPermission] = useState<PermissionLevel>('viewer');

  const handleAddUser = useCallback(() => {
    if (newUserEmail.trim()) {
      onAddUser(newUserEmail.trim(), newUserPermission);
      setNewUserEmail('');
      setNewUserPermission('viewer');
    }
  }, [newUserEmail, newUserPermission, onAddUser]);

  const handlePermissionChange = useCallback(
    (id: string, value: string) => {
      if (value === 'remove') {
        onRemoveAccess(id);
      } else {
        onUpdatePermission(id, value as PermissionLevel);
      }
    },
    [onUpdatePermission, onRemoveAccess]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAddUser();
      }
    },
    [handleAddUser]
  );

  const renderAvatar = (permission: SharePermission) => {
    if (permission.avatar) {
      return (
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0 ring-2 ring-white dark:ring-surface-dark shadow-sm"
          style={{ backgroundImage: `url("${permission.avatar}")` }}
          data-testid={`avatar-${permission.id}`}
        />
      );
    }

    if (permission.type === 'group') {
      return (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0">
          <span className="material-symbols-outlined">groups</span>
        </div>
      );
    }

    const initials = permission.initials || getInitials(permission.name);
    return (
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 shrink-0 font-medium">
        {initials}
      </div>
    );
  };

  const renderPermissionItem = (permission: SharePermission) => {
    const isOwner = permission.isOwner || permission.permission === 'owner';

    return (
      <div
        key={permission.id}
        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
        data-testid={`permission-item-${permission.id}`}
      >
        <div className="flex items-center gap-3">
          {renderAvatar(permission)}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-main dark:text-white flex items-center gap-2">
              {permission.name}
              {permission.isCurrentUser && ' (Você)'}
              {permission.isCurrentUser && (
                <span className="hidden group-hover:inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                  Eu
                </span>
              )}
            </span>
            <span className="text-xs text-text-secondary dark:text-gray-400">
              {permission.type === 'group'
                ? `Grupo • ${permission.memberCount || 0} membros`
                : permission.email}
            </span>
          </div>
        </div>

        {isOwner ? (
          <span className="text-sm text-text-secondary dark:text-gray-400 font-medium px-3">
            {getPermissionLabel(permission.permission)}
          </span>
        ) : (
          <Dropdown
            options={permissionOptionsWithRemove}
            value={permission.permission}
            onChange={(value) => handlePermissionChange(permission.id, value)}
            variant="ghost"
            size="sm"
            aria-label={`Alterar permissão de ${permission.name}`}
            data-testid={`permission-dropdown-${permission.id}`}
          />
        )}
      </div>
    );
  };

  const footer = (
    <div className="flex justify-between items-center">
      <button
        className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
        data-testid="advanced-settings-button"
      >
        <span className="material-symbols-outlined text-[18px]">settings</span>
        Configurações avançadas
      </button>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave} loading={loading}>
          Salvar alterações
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
      footer={footer}
      className="max-w-[800px]"
    >
      {/* Custom Header */}
      <div className="-mt-6 -mx-6 px-6 py-5 border-b border-border-light dark:border-border-dark flex gap-4 items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary shrink-0">
          <span className="material-symbols-outlined text-3xl">{documentType}</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold leading-tight text-text-main dark:text-white">
            Compartilhar "{documentName}"
          </h1>
          <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">
            Gerencie quem tem acesso a este arquivo.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Add People Section */}
        <div
          className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-border-light dark:border-border-dark"
          data-testid="add-user-section"
        >
          <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
            Adicionar pessoas ou grupos
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Digite um nome, grupo ou email..."
                value={newUserEmail}
                onChange={setNewUserEmail}
                onKeyDown={handleKeyDown}
                icon={<span className="material-symbols-outlined text-[20px]">person_add</span>}
                iconPosition="left"
                data-testid="add-user-input"
              />
            </div>
            <div className="flex gap-2">
              <Dropdown
                options={permissionOptions}
                value={newUserPermission}
                onChange={(value) => setNewUserPermission(value as PermissionLevel)}
                aria-label="Selecionar nível de permissão"
                data-testid="add-user-permission-dropdown"
              />
              <Button
                variant="primary"
                onClick={handleAddUser}
                disabled={!newUserEmail.trim()}
                data-testid="add-user-button"
              >
                Convidar
              </Button>
            </div>
          </div>
        </div>

        {/* Link Sharing Section */}
        <div
          className="flex items-center justify-between gap-4 p-1"
          data-testid="public-link-section"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                publicLinkEnabled
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="material-symbols-outlined">
                {publicLinkEnabled ? 'public' : 'lock'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-main dark:text-white">
                {publicLinkEnabled ? 'Qualquer pessoa com o link' : 'Link privado'}
              </p>
              <p className="text-xs text-text-secondary dark:text-gray-400">
                {publicLinkEnabled
                  ? 'Pode visualizar o arquivo'
                  : 'Apenas pessoas adicionadas podem acessar'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePublicLink(!publicLinkEnabled)}
              data-testid="toggle-public-link-button"
            >
              {publicLinkEnabled ? 'Desativar' : 'Ativar link'}
            </Button>
            {publicLinkEnabled && publicLink && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onCopyLink}
                icon={<span className="material-symbols-outlined text-[18px]">link</span>}
                data-testid="copy-link-button"
              >
                Copiar Link
              </Button>
            )}
          </div>
        </div>

        {/* Access List */}
        <div data-testid="permissions-list">
          <h3 className="text-xs font-bold text-text-main dark:text-white mb-3 uppercase tracking-wider">
            Pessoas com acesso
          </h3>
          <div className="flex flex-col gap-1">
            {permissions.map(renderPermissionItem)}
            {permissions.length === 0 && (
              <p className="text-sm text-text-secondary dark:text-gray-400 py-4 text-center">
                Nenhuma pessoa tem acesso a este documento ainda.
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
