import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billingPlans } from '@/modules/Landing/billingPlans';
import { Navbar } from '@/modules/Landing/Navbar';
import OrderPanel from '@/modules/Landing/OrderPanel';
import { useAppStore } from '@/shared/store/appStore';
import { formatLandingPrice } from '@/shared/utils/plateNutrition';
import { buttonStyles } from '@/styles/components/button';
import { landingSectionStyles } from '@/styles/modules/landingSections';
import { cn } from '@/styles/utils/cn';

const BillingPage = () => {
  const { setModule, user } = useAppStore();

  useEffect(() => {
    setModule('LANDING');
  }, [setModule]);

  const activeTier = user?.profile.tier ?? 'REGULAR';

  return (
    <div className={landingSectionStyles.billingPage}>
      <Navbar />

      <main className={landingSectionStyles.billingMain}>
        <section className={landingSectionStyles.billingHero}>
          <div className={landingSectionStyles.billingHeroBar} />
          <div className={landingSectionStyles.billingHeroGrid}>
            <div>
              <p className={landingSectionStyles.billingEyebrow}>
                Facturacion y membresias
              </p>
              <h1 className={landingSectionStyles.billingTitle}>
                Planes QART
              </h1>
              <p className={landingSectionStyles.billingLead}>
                Regular compra comida. VIP recibe recomendaciones. Premium suma un sistema que lo
                guia. Aca viven los planes porque el valor, el precio y los beneficios tienen que
                verse juntos.
              </p>
            </div>

            <div className={landingSectionStyles.billingStatusCard}>
              <p className={landingSectionStyles.billingEyebrow}>
                Tu estado actual
              </p>
              <p className={landingSectionStyles.billingStatusValue}>
                {activeTier}
              </p>
              <p className={landingSectionStyles.billingStatusCopy}>
                Si cambias de plan, la experiencia cambia de verdad: mas personalizacion, mejores
                canjes y mas acompanamiento nutricional.
              </p>
              <div className={landingSectionStyles.billingStatusActions}>
                <Link to="/config" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
                  Ver mi cuenta
                </Link>
                <a href="#planes" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                  Comparar planes
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="planes" className={landingSectionStyles.billingPlansGrid}>
          {billingPlans.map((plan) => {
            const isActive = plan.id === activeTier;

            return (
              <article
                key={plan.id}
                className={cn(
                  landingSectionStyles.billingPlanCard,
                  isActive
                    ? landingSectionStyles.billingPlanActive
                    : landingSectionStyles.billingPlanInactive,
                )}
              >
                <div
                  className={cn(
                    landingSectionStyles.billingPlanAccentBar,
                    landingSectionStyles.billingPlanAccentStyles[plan.accentTone],
                  )}
                />
                <div className={landingSectionStyles.billingPlanHead}>
                  <div>
                    <p className={landingSectionStyles.billingEyebrow}>
                      {plan.eyebrow}
                    </p>
                    <h2 className={landingSectionStyles.billingPlanName}>
                      {plan.name}
                    </h2>
                  </div>
                  {isActive && (
                    <span className={landingSectionStyles.billingPlanBadge}>
                      Actual
                    </span>
                  )}
                </div>

                <p className={landingSectionStyles.billingPlanSummary}>
                  {plan.summary}
                </p>

                <div className={landingSectionStyles.billingPriceCard}>
                  <p className={landingSectionStyles.billingEyebrow}>
                    Precio mensual final
                  </p>
                  <p className={landingSectionStyles.billingPriceValue}>
                    {formatLandingPrice(plan.pricing.finalPrice)}
                  </p>
                  <p className={landingSectionStyles.billingPriceCopy}>
                    Neto {formatLandingPrice(plan.pricing.netPrice)} + impuestos incluidos{' '}
                    {formatLandingPrice(plan.pricing.taxAmount)}.
                  </p>
                  <p className={landingSectionStyles.billingPriceCopy}>
                    Anual: {formatLandingPrice(plan.pricing.yearlyPrice)}. Ahorro estimado:{' '}
                    {formatLandingPrice(plan.pricing.yearlySavings)}.
                  </p>
                </div>

                <div className={landingSectionStyles.billingBlock}>
                  <p className={landingSectionStyles.billingBlockTitle}>
                    Diferencia real
                  </p>
                  <p className={landingSectionStyles.billingBlockCard}>
                    {plan.differentiator}
                  </p>
                </div>

                <div className={landingSectionStyles.billingBlock}>
                  <p className={landingSectionStyles.billingBlockTitle}>
                    Beneficios incluidos
                  </p>
                  {plan.features.map((feature) => (
                    <p key={feature} className={landingSectionStyles.billingFeatureCard}>
                      {feature}
                    </p>
                  ))}
                </div>

                <div className={landingSectionStyles.billingMeta}>
                  <p>
                    <span className={landingSectionStyles.billingMetaStrong}>QART:</span> x
                    {plan.qartMultiplier.toFixed(1)} por compra.
                  </p>
                  <p>
                    <span className={landingSectionStyles.billingMetaStrong}>Canjes:</span>{' '}
                    {plan.redemptionCopy}
                  </p>
                  <p>
                    <span className={landingSectionStyles.billingMetaStrong}>Impuestos activos:</span>{' '}
                    {plan.pricing.activeTaxRules
                      .map((rule) => `${rule.label} ${rule.rate * 100}%`)
                      .join(', ')}
                  </p>
                </div>

                <button
                  type="button"
                  className={cn(
                    isActive
                      ? buttonStyles({ variant: 'secondary', size: 'sm' })
                      : buttonStyles({ variant: 'primary', size: 'sm' }),
                    landingSectionStyles.billingButton,
                  )}
                >
                  {isActive ? 'Ya es tu plan' : `Elegir ${plan.name}`}
                </button>
              </article>
            );
          })}
        </section>

        <section className={landingSectionStyles.billingDetailGrid}>
          <article className={landingSectionStyles.billingDetailCard}>
            <p className={landingSectionStyles.billingEyebrow}>
              Logica de negocio
            </p>
            <h2 className={landingSectionStyles.billingDetailTitle}>
              Como se diferencia cada nivel
            </h2>
            <div className={landingSectionStyles.billingDetailGridInner}>
              <div className={landingSectionStyles.billingMiniCard}>
                <p className={landingSectionStyles.billingMiniLabel}>
                  Regular
                </p>
                <p className={landingSectionStyles.billingMiniCopy}>Compra comida y suma puntos.</p>
              </div>
              <div className={landingSectionStyles.billingMiniCard}>
                <p className={landingSectionStyles.billingMiniLabel}>
                  VIP
                </p>
                <p className={landingSectionStyles.billingMiniCopy}>
                  Recibe recomendaciones adaptadas a su objetivo.
                </p>
              </div>
              <div className={landingSectionStyles.billingMiniCard}>
                <p className={landingSectionStyles.billingMiniLabel}>
                  Premium
                </p>
                <p className={landingSectionStyles.billingMiniCopy}>
                  Tiene un sistema que lo guia y le recalcula el camino.
                </p>
              </div>
            </div>
          </article>

          <article className={landingSectionStyles.billingDetailCard}>
            <p className={landingSectionStyles.billingEyebrow}>
              Base fiscal aplicada
            </p>
            <h2 className={landingSectionStyles.billingDetailTitle}>
              Precio con criterio real
            </h2>
            <p className={landingSectionStyles.billingMiniCopy}>
              Los importes finales usan la misma idea del SDK: costo neto base, markup operativo y
              carga impositiva incluida en precio final. Hoy el impuesto activo es IVA 21%, tomado
              desde la configuracion fiscal compartida del proyecto.
            </p>
            <p className={landingSectionStyles.billingMiniCopy}>
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
