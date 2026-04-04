import React from 'react';
import { useAppStore } from '../../../appStore';

export const ConfigSectionVisual = () => {
  const { simpleMode, setSimpleMode } = useAppStore();

  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1.5 h-8 bg-qart-accent" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-qart-primary">
            Preferencias de Interfaz
          </h2>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-qart-text-muted max-w-xl">
          Personaliza la densidad de información y el comportamiento visual de la aplicación.
        </p>
      </header>

      <div className="p-8 md:p-10 border-[3px] border-qart-border bg-qart-surface-sunken flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-sharp relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-qart-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1">
          <h3 className="text-xl font-black uppercase tracking-tighter text-qart-primary mb-3">
            Activar Modo Simple
          </h3>
          <p className="text-qart-text-muted font-bold text-sm leading-relaxed max-w-sm">
            Oculta métricas avanzadas y simplifica la vista de platos para enfocarse en lo esencial.
            <span className="block mt-2 text-qart-accent text-xs font-black uppercase italic">
              Recomendado para entornos de alta velocidad.
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setSimpleMode(!simpleMode)}
            className={`w-24 h-11 border-[3px] border-qart-primary relative flex items-center transition-all cursor-pointer shadow-sharp active:translate-x-1 active:translate-y-1 active:shadow-none ${
              simpleMode ? 'bg-qart-success' : 'bg-qart-surface'
            }`}
          >
            <div
              className={`w-7 h-7 border-[3px] border-qart-primary bg-white absolute transition-all flex items-center justify-center ${
                simpleMode
                  ? 'translate-x-14 shadow-[-4px_0px_0px_var(--qart-primary)]'
                  : 'translate-x-1 shadow-[4px_0px_0px_var(--qart-primary)]'
              }`}
            >
              {simpleMode ? (
                <div className="w-2 h-2 bg-qart-success rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-qart-border rounded-full" />
              )}
            </div>
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-qart-text-muted">
            {simpleMode ? 'Activado' : 'Desactivado'}
          </span>
        </div>
      </div>

      <div className="bg-qart-bg-warm p-8 border-2 border-qart-border-subtle flex items-start gap-4">
        <div className="text-qart-accent">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold text-qart-text-muted leading-relaxed uppercase tracking-wide">
            Nota: Algunos cambios pueden requerir la recarga de módulos específicos para aplicar el
            nuevo lenguaje visual en tiempo real.
          </p>
        </div>
      </div>
    </div>
  );
};
