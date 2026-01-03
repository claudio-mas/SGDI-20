import React, { useState } from 'react';
import { DocumentVersion, Document } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export interface VersionHistoryProps {
  document: Document;
  versions: DocumentVersion[];
  onRestore?: (version: DocumentVersion) => void;
  onDownload?: (version: DocumentVersion) => void;
  onView?: (version: DocumentVersion) => void;
  onCompare?: (version1: DocumentVersion, version2: DocumentVersion) => void;
  onUploadNewVersion?: () => void;
  loading?: boolean;
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  document,
  versions,
  onRestore,
  onDownload,
  onView,
  onCompare,
  onUploadNewVersion,
  loading = false,
}) => {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<DocumentVersion[]>([]);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<DocumentVersion | null>(null);

  // Sort versions by date (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
  );

  const handleVersionSelect = (version: DocumentVersion) => {
    if (!compareMode) return;

    setSelectedVersions((prev) => {
      const isSelected = prev.some((v) => v.id === version.id);
      if (isSelected) {
        return prev.filter((v) => v.id !== version.id);
      }
      if (prev.length >= 2) {
        return [prev[1], version];
      }
      return [...prev, version];
    });
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2 && onCompare) {
      onCompare(selectedVersions[0], selectedVersions[1]);
    }
  };

  const handleRestoreClick = (version: DocumentVersion) => {
    setVersionToRestore(version);
    setRestoreModalOpen(true);
  };

  const handleRestoreConfirm = () => {
    if (versionToRestore && onRestore) {
      onRestore(versionToRestore);
    }
    setRestoreModalOpen(false);
    setVersionToRestore(null);
  };

  const isVersionSelected = (version: DocumentVersion) =>
    selectedVersions.some((v) => v.id === version.id);

  return (
    <div className="flex flex-col gap-6" data-testid="version-history">
      {/* Header */}
      <div>
        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
          Histórico de Versões
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
          Gerencie, compare e restaure iterações anteriores do seu documento.
        </p>
      </div>

      {/* Document Info Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative group shrink-0">
            <div
              className="bg-slate-100 dark:bg-slate-800 rounded-lg h-32 w-24 sm:h-40 sm:w-32 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center"
              data-testid="document-thumbnail"
            >
              <span className="material-symbols-outlined text-4xl text-slate-400">
                description
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="error" size="sm">
                  {document.type.toUpperCase()}
                </Badge>
                <Badge
                  variant={document.status === 'approved' ? 'success' : 'warning'}
                  size="sm"
                >
                  {document.status === 'approved' ? 'Aprovado' : document.status}
                </Badge>
              </div>
              <h3 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-bold leading-tight">
                {document.name}
              </h3>
            </div>
            <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">hard_drive</span>
                {formatFileSize(document.size)}
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Criado em {formatDate(document.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Compare Mode Toggle */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">difference</span>
                Modo Comparação
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                Selecione duas versões para comparar diferenças.
              </p>
            </div>
            <label className="relative flex h-7 w-12 cursor-pointer items-center rounded-full bg-slate-200 dark:bg-slate-700 p-1 transition-colors has-[:checked]:bg-primary">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={compareMode}
                onChange={(e) => {
                  setCompareMode(e.target.checked);
                  if (!e.target.checked) {
                    setSelectedVersions([]);
                  }
                }}
                data-testid="compare-mode-toggle"
              />
              <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>
          {compareMode && selectedVersions.length === 2 && (
            <div className="mt-4">
              <Button variant="primary" size="sm" onClick={handleCompare}>
                <span className="material-symbols-outlined text-[18px]">compare</span>
                Comparar Versões
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 p-5 shadow-sm flex flex-col justify-center gap-3">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Ações Rápidas
          </h4>
          <Button
            variant="primary"
            onClick={onUploadNewVersion}
            className="w-full"
            data-testid="upload-new-version-btn"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Carregar Nova Versão
          </Button>
        </div>
      </div>

      {/* Version List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Lista de Versões
          </h3>
          {compareMode && (
            <span className="text-sm text-slate-500">
              {selectedVersions.length}/2 selecionadas
            </span>
          )}
        </div>

        <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-zinc-800/50 text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  {compareMode && (
                    <th className="px-4 py-4 font-semibold tracking-wider" scope="col">
                      Selecionar
                    </th>
                  )}
                  <th className="px-6 py-4 font-semibold tracking-wider" scope="col">
                    Versão
                  </th>
                  <th className="px-6 py-4 font-semibold tracking-wider" scope="col">
                    Data de Modificação
                  </th>
                  <th className="px-6 py-4 font-semibold tracking-wider" scope="col">
                    Modificado Por
                  </th>
                  <th className="px-6 py-4 font-semibold tracking-wider" scope="col">
                    Comentários
                  </th>
                  <th className="px-6 py-4 text-right font-semibold tracking-wider" scope="col">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800" data-testid="version-list">
                {loading ? (
                  <tr>
                    <td colSpan={compareMode ? 6 : 5} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span>Carregando versões...</span>
                      </div>
                    </td>
                  </tr>
                ) : sortedVersions.length === 0 ? (
                  <tr>
                    <td colSpan={compareMode ? 6 : 5} className="px-6 py-8 text-center">
                      <span className="text-slate-400">Nenhuma versão encontrada</span>
                    </td>
                  </tr>
                ) : (
                  sortedVersions.map((version) => (
                    <tr
                      key={version.id}
                      className={`
                        ${version.isCurrent
                          ? 'bg-primary/5 dark:bg-primary/5 hover:bg-primary/10'
                          : 'bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }
                        ${compareMode && isVersionSelected(version) ? 'ring-2 ring-primary ring-inset' : ''}
                        transition-colors cursor-pointer
                      `}
                      onClick={() => handleVersionSelect(version)}
                      data-testid={`version-row-${version.id}`}
                    >
                      {compareMode && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isVersionSelected(version)}
                            onChange={() => handleVersionSelect(version)}
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                            data-testid={`version-checkbox-${version.id}`}
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              version.isCurrent
                                ? 'bg-primary/10 text-primary'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                            }`}
                          >
                            <span className="material-symbols-outlined">
                              {version.isCurrent ? 'verified' : 'history'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={`font-bold ${
                                version.isCurrent
                                  ? 'text-slate-900 dark:text-white text-base'
                                  : 'text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              {version.version}
                            </span>
                            {version.isCurrent && (
                              <Badge variant="info" size="sm">
                                Atual
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span
                            className={`font-medium ${
                              version.isCurrent
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {formatDate(version.modifiedAt)}
                          </span>
                          <span className="text-xs">{formatTime(version.modifiedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center"
                            style={
                              version.modifiedBy.avatar
                                ? { backgroundImage: `url(${version.modifiedBy.avatar})`, backgroundSize: 'cover' }
                                : {}
                            }
                          >
                            {!version.modifiedBy.avatar && (
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                {version.modifiedBy.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span
                            className={`font-medium ${
                              version.isCurrent
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {version.modifiedBy.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="truncate max-w-[200px] text-slate-600 dark:text-slate-300">
                          {version.comment || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                            title="Visualizar"
                            onClick={() => onView?.(version)}
                            data-testid={`view-version-${version.id}`}
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          {!version.isCurrent && (
                            <button
                              className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full transition-colors"
                              title="Restaurar esta versão"
                              onClick={() => handleRestoreClick(version)}
                              data-testid={`restore-version-${version.id}`}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                settings_backup_restore
                              </span>
                            </button>
                          )}
                          <button
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                            title="Baixar"
                            onClick={() => onDownload?.(version)}
                            data-testid={`download-version-${version.id}`}
                          >
                            <span className="material-symbols-outlined text-[20px]">download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 px-6 py-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Mostrando <span className="font-medium">{sortedVersions.length}</span> de{' '}
              <span className="font-medium">{versions.length}</span> versões
            </div>
          </div>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        title="Restaurar Versão"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRestoreModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleRestoreConfirm}>
              Restaurar
            </Button>
          </div>
        }
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
            <span className="material-symbols-outlined text-orange-600">settings_backup_restore</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Tem certeza que deseja restaurar a versão{' '}
            <strong>{versionToRestore?.version}</strong>?
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Esta ação criará uma nova versão baseada na versão selecionada.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default VersionHistory;
