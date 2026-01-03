import { useState, useMemo } from 'react';

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  position: 'center-diagonal' | 'center-horizontal' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tiled';
  color: string;
  size: number;
  opacity: number;
}

interface WatermarkSettingsProps {
  initialConfig?: WatermarkConfig;
  onSave?: (config: WatermarkConfig) => void;
  userEmail?: string;
}

const positionOptions = [
  { value: 'center-diagonal', label: 'Centro (Diagonal)' },
  { value: 'center-horizontal', label: 'Centro (Horizontal)' },
  { value: 'top-left', label: 'Topo Esquerdo' },
  { value: 'top-right', label: 'Topo Direito' },
  { value: 'bottom-left', label: 'Rodapé Esquerdo' },
  { value: 'bottom-right', label: 'Rodapé Direito' },
  { value: 'tiled', label: 'Mosaico Repetido' }
];

export default function WatermarkSettings({ 
  initialConfig = {
    enabled: true,
    text: 'CONFIDENCIAL - {EMAIL}',
    position: 'center-diagonal',
    color: '#dc2626',
    size: 24,
    opacity: 30
  },
  onSave,
  userEmail = 'usuario@empresa.com'
}: WatermarkSettingsProps) {
  const [config, setConfig] = useState<WatermarkConfig>(initialConfig);

  const handleChange = <K extends keyof WatermarkConfig>(field: K, value: WatermarkConfig[K]) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onSave?.(newConfig);
  };

  const insertVariable = (variable: string) => {
    handleChange('text', config.text + variable);
  };

  // Process text with variables for preview
  const processedText = useMemo(() => {
    return config.text
      .replace('{EMAIL}', userEmail)
      .replace('{DATA}', new Date().toLocaleDateString('pt-BR'))
      .replace('{IP}', '192.168.1.1');
  }, [config.text, userEmail]);

  // Get position styles for preview
  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      fontSize: `${config.size}px`,
      fontWeight: 900,
      color: config.color,
      opacity: config.opacity / 100,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      userSelect: 'none'
    };

    switch (config.position) {
      case 'center-diagonal':
        return { ...baseStyles, top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)' };
      case 'center-horizontal':
        return { ...baseStyles, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'top-left':
        return { ...baseStyles, top: '10px', left: '10px' };
      case 'top-right':
        return { ...baseStyles, top: '10px', right: '10px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '30px', left: '10px' };
      case 'bottom-right':
        return { ...baseStyles, bottom: '30px', right: '10px' };
      case 'tiled':
        return { ...baseStyles, top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)' };
      default:
        return baseStyles;
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
            <span className="material-symbols-outlined">water_drop</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Marca d'água</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Personalize a marca d'água que aparecerá em documentos visualizados.
      </p>
      
      <div className="space-y-5">
        {/* Preview */}
        <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          {/* Document simulation */}
          <div className="absolute inset-0 p-5 space-y-3 opacity-20 pointer-events-none select-none">
            <div className="h-2 bg-gray-400 dark:bg-gray-500 rounded w-3/4"></div>
            <div className="h-2 bg-gray-400 dark:bg-gray-500 rounded w-full"></div>
            <div className="h-2 bg-gray-400 dark:bg-gray-500 rounded w-5/6"></div>
            <div className="h-2 bg-gray-400 dark:bg-gray-500 rounded w-full"></div>
            <div className="h-2 bg-gray-400 dark:bg-gray-500 rounded w-2/3"></div>
            <div className="h-2 bg-gray-400 dark:bg-gray-500 rounded w-full"></div>
          </div>
          
          {/* Watermark preview */}
          {config.enabled && (
            <span style={getPositionStyles()}>
              {processedText}
            </span>
          )}
          
          <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded text-[10px] font-medium text-gray-500 border border-gray-100 dark:border-gray-700 shadow-sm">
            Pré-visualização
          </div>
        </div>

        {/* Configuration Fields */}
        <div className="space-y-4">
          {/* Text Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Conteúdo</label>
            <input 
              type="text"
              value={config.text}
              onChange={(e) => handleChange('text', e.target.value)}
              disabled={!config.enabled}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 text-sm disabled:opacity-50"
            />
            <div className="flex gap-2 text-[10px] text-gray-400">
              <button 
                onClick={() => insertVariable('{EMAIL}')}
                disabled={!config.enabled}
                className="cursor-pointer hover:text-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + {'{EMAIL}'}
              </button>
              <button 
                onClick={() => insertVariable('{DATA}')}
                disabled={!config.enabled}
                className="cursor-pointer hover:text-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + {'{DATA}'}
              </button>
              <button 
                onClick={() => insertVariable('{IP}')}
                disabled={!config.enabled}
                className="cursor-pointer hover:text-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + {'{IP}'}
              </button>
            </div>
          </div>
          
          {/* Position and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Posição</label>
              <select 
                value={config.position}
                onChange={(e) => handleChange('position', e.target.value as WatermarkConfig['position'])}
                disabled={!config.enabled}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 text-sm py-2 disabled:opacity-50"
              >
                {positionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Cor</label>
              <div className="flex items-center gap-2 h-[38px]">
                <input 
                  type="color"
                  value={config.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  disabled={!config.enabled}
                  className="h-full w-12 p-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white cursor-pointer disabled:opacity-50"
                />
                <input 
                  type="text"
                  value={config.color.toUpperCase()}
                  onChange={(e) => handleChange('color', e.target.value)}
                  disabled={!config.enabled}
                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:border-purple-500 focus:ring-purple-500 h-full disabled:opacity-50"
                />
              </div>
            </div>
          </div>
          
          {/* Size and Opacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tamanho</label>
                <span className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{config.size}px</span>
              </div>
              <input 
                type="range"
                min="10"
                max="100"
                value={config.size}
                onChange={(e) => handleChange('size', parseInt(e.target.value))}
                disabled={!config.enabled}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600 disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Opacidade</label>
                <span className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{config.opacity}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={config.opacity}
                onChange={(e) => handleChange('opacity', parseInt(e.target.value))}
                disabled={!config.enabled}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
