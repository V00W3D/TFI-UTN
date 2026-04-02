import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { useOrderStore, type OrderFulfillment } from '../../../orderStore';
import { formatLandingPrice } from './landingPlateNutrition';

const fulfillmentShort: Record<OrderFulfillment, string> = {
  dine_in: 'En el local',
  pickup: 'Retiro',
  delivery: 'Delivery',
};

interface OrderHistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Panel lateral: historial de pedidos solo con datos si hay sesión;
 * sin sesión muestra aviso y CTA a login.
 */
const OrderHistoryPanel = ({ open, onClose }: OrderHistoryPanelProps) => {
  const user = useAppStore((s) => s.user);
  const orderHistory = useOrderStore((s) => s.orderHistory);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="history-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="order-history-drawer-backdrop"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            key="history-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            className="order-history-drawer"
            aria-label="Historial de pedidos"
          >
            <div className="order-history-drawer-header">
              <h2 className="order-history-drawer-title">Historial</h2>
              <button type="button" className="order-history-drawer-close" onClick={onClose} aria-label="Cerrar">
                ✕
              </button>
            </div>
            <div className="order-history-drawer-body">
              {!user ? (
                <div className="order-history-drawer-gate">
                  <p className="order-history-drawer-gate-title">Iniciá sesión</p>
                  <p className="order-history-drawer-gate-text">
                    Para ver tu historial de pedidos necesitás una cuenta e iniciar sesión. Los pedidos que
                    confirmes desde la orden quedan guardados en este dispositivo y podrás revisarlos cuando
                    vuelvas entrando con tu usuario.
                  </p>
                  <div className="order-history-drawer-gate-actions">
                    <Link
                      to="/iam/login"
                      className="btn-primary w-full justify-center uppercase tracking-widest text-xs py-3"
                      onClick={onClose}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/iam/register"
                      className="btn-outline w-full justify-center uppercase tracking-widest text-xs py-3"
                      onClick={onClose}
                    >
                      Crear cuenta
                    </Link>
                  </div>
                </div>
              ) : orderHistory.length === 0 ? (
                <div className="order-history-drawer-empty">
                  <p className="order-history-drawer-empty-title">Todavía no hay pedidos</p>
                  <p className="order-history-drawer-empty-sub">
                    Confirmá un pedido desde el panel <strong>Orden</strong> para verlo listado acá.
                  </p>
                  <Link
                    to="/search"
                    className="btn-primary w-full justify-center uppercase tracking-widest text-xs py-3 mt-4"
                    onClick={onClose}
                  >
                    Ir al menú
                  </Link>
                </div>
              ) : (
                <ul className="order-history-list order-history-list--drawer">
                  {orderHistory.map((entry) => (
                    <li key={entry.id} className="order-history-card">
                      <div className="order-history-card-head">
                        <time className="order-history-card-date" dateTime={entry.completedAt}>
                          {new Date(entry.completedAt).toLocaleString('es-AR', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </time>
                        <span className="order-history-card-total">{formatLandingPrice(entry.total)}</span>
                      </div>
                      {(entry.saleId || entry.fulfillment || entry.lifecycleStatus) && (
                        <div className="order-history-card-meta">
                          {entry.saleId && (
                            <span className="order-history-card-pill order-history-card-pill--id">
                              #{entry.saleId.slice(0, 8)}
                            </span>
                          )}
                          {entry.fulfillment && (
                            <span className="order-history-card-pill">{fulfillmentShort[entry.fulfillment]}</span>
                          )}
                          {entry.lifecycleStatus && (
                            <span
                              className={`order-history-card-pill order-history-card-pill--status order-history-card-pill--${entry.lifecycleStatus.toLowerCase()}`}
                            >
                              {entry.lifecycleStatus}
                            </span>
                          )}
                        </div>
                      )}
                      <ul className="order-history-lines">
                        {entry.lines.map((line) => (
                          <li key={`${entry.id}-${line.plateId}`} className="order-history-line">
                            <span className="order-history-line-name">{line.name}</span>
                            <span className="order-history-line-qty">
                              ×{line.quantity} · {formatLandingPrice(line.unitPrice)} c/u
                            </span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderHistoryPanel;
