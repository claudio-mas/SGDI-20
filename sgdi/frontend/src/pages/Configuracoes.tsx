import { useState } from 'react';
import {
  ProfileSettings,
  SecuritySettings,
  NotificationSettings,
  SharingPolicies,
  WatermarkSettings
} from '../components/settings';

type TabId = 'profile' | 'security' | 'notifications' | 'advanced';

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  { id: 'profile', label: 'Perfil' },
  { id: 'security', label: 'Segurança' },
  { id: 'notifications', label: 'Notificações' },
  { id: 'advanced', label: 'Avançado' }
];

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const handleProfileSave = (data: unknown) => {
    console.log('Profile saved:', data);
    // TODO: Integrate with API
  };

  const handlePasswordChange = async (data: unknown) => {
    console.log('Password change:', data);
    // TODO: Integrate with API
    return true;
  };

  const handleNotificationsSave = (preferences: unknown) => {
    console.log('Notifications saved:', preferences);
    // TODO: Integrate with API
  };

  const handleSharingPoliciesSave = (data: unknown) => {
    console.log('Sharing policies saved:', data);
    // TODO: Integrate with API
  };

  const handleWatermarkSave = (config: unknown) => {
    console.log('Watermark saved:', config);
    // TODO: Integrate with API
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            <ProfileSettings onSave={handleProfileSave} />
            <SecuritySettings onPasswordChange={handlePasswordChange} />
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8">
            <SecuritySettings onPasswordChange={handlePasswordChange} />
            {/* Danger Zone */}
            <section className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-red-700 dark:text-red-400 text-lg">Zona de Perigo</h4>
                <p className="text-red-600/70 dark:text-red-300/60 text-sm">
                  Excluir sua conta é uma ação irreversível. Todos os seus dados serão perdidos.
                </p>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Excluir Conta
              </button>
            </section>
          </div>
        );
      case 'notifications':
        return <NotificationSettings onSave={handleNotificationsSave} />;
      case 'advanced':
        return (
          <div className="space-y-8">
            <SharingPolicies onSave={handleSharingPoliciesSave} />
            <WatermarkSettings onSave={handleWatermarkSave} />
            {/* Reset Section */}
            <section className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-red-700 dark:text-red-400 text-lg">Resetar Configurações</h4>
                <p className="text-red-600/70 dark:text-red-300/60 text-sm">
                  Voltar todas as configurações avançadas para os padrões originais do sistema.
                </p>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Restaurar Padrões
              </button>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
          Configurações da Conta
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base">
          Gerencie suas informações pessoais, preferências de segurança e plano de assinatura.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-[3px] border-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-[3px] border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {renderTabContent()}
      </div>
    </div>
  );
}
