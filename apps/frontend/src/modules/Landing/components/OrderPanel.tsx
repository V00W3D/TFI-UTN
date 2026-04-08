/**
 * @file OrderPanel.tsx
 * @module Landing
 * @description Archivo OrderPanel alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
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
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore, type OrderFulfillment } from '../../../orderStore';
import OrderCheckoutModal from './OrderCheckoutModal';
import { formatLandingPrice } from './landingPlateNutrition';

/* ─── Icons ─── */

const ParchmentIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
  >
    <rect x="4" y="2" width="16" height="20" />
    <line x1="4" y1="6" x2="8" y2="6" />
    <line x1="4" y1="18" x2="8" y2="18" />
    <line x1="7" y1="8" x2="17" y2="8" />
    <line x1="7" y1="11" x2="17" y2="11" />
    <line x1="7" y1="14" x2="13" y2="14" />
    <circle cx="17" cy="15" r="1.2" fill="currentColor" stroke="none" />
    <line x1="16" y1="16" x2="18" y2="18" strokeWidth="1.5" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
    aria-hidden
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusSmIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
    aria-hidden
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ─── Data ─── */
const fulfillmentShort: Record<OrderFulfillment, string> = {
  dine_in: 'En el local',
  pickup: 'Retiro',
  delivery: 'Delivery',
};

