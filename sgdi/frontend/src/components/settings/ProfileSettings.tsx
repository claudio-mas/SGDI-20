import { useState, useRef } from 'react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  position: string;
  avatar?: string;
}

interface ProfileSettingsProps {
  initialData?: ProfileData;
  onSave?: (data: ProfileData) => void;
  onCancel?: () => void;
}

export default function ProfileSettings({ 
  initialData = {
    name: 'Carlos Mendes',
    email: 'carlos.mendes@empresa.com',
    phone: '+55 11 99999-8888',
    position: 'Gerente de Projetos',
    avatar: ''
  },
  onSave,
  onCancel 
}: ProfileSettingsProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('O arquivo deve ter no máximo 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setFormData(prev => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    onSave?.(formData);
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Informações Pessoais</h3>
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
          <div className="relative group">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full h-24 w-24 border-4 border-gray-100 dark:border-gray-800 shadow-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              style={avatarPreview ? { backgroundImage: `url("${avatarPreview}")` } : {}}
            >
              {!avatarPreview && (
                <span className="material-symbols-outlined text-4xl text-gray-400">person</span>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition-colors"
              title="Alterar foto"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">{formData.name || 'Seu Nome'}</h4>
            <p className="text-gray-500 dark:text-gray-400 mb-2">{formData.position || 'Cargo'}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">JPG, GIF ou PNG. Max 1MB.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleRemoveAvatar}
              className="flex-1 md:flex-none px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg font-medium text-sm transition-colors"
            >
              Remover
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 md:flex-none px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg font-medium text-sm transition-colors"
            >
              Alterar Foto
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nome Completo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </span>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm h-11"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Endereço de E-mail</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </span>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm h-11"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Telefone</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </span>
              <input 
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm h-11"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cargo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span className="material-symbols-outlined text-[20px]">work</span>
              </span>
              <input 
                type="text"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm h-11"
              />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-500/30 transition-all"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </section>
  );
}
