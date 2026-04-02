import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useOrderStore } from '../../../orderStore';
import OrderCheckoutModal from './OrderCheckoutModal';
import { formatLandingPrice } from './landingPlateNutrition';

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

const OrderPanel = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { items, isOpen, setOpen, removeItem, updateQuantity, clearOrder } = useOrderStore();
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + (i.plate.menuPrice ?? 0) * i.quantity, 0);

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            className="order-panel"
            aria-label="Orden actual"
          >
            <div className="order-panel-header">
              <div className="order-panel-header-identity">
                <ParchmentIcon className="order-panel-header-icon" />
                <div className="order-panel-header-text">
                  <h2 className="order-panel-title">Orden</h2>
                  <span className="order-panel-subtitle">
                    {totalItems} {totalItems === 1 ? 'plato' : 'platos'}
                  </span>
                </div>
              </div>

              <div className="order-panel-header-actions">
                {items.length > 0 && (
                  <button
                    type="button"
                    className="order-panel-clear-btn"
                    onClick={clearOrder}
                  >
                    Limpiar
                  </button>
                )}
                <button
                  type="button"
                  className="order-panel-close-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar orden"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="order-panel-body">
              {items.length === 0 ? (
                <div className="order-panel-empty">
                  <ParchmentIcon className="order-panel-empty-icon" />
                  <p className="order-panel-empty-title">Tu orden está vacía</p>
                  <span className="order-panel-empty-sub">
                    Añadí platos desde el menú destacado.
                  </span>
                </div>
              ) : (
                <ul className="order-panel-list">
                  {items.map(({ plate, quantity }) => (
                    <li key={plate.id} className="order-panel-item">
                      <div className="order-panel-item-info">
                        <span className="order-panel-item-name">{plate.name}</span>
                        <span className="order-panel-item-unit">
                          {formatLandingPrice(plate.menuPrice)} c/u
                        </span>
                      </div>
                      <div className="order-panel-item-row">
                        <div className="order-panel-qty">
                          <button
                            type="button"
                            className="order-panel-qty-btn"
                            onClick={() => updateQuantity(plate.id, quantity - 1)}
                            aria-label="Reducir cantidad"
                          >
                            −
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
                            +
                          </button>
                        </div>
                        <span className="order-panel-item-subtotal">
                          {formatLandingPrice((plate.menuPrice ?? 0) * quantity)}
                        </span>
                        <button
                          type="button"
                          className="order-panel-item-remove"
                          onClick={() => removeItem(plate.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="order-panel-footer">
                <div className="order-panel-total">
                  <span className="order-panel-total-label">Total</span>
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
