import { Link } from 'react-router-dom';
import { useOrderStore } from '../../../orderStore';
import { formatLandingPrice } from './landingPlateNutrition';

/**
 * Historial local de pedidos confirmados desde el panel de orden (demo sin backend de ventas).
 */
const OrderHistorySection = () => {
  const orderHistory = useOrderStore((s) => s.orderHistory);

  return (
    <section className="order-history-section" id="mis-pedidos" aria-labelledby="order-history-title">
      <div className="order-history-inner">
        <span className="order-history-kicker">Tu cuenta en el salón</span>
        <h2 id="order-history-title" className="order-history-title">
          Historial de pedidos
        </h2>
        <p className="order-history-lead">
          Cada vez que confirmás una orden desde el panel lateral, queda registrado acá en este dispositivo.
          Así podés recordar qué probaste y, cuando inicies sesión, dejar reseñas con contexto.
        </p>

        {orderHistory.length === 0 ? (
          <div className="order-history-empty">
            Todavía no hay pedidos confirmados. Armá tu orden y tocá <strong>Confirmar pedido</strong> para
            verla en esta lista.
          </div>
        ) : (
          <ul className="order-history-list">
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

        <div className="mt-8">
          <Link
            to="/search"
            className="btn-outline inline-flex uppercase tracking-widest text-xs py-3 px-6"
          >
            Ir al menú completo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderHistorySection;
