import { useState } from 'react';

interface NotificationPreferences {
  sharedDocuments: boolean;
  signedDocuments: boolean;
  securityAlerts: boolean;
  marketing: boolean;
  workflowTasks: boolean;
  comments: boolean;
}

interface NotificationSettingsProps {
  initialPreferences?: NotificationPreferences;
  onSave?: (preferences: NotificationPreferences) => void;
}

interface NotificationItem {
  key: keyof NotificationPreferences;
  title: string;
  description: string;
}

const notificationItems: NotificationItem[] = [
  {
    key: 'sharedDocuments',
    title: 'Documentos Compartilhados',
    description: 'Receba um alerta quando alguém compartilhar um arquivo com você.'
  },
  {
    key: 'signedDocuments',
    title: 'Documento Assinado',
    description: 'Notificação imediata quando todas as partes assinarem.'
  },
  {
    key: 'securityAlerts',
    title: 'Alertas de Segurança',
    description: 'Avisos sobre novos acessos ou alterações de senha.'
  },
  {
    key: 'workflowTasks',
    title: 'Tarefas de Workflow',
    description: 'Notificações sobre novas tarefas e prazos de aprovação.'
  },
  {
    key: 'comments',
    title: 'Comentários e Menções',
    description: 'Alertas quando alguém comentar ou mencionar você em um documento.'
  },
  {
    key: 'marketing',
    title: 'Marketing e Novidades',
    description: 'Novas funcionalidades e dicas de uso.'
  }
];

export default function NotificationSettings({ 
  initialPreferences = {
    sharedDocuments: true,
    signedDocuments: true,
    securityAlerts: true,
    marketing: false,
    workflowTasks: true,
    comments: true
  },
  onSave 
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences);

  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    onSave?.(newPreferences);
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preferências de Notificação</h3>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {notificationItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={preferences[item.key]}
                  onChange={() => handleToggle(item.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
