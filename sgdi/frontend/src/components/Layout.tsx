import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/documentos', icon: 'folder', label: 'Meus Arquivos' },
  { path: '/compartilhados', icon: 'group', label: 'Compartilhados' },
  { path: '/tarefas', icon: 'task', label: 'Minhas Tarefas' },
  { path: '/workflows', icon: 'account_tree', label: 'Workflows' },
  { path: '/lixeira', icon: 'delete', label: 'Lixeira' },
  { path: '/configuracoes', icon: 'settings', label: 'Configurações' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-500">SGDI</h1>
          <p className="text-xs text-gray-500">Gestão de Documentos</p>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Buscar documentos..."
              className="px-4 py-2 border rounded-lg w-80 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                {user?.nome?.charAt(0)}
              </div>
              <span className="text-sm font-medium dark:text-white">{user?.nome}</span>
              <button onClick={logout} className="text-gray-500 hover:text-gray-700">
                <span className="material-symbols-outlined text-sm">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
