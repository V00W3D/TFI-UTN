/**
 * @file index.tsx
 * @module OrderPanel
 * @description Orquestador del panel lateral de pedidos e historial.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import OrderCheckoutModal from '@/modules/Landing/OrderPanel/OrderCheckoutModal';
import { OrderCartTab } from '@/modules/Landing/OrderPanel/components/OrderCartTab';
import { OrderHistoryTab } from '@/modules/Landing/OrderPanel/components/OrderHistoryTab';
import {
  ClockIcon,
  ParchmentIcon,
  XIcon,
} from '@/modules/Landing/OrderPanel/components/OrderIcons';
import { useOrderStore } from '@/shared/store/orderStore';
import { formatLandingPrice } from '@/shared/utils/plateNutrition';
import { buttonStyles } from '@/styles/components/button';
import { landingStyles, orderPanelTabStyles } from '@/styles/modules/landing';
import { cn } from '@/styles/utils/cn';

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
              className={landingStyles.orderPanelBackdrop}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              key="order-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              className={landingStyles.orderPanel}
              aria-label="Gestión de pedidos"
            >
              <div className={landingStyles.orderPanelHeader}>
                <div className={landingStyles.orderPanelTabsWrap}>
                  <button
                    onClick={() => setActiveTab('cart')}
                    className={orderPanelTabStyles({ active: activeTab === 'cart' })}
                  >
                    <ParchmentIcon className={landingStyles.orderPanelTabIcon} />
                    <span>Tu Pedido</span>
                    {totalItems > 0 && (
                      <span className={landingStyles.orderPanelCountBadge}>
                        {totalItems}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={orderPanelTabStyles({ active: activeTab === 'history' })}
                  >
                    <ClockIcon className={landingStyles.orderPanelTabIcon} />
                    <span>Historial</span>
                  </button>
                </div>

                <button
                  type="button"
                  className={landingStyles.orderPanelClose}
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar panel"
                >
                  <XIcon className={landingStyles.orderPanelCloseIcon} />
                </button>
              </div>

              <div className={landingStyles.orderPanelBody}>
                {activeTab === 'cart' ? (
                  <OrderCartTab
                    items={items}
                    totalItems={totalItems}
                    clearOrder={clearOrder}
                    removeItem={removeItem}
                    updateQuantity={updateQuantity}
                  />
                ) : (
                  <OrderHistoryTab
                    isFetchingHistory={isFetchingHistory}
                    orderHistory={orderHistory}
                    onClosePanel={() => setOpen(false)}
                  />
                )}
              </div>

              {activeTab === 'cart' && items.length > 0 && (
                <div className={landingStyles.orderPanelFooter}>
                  <div className={landingStyles.orderPanelTotal}>
                    <span className={landingStyles.orderPanelTotalLabel}>Total estimado</span>
                    <strong className={landingStyles.orderPanelTotalValue}>
                      {formatLandingPrice(totalPrice)}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className={cn(
                      buttonStyles({ variant: 'primary', size: 'sm' }),
                      landingStyles.orderPanelCheckoutButton,
                    )}
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

export default OrderPanel;
