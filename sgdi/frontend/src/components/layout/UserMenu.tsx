import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface UserMenuProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  collapsed?: boolean;
  onLogout: () => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

export default function UserMenu({
  userName,
  userEmail,
  userAvatar,
  collapsed = false,
  onLogout,
  onThemeToggle,
  isDarkMode = false,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Theme Toggle */}
      {onThemeToggle && !collapsed && (
        <div className="px-2 py-2 flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">Tema escuro</span>
          <button
            onClick={onThemeToggle}
            className={`w-10 h-5 ${
              isDarkMode ? 'bg-primary' : 'bg-gray-200'
            } rounded-full relative transition-colors flex-shrink-0`}
            aria-label="Alternar tema"
          >
            <span
              className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isDarkMode ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      )}

      {/* User Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors group ${
          collapsed ? 'justify-center' : 'px-1 -mx-1'
        }`}
      >
        {/* Avatar */}
        {userAvatar ? (
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-9 w-9 border border-gray-200 dark:border-gray-700 flex-shrink-0"
            style={{ backgroundImage: `url("${userAvatar}")` }}
            aria-label={`Foto de perfil de ${userName}`}
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {getInitials(userName)}
          </div>
        )}

        {/* User Info */}
        {!collapsed && (
          <>
            <div className="flex flex-col overflow-hidden flex-1">
              <p className="text-sm font-medium truncate dark:text-white">{userName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
            </div>
            <span className="material-symbols-outlined text-gray-500 text-[18px]">
              {isOpen ? 'expand_less' : 'expand_more'}
            </span>
          </>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#1a2233] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-1 z-50">
          <Link
            to="/configuracoes"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Meu Perfil
          </Link>
          <Link
            to="/configuracoes"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            Configurações da Conta
          </Link>
          <div className="my-1 border-t border-gray-200 dark:border-gray-800" />
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
