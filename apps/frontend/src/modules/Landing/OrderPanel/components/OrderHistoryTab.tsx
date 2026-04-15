import { Link } from 'react-router-dom';
import { ClockIcon } from '@/modules/Landing/OrderPanel/components/OrderIcons';
import type { OrderHistoryEntry } from '@/shared/store/orderStore';
import { formatLandingPrice } from '@/shared/utils/plateNutrition';
import { buttonStyles } from '@/styles/components/button';
import { landingStyles, orderHistoryStatusStyles } from '@/styles/modules/landing';
import { cn } from '@/styles/utils/cn';

interface OrderHistoryTabProps {
  isFetchingHistory: boolean;
  orderHistory: OrderHistoryEntry[];
  onClosePanel: () => void;
}

const fulfillmentShort: Record<string, string> = {
  dine_in: 'En el local',
  pickup: 'Retiro',
  delivery: 'Delivery',
};

export const OrderHistoryTab = ({
  isFetchingHistory,
  orderHistory,
  onClosePanel,
}: OrderHistoryTabProps) => {
  if (isFetchingHistory) {
    return (
      <div className={landingStyles.orderPanelEmpty}>
        <p className={cn(landingStyles.orderPanelEmptyTitle, landingStyles.orderHistoryLoadingTitle)}>
          Cargando…
        </p>
      </div>
    );
  }

  if (orderHistory.length === 0) {
    return (
      <div className={landingStyles.orderPanelEmpty}>
        <ClockIcon className={landingStyles.orderPanelEmptyIcon} />
        <p className={landingStyles.orderPanelEmptyTitle}>Sin historial todavía</p>
        <p className={landingStyles.orderPanelEmptySub}>Tus pedidos confirmados aparecerán aquí.</p>
        <Link
          to="/search"
          className={cn(
            buttonStyles({ variant: 'primary', size: 'sm' }),
            landingStyles.orderHistoryMenuLink,
          )}
          onClick={onClosePanel}
        >
          Ver el Menú
        </Link>
      </div>
    );
  }

  return (
    <ul className={landingStyles.orderHistoryList}>
      {orderHistory.map((entry) => (
        <li key={entry.id} className={landingStyles.orderHistoryCard}>
          <div className={landingStyles.orderHistoryCardHead}>
            <time className={landingStyles.orderHistoryCardDate}>
              {new Date(entry.completedAt).toLocaleString('es-AR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </time>
            <span className={landingStyles.orderHistoryCardTotal}>
              {formatLandingPrice(entry.total)}
            </span>
          </div>
          <div className={landingStyles.orderHistoryCardMeta}>
            {entry.saleId && (
              <span className={landingStyles.orderHistoryCardPill}>
                #{entry.saleId.slice(0, 8)}
              </span>
            )}
            {entry.fulfillment && (
              <span className={landingStyles.orderHistoryCardPill}>
                {fulfillmentShort[entry.fulfillment]}
              </span>
            )}
            {entry.lifecycleStatus && (
              <span
                className={orderHistoryStatusStyles({
                  status: entry.lifecycleStatus === 'COMPLETADO' ? 'completed' : 'pending',
                })}
              >
                {entry.lifecycleStatus}
              </span>
            )}
          </div>
          <ul className={landingStyles.orderHistoryLines}>
            {entry.lines.map((line) => (
              <li key={`${entry.id}-${line.plateId}`} className={landingStyles.orderHistoryLine}>
                <span className={landingStyles.orderHistoryLineName}>{line.name}</span>
                <span className={landingStyles.orderHistoryLineQty}>×{line.quantity}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
