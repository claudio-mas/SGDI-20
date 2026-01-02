import { useState } from 'react';

export interface HeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({ title, onSearch, showSearch = true }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications] = useState(true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="flex-none h-16 bg-white dark:bg-[#1a2233] border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between z-10">
      {/* Left section - Title */}
      <div className="flex items-center gap-4 w-1/3">
        {title && (
          <h2 className="text-lg font-bold hidden md:block dark:text-white">{title}</h2>
        )}
      </div>

      {/* Center section - Search */}
      {showSearch && (
        <div className="flex-1 max-w-lg px-4">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px]">
                search
              </span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full rounded-lg border-0 bg-gray-100 dark:bg-gray-800 dark:text-white py-2 pl-10 pr-4 text-sm ring-0 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-900 transition-all placeholder-gray-500"
              placeholder="Pesquisar documentos, processos..."
            />
          </form>
        </div>
      )}

      {/* Right section - Actions */}
      <div className="flex items-center gap-3 w-1/3 justify-end">
        {/* Help button */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          title="Ajuda"
        >
          <span className="material-symbols-outlined text-[22px]">help</span>
        </button>

        {/* Notifications button */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors relative"
          title="Notificações"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {hasNotifications && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#1a2233]" />
          )}
        </button>
      </div>
    </header>
  );
}
