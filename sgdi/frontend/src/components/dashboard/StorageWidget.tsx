export interface StorageWidgetProps {
  usedGB: number;
  totalGB: number;
  onManageClick?: () => void;
}

export function StorageWidget({ usedGB, totalGB, onManageClick }: StorageWidgetProps) {
  const percentage = Math.min(Math.round((usedGB / totalGB) * 100), 100);

  // Determine color based on usage
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-primary';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-orange-500';
    return 'text-primary';
  };

  return (
    <div className="bg-white dark:bg-[#1a2233] border border-[#e5e7eb] dark:border-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex gap-6 justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#616f89] dark:text-gray-400">
              cloud
            </span>
            <p className="text-[#111318] dark:text-white text-base font-bold">Armazenamento</p>
          </div>
          <p className={`text-sm font-bold ${getTextColor()}`}>{percentage}%</p>
        </div>
        <div className="rounded-full bg-[#dbdfe6] dark:bg-gray-700 h-2 w-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-[#616f89] dark:text-gray-400 text-xs font-medium">
            {usedGB}GB Usado
          </p>
          <p className="text-[#616f89] dark:text-gray-400 text-xs font-medium">
            {totalGB}GB Total
          </p>
        </div>
        {onManageClick && (
          <button
            onClick={onManageClick}
            className="mt-2 w-full py-2 border border-[#e5e7eb] dark:border-gray-700 rounded-lg text-sm font-medium text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Gerenciar Espaço
          </button>
        )}
      </div>
    </div>
  );
}

export default StorageWidget;
