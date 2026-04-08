/**
 * @file ToastProvider.tsx
 * @module Frontend
 * @description Archivo ToastProvider alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: react, react-dom, framer-motion, toastStore
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore, type Toast, type ToastType } from '../../toastStore';

const TOAST_ICONS: Record<ToastType, ReactNode> = {
  success: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  error: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  warning: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
};

const TOAST_CLASSES: Record<ToastType, string> = {
  success:
    'bg-qart-success text-white border-qart-success p-4 flex gap-4 border-[3px] shadow-[6px_6px_0_var(--qart-success)] z-50',
  error:
    'bg-qart-error text-white border-qart-error p-4 flex gap-4 border-[3px] shadow-[6px_6px_0_var(--qart-error)] z-50',
  warning:
    'bg-qart-warning text-[#1a1a1a] border-qart-warning p-4 flex gap-4 border-[3px] shadow-[6px_6px_0_var(--qart-warning)] z-50',
};

const ToastItem = ({ toast }: { toast: Toast }) => {
  const { removeToast } = useToastStore();
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      layout
      className={TOAST_CLASSES[toast.type]}
    >
      <div className="shrink-0">{TOAST_ICONS[toast.type]}</div>
      <div className="font-bold text-[0.88rem] leading-tight self-center">{toast.message}</div>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-auto opacity-70 hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
        aria-label="Cerrar notificación"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </motion.div>
  );
};

export const ToastProvider = () => {
  const toasts = useToastStore((s) => s.toasts);

  const node = document.getElementById('portal-root');
  if (!node) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-4 max-w-sm w-full font-sans">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>,
    node,
  );
};

export default ToastProvider;
