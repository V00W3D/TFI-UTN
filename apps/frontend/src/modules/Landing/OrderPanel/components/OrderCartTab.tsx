import type { OrderItem } from '@/shared/store/orderStore';
import { ParchmentIcon, TrashIcon, XIcon, MinusIcon, PlusSmIcon } from '@/modules/Landing/OrderPanel/components/OrderIcons';
import { formatLandingPrice } from '@/shared/utils/plateNutrition';
import { landingStyles } from '@/styles/modules/landing';

interface OrderCartTabProps {
  items: OrderItem[];
  totalItems: number;
  clearOrder: () => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
}

export const OrderCartTab = ({
  items,
  totalItems,
  clearOrder,
  removeItem,
  updateQuantity,
}: OrderCartTabProps) => {
  if (items.length === 0) {
    return (
      <div className={landingStyles.orderPanelEmpty}>
        <ParchmentIcon className={landingStyles.orderPanelEmptyIcon} />
        <p className={landingStyles.orderPanelEmptyTitle}>Tu orden está vacía</p>
        <span className={landingStyles.orderPanelEmptySub}>
          Añadí platos desde el menú destacado.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={landingStyles.orderPanelActionsBar}>
        <span className={landingStyles.orderPanelActionsCount}>
          {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
        </span>
        <button type="button" className={landingStyles.orderPanelClear} onClick={clearOrder}>
          <TrashIcon width={12} height={12} />
          Vaciar
        </button>
      </div>

      <ul className={landingStyles.orderPanelList}>
        {items.map(({ plate, quantity }) => (
          <li key={plate.id} className={landingStyles.orderPanelItem}>
            <div className={landingStyles.orderPanelItemHead}>
              <span className={landingStyles.orderPanelItemName}>{plate.name}</span>
              <button
                type="button"
                className={landingStyles.orderPanelItemRemove}
                onClick={() => removeItem(plate.id)}
                aria-label={`Quitar ${plate.name}`}
              >
                <XIcon width={12} height={12} />
              </button>
            </div>
            <div className={landingStyles.orderPanelItemFoot}>
              <div className={landingStyles.orderPanelQty}>
                <button
                  type="button"
                  className={landingStyles.orderPanelQtyBtn}
                  onClick={() => updateQuantity(plate.id, Math.max(1, quantity - 1))}
                  aria-label="Reducir cantidad"
                >
                  <MinusIcon width={12} height={12} />
                </button>
                <input
                  type="number"
                  className={landingStyles.orderPanelQtyInput}
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
                  className={landingStyles.orderPanelQtyBtn}
                  onClick={() => updateQuantity(plate.id, quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  <PlusSmIcon width={12} height={12} />
                </button>
              </div>
              <div className={landingStyles.orderPanelItemPricing}>
                <span className={landingStyles.orderPanelItemUnit}>
                  {formatLandingPrice(plate.menuPrice)} c/u
                </span>
                <span className={landingStyles.orderPanelItemSubtotal}>
                  {formatLandingPrice((plate.menuPrice ?? 0) * quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
