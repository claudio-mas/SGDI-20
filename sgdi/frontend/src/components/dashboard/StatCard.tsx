export interface StatCardTrend {
  value: number;
  direction: 'up' | 'down';
  label: string;
}

export interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: StatCardTrend;
  color: 'blue' | 'purple' | 'orange' | 'green';
}

const colorStyles: Record<StatCardProps['color'], { bg: string; text: string; darkBg: string }> = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-primary',
    darkBg: 'dark:bg-blue-900/20',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    darkBg: 'dark:bg-purple-900/20',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    darkBg: 'dark:bg-orange-900/20',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    darkBg: 'dark:bg-green-900/20',
  },
};

export function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className="p-5 bg-white dark:bg-[#1a2233] rounded-xl border border-[#e5e7eb] dark:border-gray-800 shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1 dark:text-white">{value}</p>
        </div>
        <div className={`p-2 ${styles.bg} ${styles.darkBg} rounded-lg ${styles.text}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <span
            className={`font-medium flex items-center ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {trend.value}%
          </span>
          <span className="text-[#616f89] dark:text-gray-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
