/**
 * @file PlateReviewsModal.tsx
 * @module Landing
 * @description Archivo PlateReviewsModal alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: framer-motion, react, react-router-dom, Portal, PlateDataIcons, appStore, orderStore, sdk, landingPlateNutrition
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
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/shared/store/appStore';
import { useOrderStore } from '@/shared/store/orderStore';
import { StarRatingDisplay } from '@/shared/ui/PlateDataIcons';
import Portal from '@/shared/ui/Portal';
import { formatLandingPrice, type LandingPlate } from '@/shared/utils/plateNutrition';
import { sdk } from '@/shared/utils/sdk';
import { buttonStyles } from '@/styles/components/button';
import {
  plateCardStyles,
  plateModalPanelStyles,
  reviewStarButtonStyles,
} from '@/styles/modules/plateCard';
import { cn } from '@/styles/utils/cn';

interface PlateReviewsModalProps {
  plate: LandingPlate;
  onClose: () => void;
  onReviewsChanged?: () => void;
}

type Panel = 'list' | 'compose' | 'gate-auth' | 'gate-tried';

const PanelGateAuth = ({ onBack }: { onBack: () => void }) => (
  <div className={plateCardStyles.reviewsGate}>
    <button type="button" className={plateCardStyles.reviewsBack} onClick={onBack}>
      ← Volver
    </button>
    <div className={plateCardStyles.reviewsGateIcon} aria-hidden>
      <span className={plateCardStyles.reviewsGateIconDot} />
    </div>
    <h4 className={plateCardStyles.reviewsGateTitle}>Parece que no tenés una sesión abierta</h4>
    <p className={plateCardStyles.reviewsGateLead}>
      Para publicar una reseña de un plato necesitás cumplir lo siguiente:
    </p>
    <ul className={plateCardStyles.reviewsGateList}>
      <li>Haber probado el plato al menos una vez (pedilo y confirmá el pedido en tu orden).</li>
      <li>Tener una sesión iniciada en QART.</li>
    </ul>
    <div className={plateCardStyles.reviewsGateActions}>
      <Link to="/iam/login" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
        Ingresar
      </Link>
      <Link to="/iam/register" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
        Crear cuenta
      </Link>
    </div>
  </div>
);

const PanelGateTried = ({ onBack }: { onBack: () => void }) => (
  <div className={plateCardStyles.reviewsGate}>
    <button type="button" className={plateCardStyles.reviewsBack} onClick={onBack}>
      ← Volver
    </button>
    <div className={plateCardStyles.reviewsGateIconWarm} aria-hidden>
      <span className={plateCardStyles.reviewsGateIconDot} />
    </div>
    <h4 className={plateCardStyles.reviewsGateTitle}>
      Todavía no registramos que hayas pedido este plato
    </h4>
    <p className={plateCardStyles.reviewsGateLead}>
      Confirmá un pedido que lo incluya para poder dejar tu opinión. Así mantenemos reseñas con
      contexto real de la experiencia en el salón.
    </p>
    <div className={plateCardStyles.reviewsGateActions}>
      <button
        type="button"
        className={buttonStyles({ variant: 'primary', size: 'sm' })}
        onClick={onBack}
      >
        Entendido
      </button>
    </div>
  </div>
);

const PlateReviewsModal = ({ plate, onClose, onReviewsChanged }: PlateReviewsModalProps) => {
  const user = useAppStore((s) => s.user);
  const hasTriedPlate = useOrderStore((s) => s.hasTriedPlate);
  const [panel, setPanel] = useState<Panel>('list');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [recommends, setRecommends] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const startCompose = () => {
    setFormError(null);
    if (!user) {
      setPanel('gate-auth');
      return;
    }
    if (!hasTriedPlate(plate.id)) {
      setPanel('gate-tried');
      return;
    }
    setPanel('compose');
  };

  const submitReview = async () => {
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await sdk.customers.reviews({
        plateId: plate.id,
        rating,
        comment: comment.trim() || undefined,
        recommends,
      });
      if ('data' in res) {
        onReviewsChanged?.();
        setPanel('list');
        setComment('');
        setRating(5);
        setRecommends(true);
      } else {
        setFormError('No pudimos guardar tu reseña. Revisá tu sesión o probá de nuevo.');
      }
    } catch {
      setFormError(
        'Error de red o sesión. Si no estás logueado, iniciá sesión e intentá otra vez.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Portal>
      <motion.div
        className={plateCardStyles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={plateModalPanelStyles({ kind: 'reviews' })}
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={cn(plateCardStyles.modalHeader, plateCardStyles.reviewsHeader)}>
            <div className={plateCardStyles.modalIdentity}>
              <p className={plateCardStyles.modalKicker}>Reseñas</p>
              <h3 className={plateCardStyles.modalTitle}>{plate.name}</h3>
              <p className={plateCardStyles.modalDescription}>
                {formatLandingPrice(plate.menuPrice)} ·{' '}
                <StarRatingDisplay
                  value={plate.avgRating}
                  size={13}
                  reviewCount={plate.ratingsCount}
                />
              </p>
            </div>
            <button
              type="button"
              className={plateCardStyles.reviewsClose}
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className={plateCardStyles.reviewsBody}>
            {panel === 'gate-auth' && <PanelGateAuth onBack={() => setPanel('list')} />}
            {panel === 'gate-tried' && <PanelGateTried onBack={() => setPanel('list')} />}

            {panel === 'compose' && (
              <div className={plateCardStyles.reviewsCompose}>
                <button
                  type="button"
                  className={plateCardStyles.reviewsBack}
                  onClick={() => setPanel('list')}
                >
                  ← Volver al listado
                </button>
                <p className={plateCardStyles.reviewsComposeHint}>
                  Tu voz suma al menú. Sé honesto y concreto.
                </p>
                <div
                  className={plateCardStyles.reviewsComposeStars}
                  role="group"
                  aria-label="Puntaje de 1 a 5"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={reviewStarButtonStyles({ active: n <= rating })}
                      onClick={() => setRating(n)}
                      aria-pressed={n <= rating}
                    >
                      ★
                    </button>
                  ))}
                  <span className={plateCardStyles.reviewsStarLabel}>{rating} / 5</span>
                </div>
                <label className={plateCardStyles.reviewsComposeField}>
                  <span className={plateCardStyles.reviewsComposeFieldLabel}>Comentario</span>
                  <textarea
                    className={plateCardStyles.reviewsComposeTextarea}
                    rows={4}
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Qué te pareció el plato?"
                  />
                </label>
                <label className={plateCardStyles.reviewsComposeCheck}>
                  <input
                    type="checkbox"
                    checked={recommends}
                    onChange={(e) => setRecommends(e.target.checked)}
                  />
                  <span>Lo recomendaría</span>
                </label>
                {formError && <p className={plateCardStyles.reviewsComposeError}>{formError}</p>}
                <button
                  type="button"
                  className={cn(
                    buttonStyles({ variant: 'primary', size: 'sm' }),
                    'w-full justify-center',
                  )}
                  disabled={submitting}
                  onClick={() => void submitReview()}
                >
                  {submitting ? 'Enviando…' : 'Publicar reseña'}
                </button>
              </div>
            )}

            {panel === 'list' && (
              <>
                <ul className={plateCardStyles.reviewsThread}>
                  {plate.reviews.length === 0 ? (
                    <li className={plateCardStyles.reviewsThreadEmpty}>
                      Todavía no hay reseñas. ¡Sé el primero en contar tu experiencia!
                    </li>
                  ) : (
                    plate.reviews.map((r) => (
                      <li key={r.id} className={plateCardStyles.reviewsThreadItem}>
                        <div className={plateCardStyles.reviewsAvatarWrap}>
                          {r.reviewer.avatarUrl ? (
                            <img
                              src={r.reviewer.avatarUrl}
                              alt=""
                              className={plateCardStyles.reviewsAvatar}
                            />
                          ) : (
                            <div className={plateCardStyles.reviewsAvatarPlaceholder}>
                              {r.reviewer.displayName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className={plateCardStyles.reviewsMain}>
                          <div className={plateCardStyles.reviewsTop}>
                            <span className={plateCardStyles.reviewsName}>
                              {r.reviewer.displayName}
                            </span>
                            <StarRatingDisplay value={r.rating} size={12} showValue={false} />
                          </div>
                          <time className={plateCardStyles.reviewsTime} dateTime={r.createdAt}>
                            {new Date(r.createdAt).toLocaleString('es-AR', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </time>
                          {r.comment ? (
                            <p className={plateCardStyles.reviewsText}>{r.comment}</p>
                          ) : (
                            <p className={plateCardStyles.reviewsEmptyComment}>
                              Sin comentario de texto.
                            </p>
                          )}
                          {r.recommends != null && (
                            <span className={plateCardStyles.reviewsRec}>
                              {r.recommends ? 'Recomienda' : 'No recomienda'}
                            </span>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <div className={plateCardStyles.reviewsFooter}>
                  <button
                    type="button"
                    className={cn(
                      buttonStyles({ variant: 'primary', size: 'sm' }),
                      'w-full justify-center',
                    )}
                    onClick={startCompose}
                  >
                    Publicar mi reseña
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default PlateReviewsModal;
