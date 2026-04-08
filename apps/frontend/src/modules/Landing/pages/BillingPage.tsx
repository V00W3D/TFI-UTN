import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import Navbar from '../components/Navbar';
import OrderPanel from '../components/OrderPanel';
import { billingPlans } from '../billingPlans';
import { formatLandingPrice } from '../components/landingPlateNutrition';
import '../LandingPages.css';

const BillingPage = () => {
  const { setModule, user } = useAppStore();

  useEffect(() => {
    setModule('LANDING');
  }, [setModule]);

  const activeTier = user?.profile.tier ?? 'REGULAR';

  return (
    <div className="min-h-screen bg-qart-bg overflow-x-hidden">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-20 pt-28 md:gap-14">
        <section className="border-2 border-qart-primary bg-qart-surface p-6 shadow-[12px_12px_0_var(--qart-primary)] md:p-8">
          <div className="mb-5 h-1.5 w-20 bg-qart-accent" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-qart-text-muted">
                Facturacion y membresias
              </p>
              <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-qart-primary md:text-6xl leading-[0.9]">
                Planes QART
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-qart-text-muted md:text-lg">
                Regular compra comida. VIP recibe recomendaciones. Premium suma un sistema que lo
                guia. Aca viven los planes porque el valor, el precio y los beneficios tienen que
                verse juntos.
              </p>
            </div>

            <div className="border border-qart-border bg-qart-bg-warm p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                Tu estado actual
              </p>
              <p className="mt-2 text-3xl font-black uppercase tracking-tight text-qart-primary">
                {activeTier}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-qart-text-muted">
                Si cambias de plan, la experiencia cambia de verdad: mas personalizacion, mejores
                canjes y mas acompanamiento nutricional.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/config" className="btn-outline min-h-0! px-4! py-3! text-xs!">
                  Ver mi cuenta
                </Link>
                <a href="#planes" className="btn-primary min-h-0! px-4! py-3! text-xs!">
                  Comparar planes
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="planes" className="grid gap-6 xl:grid-cols-3">
          {billingPlans.map((plan) => {
            const isActive = plan.id === activeTier;

            return (
              <article
                key={plan.id}
                className={`border-2 p-6 shadow-[10px_10px_0_var(--qart-primary)] ${
                  isActive
                    ? 'border-qart-primary bg-qart-surface'
                    : 'border-qart-border bg-qart-surface-sunken/70'
                }`}
              >
                <div className={`mb-5 h-1.5 w-16 ${plan.accentClassName}`} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                      {plan.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-qart-primary">
                      {plan.name}
                    </h2>
                  </div>
                  {isActive && (
                    <span className="border border-qart-border bg-qart-primary px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                      Actual
                    </span>
                  )}
                </div>

                <p className="mt-4 min-h-[96px] text-sm leading-relaxed text-qart-text-muted">
                  {plan.summary}
                </p>

                <div className="mt-5 border border-qart-border bg-qart-bg-warm p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                    Precio mensual final
                  </p>
                  <p className="mt-2 text-4xl font-black tracking-tight text-qart-primary">
                    {formatLandingPrice(plan.pricing.finalPrice)}
                  </p>
                  <p className="mt-2 text-xs text-qart-text-muted">
                    Neto {formatLandingPrice(plan.pricing.netPrice)} + impuestos incluidos{' '}
                    {formatLandingPrice(plan.pricing.taxAmount)}.
                  </p>
                  <p className="mt-2 text-xs text-qart-text-muted">
                    Anual: {formatLandingPrice(plan.pricing.yearlyPrice)}. Ahorro estimado:{' '}
                    {formatLandingPrice(plan.pricing.yearlySavings)}.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-sm font-black uppercase tracking-[0.08em] text-qart-primary">
                    Diferencia real
                  </p>
                  <p className="border border-qart-border bg-qart-surface px-4 py-3 text-sm font-medium text-qart-primary">
                    {plan.differentiator}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-sm font-black uppercase tracking-[0.08em] text-qart-primary">
                    Beneficios incluidos
                  </p>
                  {plan.features.map((feature) => (
                    <p
                      key={feature}
                      className="border border-qart-border bg-qart-bg-warm px-4 py-3 text-sm text-qart-primary"
                    >
                      {feature}
                    </p>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 border-t border-qart-border pt-5 text-sm text-qart-text-muted">
                  <p>
                    <span className="font-black text-qart-primary">QART:</span> x
                    {plan.qartMultiplier.toFixed(1)} por compra.
                  </p>
                  <p>
                    <span className="font-black text-qart-primary">Canjes:</span>{' '}
                    {plan.redemptionCopy}
                  </p>
                  <p>
                    <span className="font-black text-qart-primary">Impuestos activos:</span>{' '}
                    {plan.pricing.activeTaxRules
                      .map((rule) => `${rule.label} ${rule.rate * 100}%`)
                      .join(', ')}
                  </p>
                </div>

                <button
                  type="button"
                  className={`mt-6 w-full min-h-0! px-4! py-3.5! text-xs! ${
                    isActive ? 'btn-outline' : 'btn-primary'
                  }`}
                >
                  {isActive ? 'Ya es tu plan' : `Elegir ${plan.name}`}
                </button>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <article className="border-2 border-qart-primary bg-qart-surface p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
              Logica de negocio
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-qart-primary">
              Como se diferencia cada nivel
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="border border-qart-border bg-qart-bg-warm p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-qart-primary">
                  Regular
                </p>
                <p className="mt-2 text-sm text-qart-text-muted">Compra comida y suma puntos.</p>
              </div>
              <div className="border border-qart-border bg-qart-bg-warm p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-qart-primary">
                  VIP
                </p>
                <p className="mt-2 text-sm text-qart-text-muted">
                  Recibe recomendaciones adaptadas a su objetivo.
                </p>
              </div>
              <div className="border border-qart-border bg-qart-bg-warm p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-qart-primary">
                  Premium
                </p>
                <p className="mt-2 text-sm text-qart-text-muted">
                  Tiene un sistema que lo guia y le recalcula el camino.
                </p>
              </div>
            </div>
          </article>

          <article className="border-2 border-qart-primary bg-qart-surface p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
              Base fiscal aplicada
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-qart-primary">
              Precio con criterio real
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-qart-text-muted">
              Los importes finales usan la misma idea del SDK: costo neto base, markup operativo y
              carga impositiva incluida en precio final. Hoy el impuesto activo es IVA 21%, tomado
              desde la configuracion fiscal compartida del proyecto.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-qart-text-muted">
              Eso deja a la pagina de facturacion alineada con la tesis y con el modelo comercial
              del sistema, en vez de mostrar numeros decorativos.
            </p>
          </article>
        </section>
      </main>

      <OrderPanel />
    </div>
  );
};

export default BillingPage;
