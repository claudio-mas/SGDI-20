import React, { useState, useEffect } from 'react';
import { Tag } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export interface TagFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tag: Omit<Tag, 'id' | 'usageCount'>) => void;
  initialData?: Tag;
  title: string;
}

const AVAILABLE_COLORS = [
  { name: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { name: 'red', label: 'Vermelho', class: 'bg-red-500' },
  { name: 'green', label: 'Verde', class: 'bg-green-500' },
  { name: 'purple', label: 'Roxo', class: 'bg-purple-500' },
  { name: 'amber', label: 'Âmbar', class: 'bg-amber-500' },
  { name: 'slate', label: 'Cinza', class: 'bg-slate-500' },
];

export const TagForm: React.FC<TagFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setColor(initialData.color);
    } else {
      setName('');
      setDescription('');
      setColor('blue');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'O nome da tag é obrigatório';
    } else if (name.trim().length < 2) {
      newErrors.name = 'O nome deve ter pelo menos 2 caracteres';
    } else if (name.trim().length > 50) {
      newErrors.name = 'O nome deve ter no máximo 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} data-testid="submit-tag-button">
            {initialData ? 'Salvar Alterações' : 'Criar Tag'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6" data-testid="tag-form">
        {/* Name Input */}
        <Input
          label="Nome da Tag"
          placeholder="Ex: Financeiro, Jurídico, RH..."
          value={name}
          onChange={setName}
          error={errors.name}
          data-testid="tag-name-input"
        />

        {/* Description Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold">
            Descrição (opcional)
          </label>
          <textarea
            className="form-textarea w-full rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-900 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            placeholder="Descreva o propósito desta tag..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-testid="tag-description-input"
          />
        </div>

        {/* Color Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold">
            Cor da Tag
          </label>
          <div className="flex flex-wrap gap-3" data-testid="color-selector">
            {AVAILABLE_COLORS.map((colorOption) => (
              <button
                key={colorOption.name}
                type="button"
                className={`
                  w-10 h-10 rounded-full ${colorOption.class} transition-all
                  ${color === colorOption.name
                    ? 'ring-2 ring-offset-2 ring-primary scale-110'
                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }
                `}
                onClick={() => setColor(colorOption.name)}
                title={colorOption.label}
                data-testid={`color-option-${colorOption.name}`}
                aria-label={`Selecionar cor ${colorOption.label}`}
                aria-pressed={color === colorOption.name}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2">
          <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold">
            Pré-visualização
          </label>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`size-3 rounded-full ${AVAILABLE_COLORS.find(c => c.name === color)?.class}`}></div>
              <span
                className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                  ${color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}
                  ${color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                  ${color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                  ${color === 'amber' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : ''}
                  ${color === 'slate' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300' : ''}
                `}
                data-testid="tag-preview"
              >
                {name || 'Nome da Tag'}
              </span>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TagForm;
