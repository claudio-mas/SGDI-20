export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'upload' | 'share' | 'edit' | 'delete' | 'approve' | 'reject' | 'comment';
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
  onViewAll?: () => void;
}

const activityIcons: Record<ActivityItem['type'], { icon: string; color: string; bgColor: string }> = {
  upload: {
    icon: 'upload_file',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  share: {
    icon: 'share',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  edit: {
    icon: 'edit',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  delete: {
    icon: 'delete',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  approve: {
    icon: 'check_circle',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  reject: {
    icon: 'cancel',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  comment: {
    icon: 'comment',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
  },
};

export function ActivityFeed({ activities, loading = false, onViewAll }: ActivityFeedProps) {
  return (
    <div className="bg-white dark:bg-[#1a2233] border border-[#e5e7eb] dark:border-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Atividade Recente
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver tudo
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Carregando...</span>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhuma atividade recente
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-4">
            {activities.map((activity) => {
              const iconConfig = activityIcons[activity.type];
              return (
                <div key={activity.id} className="relative flex gap-4 pl-2">
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full ${iconConfig.bgColor} ${iconConfig.color} flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {iconConfig.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                    {activity.user && (
                      <div className="flex items-center gap-2 mt-2">
                        {activity.user.avatar ? (
                          <img
                            src={activity.user.avatar}
                            alt={activity.user.name}
                            className="w-5 h-5 rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                              {activity.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
