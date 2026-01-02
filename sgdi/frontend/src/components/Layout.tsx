import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import UserMenu from './layout/UserMenu';

// Map routes to page titles
const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/documentos': 'Meus Arquivos',
  '/compartilhados': 'Compartilhados',
  '/tarefas': 'Minhas Tarefas',
  '/workflows': 'Workflows',
  '/lixeira': 'Lixeira',
  '/configuracoes': 'Configurações',
  '/auditoria': 'Auditoria',
};

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme
  const handleThemeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Get current page title
  const getPageTitle = () => {
    const exactMatch = pageTitles[location.pathname];
    if (exactMatch) return exactMatch;
    
    // Check for partial matches (e.g., /documentos/123)
    for (const [path, title] of Object.entries(pageTitles)) {
      if (path !== '/' && location.pathname.startsWith(path)) {
        return title;
      }
    }
    return '';
  };

  const handleUploadClick = () => {
    // TODO: Open upload modal
    console.log('Upload clicked');
  };

  const handleSearch = (query: string) => {
    // TODO: Implement global search
    console.log('Search:', query);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#101622] overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col h-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onUploadClick={handleUploadClick}
        />
        
        {/* User Menu at bottom of sidebar */}
        <div
          className={`${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } bg-white dark:bg-[#1a2233] border-r border-gray-200 dark:border-gray-800 p-4 transition-all duration-300`}
        >
          <UserMenu
            userName={user?.nome || 'Usuário'}
            userEmail={user?.email || ''}
            collapsed={sidebarCollapsed}
            onLogout={logout}
            onThemeToggle={handleThemeToggle}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <Header
          title={getPageTitle()}
          onSearch={handleSearch}
          showSearch={true}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
