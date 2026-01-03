import { useState } from 'react';

interface SharingPoliciesData {
  linkExpiration: '7' | '30' | '90' | 'never';
  defaultPermission: 'view' | 'comment' | 'edit';
  restrictDownload: boolean;
  allowPublicLinks: boolean;
  sessionTimeout: boolean;
  detailedAuditLog: boolean;
}

interface SharingPoliciesProps {
  initialData?: SharingPoliciesData;
  onSave?: (data: SharingPoliciesData) => void;
  onCancel?: () => void;
}

export default function SharingPolicies({ 
  initialData = {
    linkExpiration: '30',
    defaultPermission: 'view',
    restrictDownload: false,
    allowPublicLinks: true,
    sessionTimeout: false,
    detailedAuditLog: true
  },
  onSave,
  onCancel 
}: SharingPoliciesProps) {
  const [formData, setFormData] = useState<SharingPoliciesData>(initialData);

  const handleChange = <K extends keyof SharingPoliciesData>(field: K, value: SharingPoliciesData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave?.(formData);
  };

  return (
    <div className="space-y-8">
      {/* Sharing Policies Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
              <span className="material-symbols-outlined">share</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Políticas de Compartilhamento e Acesso</h3>
          </div>
          
          <div className="space-y-6">
            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expiração Padrão de Links</label>
                <p className="text-xs text-gray-500 mb-2">Defina o tempo padrão para que links compartilhados expirem.</p>
                <select 
                  value={formData.linkExpiration}
                  onChange={(e) => handleChange('linkExpiration', e.target.value as SharingPoliciesData['linkExpiration'])}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm h-11"
                >
                  <option value="7">7 Dias</option>
                  <option value="30">30 Dias</option>
                  <option value="90">90 Dias</option>
                  <option value="never">Nunca expirar (Não recomendado)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Permissões Padrão</label>
                <p className="text-xs text-gray-500 mb-2">Nível de acesso inicial para novos membros convidados.</p>
                <select 
                  value={formData.defaultPermission}
                  onChange={(e) => handleChange('defaultPermission', e.target.value as SharingPoliciesData['defaultPermission'])}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm h-11"
                >
                  <option value="view">Apenas Visualizar</option>
                  <option value="comment">Comentar</option>
                  <option value="edit">Editar</option>
                </select>
              </div>
            </div>
            
            {/* Toggle Options */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-lg">file_download_off</span>
                  Restrição de Download
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                  Impedir que visualizadores baixem os arquivos originais. Apenas pré-visualização no navegador será permitida.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.restrictDownload}
                  onChange={(e) => handleChange('restrictDownload', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-lg">public_off</span>
                  Links Públicos
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Permitir a criação de links acessíveis por qualquer pessoa sem login.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.allowPublicLinks}
                  onChange={(e) => handleChange('allowPublicLinks', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Security Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
            <span className="material-symbols-outlined">security</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Segurança Adicional</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <p className="font-medium text-sm text-gray-900 dark:text-white">Timeout de Sessão</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Desconectar usuários automaticamente após 30 minutos de inatividade.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox"
                checked={formData.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
            </label>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <p className="font-medium text-sm text-gray-900 dark:text-white">Log de Auditoria Detalhado</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Registrar endereços IP e user-agent de todos os acessos.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox"
                checked={formData.detailedAuditLog}
                onChange={(e) => handleChange('detailedAuditLog', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
            </label>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Ver Logs de Acesso
            </button>
          </div>
        </div>
      </section>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button 
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
