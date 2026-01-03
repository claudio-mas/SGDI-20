import React, { useState, useMemo } from 'react';
import { Tag } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { TagForm } from './TagForm';
import { Modal } from '../common/Modal';

export interface TagManagerProps {
  tags: Tag[];
  onCreateTag: (tag: Omit<Tag, 'id' | 'usageCount'>) => void;
  onUpdateTag: (id: string, tag: Partial<Tag>) => void;
  onDeleteTag: (id: string) => void;
  loading?: boolean;
}

type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'usage';

const TAG_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-300',
    dot: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-800 dark:text-purple-300',
    dot: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-300',
    dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  },
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-700/50',
    text: 'text-slate-800 dark:text-slate-300',
    dot: 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.5)]',
  },
};

export const getTagColorStyles = (color: string) => {
  return TAG_COLORS[color] || TAG_COLORS.slate;
};

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteConfirmTag, setDeleteConfirmTag] = useState<Tag | null>(null);

  // Filter and sort tags
  const filteredTags = useMemo(() => {
    let result = [...tags];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tag) =>
          tag.name.toLowerCase().includes(query) ||
          tag.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'usage':
        result.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'recent':
        // Assuming tags have an implicit order by creation
        result.reverse();
        break;
    }

    return result;
  }, [tags, searchQuery, sortOption]);

  const handleCreateTag = (tagData: Omit<Tag, 'id' | 'usageCount'>) => {
    onCreateTag(tagData);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTag = (tagData: Omit<Tag, 'id' | 'usageCount'>) => {
    if (editingTag) {
      onUpdateTag(editingTag.id, tagData);
      setEditingTag(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmTag) {
      onDeleteTag(deleteConfirmTag.id);
      setDeleteConfirmTag(null);
    }
  };

  return (
    <div className="w-full" data-testid="tag-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Gerenciamento de Tags
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
            Crie, edite e organize as etiquetas usadas para classificar e encontrar documentos no sistema.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          icon={<span className="material-symbols-outlined">add</span>}
          className="shadow-lg shadow-primary/30 min-w-max"
          data-testid="create-tag-button"
        >
          Criar Nova Tag
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#1a2234] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar tags por nome..."
            value={searchQuery}
            onChange={setSearchQuery}
            icon={<span className="material-symbols-outlined">search</span>}
            data-testid="tag-search-input"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative min-w-[160px]">
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-base border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer appearance-none"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              data-testid="tag-sort-select"
            >
              <option value="name-asc">Ordenar por: Nome (A-Z)</option>
              <option value="name-desc">Ordenar por: Nome (Z-A)</option>
              <option value="recent">Mais recentes</option>
              <option value="usage">Mais usadas</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center w-full" data-testid="empty-state">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
            <span className="material-symbols-outlined text-4xl text-slate-400">local_offer</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {searchQuery ? 'Nenhuma tag encontrada' : 'Nenhuma tag criada'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            {searchQuery
              ? 'Tente buscar por outro termo.'
              : 'Você ainda não criou nenhuma tag. Comece criando uma para organizar seus documentos.'}
          </p>
          {!searchQuery && (
            <button
              className="text-primary font-medium hover:underline"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Criar minha primeira tag
            </button>
          )}
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-[#1a2234]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" data-testid="tags-table">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">
                    Nome da Tag
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTags.map((tag) => {
                  const colorStyles = getTagColorStyles(tag.color);
                  return (
                    <tr
                      key={tag.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                      data-testid={`tag-row-${tag.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`size-3 rounded-full ${colorStyles.dot}`}></div>
                          <span className={`${colorStyles.bg} ${colorStyles.text} px-3 py-1 rounded-full text-sm font-medium`}>
                            {tag.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-xs">
                          {tag.description || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="material-symbols-outlined text-[18px] text-slate-400">description</span>
                          <span className="font-medium text-slate-900 dark:text-white">{tag.usageCount}</span> docs
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Editar"
                            onClick={() => setEditingTag(tag)}
                            data-testid={`edit-tag-${tag.id}`}
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Excluir"
                            onClick={() => setDeleteConfirmTag(tag)}
                            data-testid={`delete-tag-${tag.id}`}
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Tag Modal */}
      {isCreateModalOpen && (
        <TagForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTag}
          title="Criar Nova Tag"
        />
      )}

      {/* Edit Tag Modal */}
      {editingTag && (
        <TagForm
          isOpen={!!editingTag}
          onClose={() => setEditingTag(null)}
          onSubmit={handleUpdateTag}
          initialData={editingTag}
          title="Editar Tag"
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmTag}
        onClose={() => setDeleteConfirmTag(null)}
        title="Confirmar Exclusão"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirmTag(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} data-testid="confirm-delete-button">
              Excluir
            </Button>
          </div>
        }
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Tem certeza que deseja excluir a tag{' '}
            <strong className="text-slate-900 dark:text-white">{deleteConfirmTag?.name}</strong>?
          </p>
          {deleteConfirmTag && deleteConfirmTag.usageCount > 0 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Esta tag está sendo usada em {deleteConfirmTag.usageCount} documento(s).
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TagManager;
