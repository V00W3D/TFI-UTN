import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { isSuccessResponse } from '@app/sdk';
import type { OrderFulfillment, OrderItem } from '../../../orderStore';
import { useOrderStore } from '../../../orderStore';
import { sdk } from '../../../tools/sdk';
import { formatLandingPrice } from './landingPlateNutrition';

type Phase = 'review' | 'fulfillment' | 'done';

const successMessage: Record<OrderFulfillment, string> = {
  dine_in:
    'Registramos tu pedido para consumir en el local. Te lo acercamos a la mesa cuando la cocina lo tenga listo.',
  pickup:
    'Tu pedido queda pendiente de preparación. Cuando esté listo te avisamos para retirarlo en el mostrador.',
  delivery:
    'Tu pedido quedó registrado para envío a domicilio. Te contactamos cuando salga con reparto.',
};

const fulfillmentLabel: Record<OrderFulfillment, string> = {
  dine_in: 'Para comer en el local',
  pickup: 'Para retirar del local',
  delivery: 'Para recibir en mi casa',
};

interface OrderCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: OrderItem[];
}

const OrderCheckoutModal = ({ open, onClose, items }: OrderCheckoutModalProps) => {
  const finalizeRemoteOrder = useOrderStore((s) => s.finalizeRemoteOrder);
  const [phase, setPhase] = useState<Phase>('review');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneKind, setDoneKind] = useState<OrderFulfillment | null>(null);
  const [doneLifecycle, setDoneLifecycle] = useState<'PENDIENTE' | 'COMPLETADO' | null>(null);

  useEffect(() => {
    if (open) {
      setPhase('review');
      setError(null);
      setDoneKind(null);
      setDoneLifecycle(null);
      setSubmitting(false);
    }
  }, [open]);

  const totalPreview = items.reduce((acc, i) => acc + (i.plate.menuPrice ?? 0) * i.quantity, 0);

  const submit = useCallback(
    async (fulfillment: OrderFulfillment) => {
      if (!items.length) return;
      setSubmitting(true);
      setError(null);
      try {
        const res = await sdk.customers.orders({
          lines: items.map((i) => ({ plateId: i.plate.id, quantity: i.quantity })),
          fulfillment,
        });
        if (!isSuccessResponse(res)) {
          setError(`No pudimos registrar el pedido (${res.error.code}). Probá de nuevo.`);
          return;
        }
        const d = res.data;
        const lines = items.map(({ plate, quantity }) => ({
          plateId: plate.id,
          name: plate.name,
          quantity,
          unitPrice: plate.menuPrice ?? 0,
        }));
        finalizeRemoteOrder({
          id: d.saleId,
          saleId: d.saleId,
          completedAt: new Date().toISOString(),
          lines,
          total: d.totalAmount,
          fulfillment,
          lifecycleStatus: d.lifecycleStatus,
        });
        setDoneKind(fulfillment);
        setDoneLifecycle(d.lifecycleStatus);
        setPhase('done');
      } catch {
        setError('Error de conexión con el servidor. Revisá tu red o intentá más tarde.');
      } finally {
        setSubmitting(false);
      }
    },
    [items, finalizeRemoteOrder],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="order-checkout-backdrop"
            onClick={() => !submitting && onClose()}
            aria-hidden
          />
          <motion.div
            key="checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-checkout-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="order-checkout-modal"
          >
            <div className="order-checkout-head">
              <h2 id="order-checkout-title" className="order-checkout-title">
                {phase === 'review' && 'Tu pedido'}
                {phase === 'fulfillment' && '¿Cómo lo querés?'}
                {phase === 'done' && '¡Listo!'}
              </h2>
              <button
                type="button"
                className="order-checkout-close"
                onClick={() => !submitting && onClose()}
                aria-label="Cerrar"
                disabled={submitting}
              >
                ✕
              </button>
            </div>

            <div className="order-checkout-body">
              {phase === 'review' && (
                <>
                  <p className="order-checkout-lead">
                    Revisá el total antes de confirmar. Los precios se validan al registrar el
                    pedido.
                  </p>
                  <ul className="order-checkout-lines">
                    {items.map(({ plate, quantity }) => (
                      <li key={plate.id} className="order-checkout-line">
                        <span className="order-checkout-line-name">{plate.name}</span>
                        <span className="order-checkout-line-meta">
                          ×{quantity} · {formatLandingPrice(plate.menuPrice)} c/u ·{' '}
                          <strong>{formatLandingPrice((plate.menuPrice ?? 0) * quantity)}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="order-checkout-total-bar">
                    <span className="order-checkout-total-lbl">Total estimado</span>
                    <strong className="order-checkout-total-val">
                      {formatLandingPrice(totalPreview)}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="btn-primary w-full justify-center uppercase tracking-widest mt-4"
                    onClick={() => setPhase('fulfillment')}
                  >
                    Continuar
                  </button>
                </>
              )}

              {phase === 'fulfillment' && (
                <>
                  <p className="order-checkout-lead">
                    Elegí una opción. Con esto guardamos tu pedido en el sistema.
                  </p>
                  {error && <p className="order-checkout-error">{error}</p>}
                  <div className="order-checkout-fulfillment-grid">
                    {(['dine_in', 'pickup', 'delivery'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        className="order-checkout-fulfillment-btn"
                        disabled={submitting}
                        onClick={() => void submit(key)}
                      >
                        <span className="order-checkout-fulfillment-title">
                          {fulfillmentLabel[key]}
                        </span>
                      </button>
                    ))}
                  </div>
                  {submitting && <p className="order-checkout-pending">Registrando pedido…</p>}
                  <button
                    type="button"
                    className="btn-outline w-full justify-center uppercase tracking-widest text-xs py-3 mt-3"
                    disabled={submitting}
                    onClick={() => setPhase('review')}
                  >
                    Volver
                  </button>
                </>
              )}

              {phase === 'done' && doneKind && doneLifecycle && (
                <div className="order-checkout-done">
                  <p className="order-checkout-done-highlight">{fulfillmentLabel[doneKind]}</p>
                  <p className="order-checkout-done-msg">{successMessage[doneKind]}</p>
                  <p className="order-checkout-done-foot">
                    Estado en sistema: <strong>{doneLifecycle}</strong>.
                  </p>
                  <button
                    type="button"
                    className="btn-primary w-full justify-center uppercase tracking-widest mt-5"
                    onClick={onClose}
                  >
                    Entendido
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderCheckoutModal;
