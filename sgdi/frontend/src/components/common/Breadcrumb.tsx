import React from 'react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const DefaultSeparator: React.FC = () => (
  <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
);

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  className = '',
}) => {
  if (items.length === 0) {
    return null;
  }

  const baseStyles = 'flex items-center text-sm text-[#616f89] dark:text-gray-400';

  const combinedClassName = [baseStyles, className].filter(Boolean).join(' ');

  const renderSeparator = () => {
    if (separator) {
      return separator;
    }
    return <DefaultSeparator />;
  };

  return (
    <nav className={combinedClassName} data-testid="breadcrumb" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.id} className="flex items-center">
              {isLast ? (
                <span
                  className="text-[#111318] dark:text-white font-medium"
                  data-testid="breadcrumb-current"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    data-testid={`breadcrumb-item-${item.id}`}
                  >
                    {item.label}
                  </button>
                  {renderSeparator()}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
