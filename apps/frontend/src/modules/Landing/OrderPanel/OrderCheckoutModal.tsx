/**
 * @file OrderCheckoutModal.tsx
 * @module Landing
 * @description Archivo OrderCheckoutModal alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: framer-motion, react, @app/sdk, orderStore, sdk, landingPlateNutrition
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
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { isSuccessResponse } from '@app/sdk';
import type { OrderFulfillment, OrderItem } from '@/shared/store/orderStore';
import { useOrderStore } from '@/shared/store/orderStore';
import { formatLandingPrice } from '@/shared/utils/plateNutrition';
import { sdk } from '@/shared/utils/sdk';
import {
  landingStyles,
  orderCheckoutActionStyles,
  orderCheckoutFulfillmentButtonStyles,
} from '@/styles/modules/landing';

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
            className={landingStyles.orderCheckoutBackdrop}
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
            className={landingStyles.orderCheckoutModal}
          >
            <div className={landingStyles.orderCheckoutHead}>
              <h2 id="order-checkout-title" className={landingStyles.orderCheckoutTitle}>
                {phase === 'review' && 'Tu pedido'}
                {phase === 'fulfillment' && '¿Cómo lo querés?'}
                {phase === 'done' && '¡Listo!'}
              </h2>
              <button
                type="button"
                className={landingStyles.orderCheckoutClose}
                onClick={() => !submitting && onClose()}
                aria-label="Cerrar"
                disabled={submitting}
              >
                ✕
              </button>
            </div>

            <div className={landingStyles.orderCheckoutBody}>
              {phase === 'review' && (
                <>
                  <p className={landingStyles.orderCheckoutLead}>
                    Revisá el total antes de confirmar. Los precios se validan al registrar el
                    pedido.
                  </p>
                  <ul className={landingStyles.orderCheckoutLines}>
                    {items.map(({ plate, quantity }) => (
                      <li key={plate.id} className={landingStyles.orderCheckoutLine}>
                        <span className={landingStyles.orderCheckoutLineName}>{plate.name}</span>
                        <span className={landingStyles.orderCheckoutLineMeta}>
                          ×{quantity} · {formatLandingPrice(plate.menuPrice)} c/u ·{' '}
                          <strong>{formatLandingPrice((plate.menuPrice ?? 0) * quantity)}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className={landingStyles.orderCheckoutTotalBar}>
                    <span className={landingStyles.orderCheckoutTotalLabel}>Total estimado</span>
                    <strong className={landingStyles.orderCheckoutTotalValue}>
                      {formatLandingPrice(totalPreview)}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className={orderCheckoutActionStyles({ tone: 'primary', spacing: 'review' })}
                    onClick={() => setPhase('fulfillment')}
                  >
                    Continuar
                  </button>
                </>
              )}

              {phase === 'fulfillment' && (
                <>
                  <p className={landingStyles.orderCheckoutLead}>
                    Elegí una opción. Con esto guardamos tu pedido en el sistema.
                  </p>
                  {error && <p className={landingStyles.orderCheckoutError}>{error}</p>}
                  <div className={landingStyles.orderCheckoutFulfillmentGrid}>
                    {(['dine_in', 'pickup', 'delivery'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={orderCheckoutFulfillmentButtonStyles()}
                        disabled={submitting}
                        onClick={() => void submit(key)}
                      >
                        <span className={landingStyles.orderCheckoutFulfillmentTitle}>
                          {fulfillmentLabel[key]}
                        </span>
                      </button>
                    ))}
                  </div>
                  {submitting && (
                    <p className={landingStyles.orderCheckoutPending}>Registrando pedido…</p>
                  )}
                  <button
                    type="button"
                    className={orderCheckoutActionStyles({ tone: 'secondary', spacing: 'back' })}
                    disabled={submitting}
                    onClick={() => setPhase('review')}
                  >
                    Volver
                  </button>
                </>
              )}

              {phase === 'done' && doneKind && doneLifecycle && (
                <div className={landingStyles.orderCheckoutDone}>
                  <p className={landingStyles.orderCheckoutDoneHighlight}>
                    {fulfillmentLabel[doneKind]}
                  </p>
                  <p className={landingStyles.orderCheckoutDoneMessage}>
                    {successMessage[doneKind]}
                  </p>
                  <p className={landingStyles.orderCheckoutDoneFoot}>
                    Estado en sistema: <strong>{doneLifecycle}</strong>.
                  </p>
                  <button
                    type="button"
                    className={orderCheckoutActionStyles({ tone: 'primary', spacing: 'done' })}
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

