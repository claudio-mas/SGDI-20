import { Link, useLocation } from 'react-router-dom';

export interface NavItem {
  icon: string;
  label: string;
  path: string;
  badge?: number;
  section?: string;
}

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onUploadClick?: () => void;
}

const navItems: NavItem[] = [
  // Principal
  { icon: 'dashboard', label: 'Dashboard', path: '/', section: 'Principal' },
  { icon: 'assignment', label: 'Minhas Tarefas', path: '/tarefas', section: 'Principal' },
  { icon: 'folder', label: 'Meus Arquivos', path: '/documentos', section: 'Principal' },
  // Colaboração
  { icon: 'share', label: 'Compartilhados', path: '/compartilhados', section: 'Colaboração' },
  { icon: 'account_tree', label: 'Workflows', path: '/workflows', section: 'Colaboração' },
  // Administração
  { icon: 'fact_check', label: 'Auditoria', path: '/auditoria', section: 'Administração' },
  { icon: 'delete', label: 'Lixeira', path: '/lixeira', section: 'Administração' },
  { icon: 'settings', label: 'Configurações', path: '/configuracoes', section: 'Administração' },
];

// Group items by section
const groupedItems = navItems.reduce((acc, item) => {
  const section = item.section || 'Outros';
  if (!acc[section]) acc[section] = [];
  acc[section].push(item);
  return acc;
}, {} as Record<string, NavItem[]>);

export default function Sidebar({ collapsed, onToggle, onUploadClick }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } h-full bg-white dark:bg-[#1a2233] flex flex-col border-r border-gray-200 dark:border-gray-800 flex-shrink-0 transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-[#1a2233] border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 z-20 transition-colors"
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        <span className="material-symbols-outlined text-[16px] text-gray-500">
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      {/* Logo */}
      <div className={`p-6 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="bg-primary/10 flex items-center justify-center rounded-lg w-10 h-10 text-primary flex-shrink-0">
          <span className="material-symbols-outlined">description</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight dark:text-white">SGDI</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Gestão de Documentos</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-4 flex flex-col gap-1 flex-1 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section}>
            {!collapsed && (
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2 mt-4 first:mt-0">
                {section}
              </p>
            )}
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <p className="text-sm font-medium flex-1">{item.label}</p>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {/* Upload Button */}
        <button
          onClick={onUploadClick}
          className={`w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors ${
            collapsed ? 'px-0' : ''
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
          {!collapsed && <span>Upload Arquivo</span>}
        </button>
      </div>
    </aside>
  );
}
