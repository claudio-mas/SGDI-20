export interface QuickAction {
  icon: string;
  label: string;
  onClick: () => void;
}

export interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#1a2233] rounded-xl border border-[#e5e7eb] dark:border-gray-800 hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">{action.icon}</span>
          </div>
          <span className="text-sm font-medium dark:text-gray-200">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

export default QuickActions;