/* ─── Component ─── */
const OrderPanel = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const {
    items,
    isOpen,
    setOpen,
    removeItem,
    updateQuantity,
    clearOrder,
    activeTab,
    setActiveTab,
    orderHistory,
    fetchHistory,
    isFetchingHistory,
  } = useOrderStore();

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + (i.plate.menuPrice ?? 0) * i.quantity, 0);

  useEffect(() => {
    if (isOpen && activeTab === 'history') void fetchHistory();
  }, [isOpen, activeTab, fetchHistory]);

  return (
    <>
      <OrderCheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="order-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="order-panel-backdrop"
              onClick={() => setOpen(false)}
            />

            <motion.aside
              key="order-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              className="order-panel"
              aria-label="Gestión de pedidos"
            >
              {/* ── Header / Tabs ── */}
              <div className="order-panel-header">
                <div className="order-panel-tabs">
                  <button
                    onClick={() => setActiveTab('cart')}
                    className={`order-panel-tab ${activeTab === 'cart' ? 'order-panel-tab--active' : ''}`}
                  >
                    <ParchmentIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Tu Pedido</span>
                    {totalItems > 0 && <span className="order-panel-tab-badge">{totalItems}</span>}
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`order-panel-tab ${activeTab === 'history' ? 'order-panel-tab--active' : ''}`}
                  >
                    <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Historial</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="order-panel-close-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar panel"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* ── Body ── */}
              <div className="order-panel-body">
                {activeTab === 'cart' ? (
                  <>
                    {items.length === 0 ? (
                      <div className="order-panel-empty">
                        <ParchmentIcon className="order-panel-empty-icon" />
                        <p className="order-panel-empty-title">Tu orden está vacía</p>
                        <span className="order-panel-empty-sub">
                          Añadí platos desde el menú destacado.
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Top actions bar */}
                        <div className="order-panel-actions-bar">
                          <span className="order-panel-actions-count">
                            {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
                          </span>
                          <button
                            type="button"
                            className="order-panel-clear-btn"
                            onClick={clearOrder}
                          >
                            <TrashIcon className="w-3 h-3" />
                            Vaciar
                          </button>
                        </div>

                        <ul className="order-panel-list">
                          {items.map(({ plate, quantity }) => (
                            <li key={plate.id} className="order-panel-item">
                              <div className="order-panel-item-head">
                                <span className="order-panel-item-name">{plate.name}</span>
                                <button
                                  type="button"
                                  className="order-panel-item-remove"
                                  onClick={() => removeItem(plate.id)}
                                  aria-label={`Quitar ${plate.name}`}
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="order-panel-item-foot">
                                <div className="order-panel-qty">
                                  <button
                                    type="button"
                                    className="order-panel-qty-btn"
                                    onClick={() =>
                                      updateQuantity(plate.id, Math.max(1, quantity - 1))
                                    }
                                    aria-label="Reducir cantidad"
                                  >
                                    <MinusIcon className="w-3 h-3" />
                                  </button>
                                  <input
                                    type="number"
                                    className="order-panel-qty-input"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => {
                                      const v = parseInt(e.target.value, 10);
                                      if (!isNaN(v) && v > 0) updateQuantity(plate.id, v);
                                    }}
                                    aria-label="Cantidad"
                                  />
                                  <button
                                    type="button"
                                    className="order-panel-qty-btn"
                                    onClick={() => updateQuantity(plate.id, quantity + 1)}
                                    aria-label="Aumentar cantidad"
                                  >
                                    <PlusSmIcon className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="order-panel-item-pricing">
                                  <span className="order-panel-item-unit">
                                    {formatLandingPrice(plate.menuPrice)} c/u
                                  </span>
                                  <span className="order-panel-item-subtotal">
                                    {formatLandingPrice((plate.menuPrice ?? 0) * quantity)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                ) : (
                  /* ── History tab ── */
                  <div className="order-history-content">
                    {isFetchingHistory ? (
                      <div className="order-panel-empty">
                        <p className="order-panel-empty-title animate-pulse">Cargando…</p>
                      </div>
                    ) : orderHistory.length === 0 ? (
                      <div className="order-panel-empty">
                        <ClockIcon className="order-panel-empty-icon" />
                        <p className="order-panel-empty-title">Sin historial todavía</p>
                        <p className="order-panel-empty-sub">
                          Tus pedidos confirmados aparecerán aquí.
                        </p>
                        <Link
                          to="/search"
                          className="btn-primary mt-6 justify-center uppercase tracking-widest text-[0.7rem]"
                          onClick={() => setOpen(false)}
                        >
                          Ver el Menú
                        </Link>
                      </div>
                    ) : (
                      <ul className="order-history-list order-history-list--panel">
                        {orderHistory.map((entry) => (
                          <li key={entry.id} className="order-history-card">
                            <div className="order-history-card-head">
                              <time className="order-history-card-date">
                                {new Date(entry.completedAt).toLocaleString('es-AR', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </time>
                              <span className="order-history-card-total">
                                {formatLandingPrice(entry.total)}
                              </span>
                            </div>
                            <div className="order-history-card-meta">
                              {entry.saleId && (
                                <span className="order-history-card-pill order-history-card-pill--id">
                                  #{entry.saleId.slice(0, 8)}
                                </span>
                              )}
                              {entry.fulfillment && (
                                <span className="order-history-card-pill">
                                  {fulfillmentShort[entry.fulfillment]}
                                </span>
                              )}
                              {entry.lifecycleStatus && (
                                <span
                                  className={`order-history-card-pill order-history-card-pill--status order-history-card-pill--${entry.lifecycleStatus.toLowerCase()}`}
                                >
                                  {entry.lifecycleStatus}
                                </span>
                              )}
                            </div>
                            <ul className="order-history-lines">
                              {entry.lines.map((line) => (
                                <li
                                  key={`${entry.id}-${line.plateId}`}
                                  className="order-history-line"
                                >
                                  <span className="order-history-line-name">{line.name}</span>
                                  <span className="order-history-line-qty">×{line.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* ── Footer (cart only) ── */}
              {activeTab === 'cart' && items.length > 0 && (
                <div className="order-panel-footer">
                  <div className="order-panel-total">
                    <span className="order-panel-total-label">Total estimado</span>
                    <strong className="order-panel-total-value">
                      {formatLandingPrice(totalPrice)}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="btn-primary w-full justify-center uppercase tracking-widest"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    Realizar pedido
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export { ParchmentIcon };
export default OrderPanel;
