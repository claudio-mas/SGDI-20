export interface RecentDocument {
  id: string;
  name: string;
  type: string;
  folder: string;
  date: string;
  size: string;
}

export interface RecentDocumentsProps {
  documents: RecentDocument[];
  loading?: boolean;
  onViewAll?: () => void;
  onDocumentClick?: (doc: RecentDocument) => void;
  onDocumentAction?: (doc: RecentDocument) => void;
}

const fileTypeIcons: Record<string, { icon: string; color: string }> = {
  pdf: { icon: 'picture_as_pdf', color: 'text-red-500' },
  docx: { icon: 'article', color: 'text-blue-500' },
  doc: { icon: 'article', color: 'text-blue-500' },
  xlsx: { icon: 'table_view', color: 'text-green-500' },
  xls: { icon: 'table_view', color: 'text-green-500' },
  pptx: { icon: 'slideshow', color: 'text-orange-500' },
  ppt: { icon: 'slideshow', color: 'text-orange-500' },
  jpg: { icon: 'image', color: 'text-purple-500' },
  jpeg: { icon: 'image', color: 'text-purple-500' },
  png: { icon: 'image', color: 'text-purple-500' },
  zip: { icon: 'folder_zip', color: 'text-yellow-600' },
  default: { icon: 'description', color: 'text-gray-500' },
};

function getFileIcon(type: string): { icon: string; color: string } {
  const normalizedType = type.toLowerCase().replace('.', '');
  return fileTypeIcons[normalizedType] || fileTypeIcons.default;
}

export function RecentDocuments({
  documents,
  loading = false,
  onViewAll,
  onDocumentClick,
  onDocumentAction,
}: RecentDocumentsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold dark:text-white">Documentos Recentes</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </button>
        )}
      </div>
      <div className="bg-white dark:bg-[#1a2233] border border-[#e5e7eb] dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] dark:bg-gray-800/50 border-b border-[#e5e7eb] dark:border-gray-800 text-xs uppercase text-[#616f89] dark:text-gray-400 font-semibold tracking-wider">
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Tamanho</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb] dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
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
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Nenhum documento encontrado
                  </td>
                </tr>
              ) : (
                documents.map((doc) => {
                  const fileIcon = getFileIcon(doc.type);
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => onDocumentClick?.(doc)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={fileIcon.color}>
                            <span className="material-symbols-outlined">{fileIcon.icon}</span>
                          </div>
                          <div>
                            <p className="font-medium text-[#111318] dark:text-white text-sm">
                              {doc.name}
                            </p>
                            <p className="text-xs text-[#616f89] dark:text-gray-500">
                              {doc.folder}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#616f89] dark:text-gray-400">
                        {doc.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#616f89] dark:text-gray-400">
                        {doc.size}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDocumentAction?.(doc);
                          }}
                          className="text-[#616f89] hover:text-[#111318] dark:hover:text-white p-1 rounded"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RecentDocuments;
