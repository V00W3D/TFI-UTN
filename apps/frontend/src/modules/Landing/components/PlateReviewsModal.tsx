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
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Portal from '../../../components/shared/Portal';
import { StarRatingDisplay } from '../../../components/shared/PlateDataIcons';
import { useAppStore } from '../../../appStore';
import { useOrderStore } from '../../../orderStore';
import { sdk } from '../../../tools/sdk';
import { formatLandingPrice, type LandingPlate } from './landingPlateNutrition';

interface PlateReviewsModalProps {
  plate: LandingPlate;
  onClose: () => void;
  onReviewsChanged?: () => void;
}

type Panel = 'list' | 'compose' | 'gate-auth' | 'gate-tried';

const PanelGateAuth = ({ onBack }: { onBack: () => void }) => (
  <div className="reviews-gate">
    <button type="button" className="reviews-gate-back" onClick={onBack}>
      ← Volver
    </button>
    <div className="reviews-gate-icon" aria-hidden>
      <span />
    </div>
    <h4 className="reviews-gate-title">Parece que no tenés una sesión abierta</h4>
    <p className="reviews-gate-lead">
      Para publicar una reseña de un plato necesitás cumplir lo siguiente:
    </p>
    <ul className="reviews-gate-list">
      <li>Haber probado el plato al menos una vez (pedilo y confirmá el pedido en tu orden).</li>
      <li>Tener una sesión iniciada en QART.</li>
    </ul>
    <div className="reviews-gate-actions">
      <Link
        to="/iam/login"
        className="btn-outline reviews-gate-btn uppercase tracking-widest text-xs"
      >
        Ingresar
      </Link>
      <Link
        to="/iam/register"
        className="btn-primary reviews-gate-btn uppercase tracking-widest text-xs"
      >
        Crear cuenta
      </Link>
    </div>
  </div>
);

const PanelGateTried = ({ onBack }: { onBack: () => void }) => (
  <div className="reviews-gate">
    <button type="button" className="reviews-gate-back" onClick={onBack}>
      ← Volver
    </button>
    <div className="reviews-gate-icon reviews-gate-icon--warm" aria-hidden>
      <span />
    </div>
    <h4 className="reviews-gate-title">Todavía no registramos que hayas pedido este plato</h4>
    <p className="reviews-gate-lead">
      Confirmá un pedido que lo incluya para poder dejar tu opinión. Así mantenemos reseñas con
      contexto real de la experiencia en el salón.
    </p>
    <div className="reviews-gate-actions">
      <button
        type="button"
        className="btn-primary reviews-gate-btn uppercase tracking-widest text-xs"
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
        className="featured-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="featured-modal featured-modal--reviews"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="featured-modal-header reviews-modal-header">
            <div className="featured-modal-identity">
              <p className="featured-kicker">Reseñas</p>
              <h3 className="featured-modal-title">{plate.name}</h3>
              <p className="featured-modal-description">
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
              className="reviews-modal-close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="reviews-modal-body">
            {panel === 'gate-auth' && <PanelGateAuth onBack={() => setPanel('list')} />}
            {panel === 'gate-tried' && <PanelGateTried onBack={() => setPanel('list')} />}

            {panel === 'compose' && (
              <div className="reviews-compose">
                <button
                  type="button"
                  className="reviews-gate-back"
                  onClick={() => setPanel('list')}
                >
                  ← Volver al listado
                </button>
                <p className="reviews-compose-hint">Tu voz suma al menú. Sé honesto y concreto.</p>
                <div className="reviews-compose-stars" role="group" aria-label="Puntaje de 1 a 5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`reviews-star-btn${n <= rating ? ' is-on' : ''}`}
                      onClick={() => setRating(n)}
                      aria-pressed={n <= rating}
                    >
                      ★
                    </button>
                  ))}
                  <span className="reviews-star-label">{rating} / 5</span>
                </div>
                <label className="reviews-compose-field">
                  <span>Comentario</span>
                  <textarea
                    className="reviews-compose-textarea"
                    rows={4}
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Qué te pareció el plato?"
                  />
                </label>
                <label className="reviews-compose-check">
                  <input
                    type="checkbox"
                    checked={recommends}
                    onChange={(e) => setRecommends(e.target.checked)}
                  />
                  <span>Lo recomendaría</span>
                </label>
                {formError && <p className="reviews-compose-error">{formError}</p>}
                <button
                  type="button"
                  className="btn-primary w-full justify-center uppercase tracking-widest text-xs"
                  disabled={submitting}
                  onClick={() => void submitReview()}
                >
                  {submitting ? 'Enviando…' : 'Publicar reseña'}
                </button>
              </div>
            )}

            {panel === 'list' && (
              <>
                <ul className="reviews-thread">
                  {plate.reviews.length === 0 ? (
                    <li className="reviews-thread-empty">
                      Todavía no hay reseñas. ¡Sé el primero en contar tu experiencia!
                    </li>
                  ) : (
                    plate.reviews.map((r) => (
                      <li key={r.id} className="reviews-thread-item">
                        <div className="reviews-thread-avatar-wrap">
                          {r.reviewer.avatarUrl ? (
                            <img
                              src={r.reviewer.avatarUrl}
                              alt=""
                              className="reviews-thread-avatar"
                            />
                          ) : (
                            <div className="reviews-thread-avatar reviews-thread-avatar--ph">
                              {r.reviewer.displayName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="reviews-thread-main">
                          <div className="reviews-thread-top">
                            <span className="reviews-thread-name">{r.reviewer.displayName}</span>
                            <StarRatingDisplay value={r.rating} size={12} showValue={false} />
                          </div>
                          <time className="reviews-thread-time" dateTime={r.createdAt}>
                            {new Date(r.createdAt).toLocaleString('es-AR', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </time>
                          {r.comment ? (
                            <p className="reviews-thread-text">{r.comment}</p>
                          ) : (
                            <p className="reviews-thread-text-comment">Sin comentario de texto.</p>
                          )}
                          {r.recommends != null && (
                            <span className="reviews-thread-rec">
                              {r.recommends ? 'Recomienda' : 'No recomienda'}
                            </span>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <div className="reviews-modal-footer">
                  <button
                    type="button"
                    className="btn-primary w-full justify-center uppercase tracking-widest text-xs"
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
