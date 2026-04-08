/**
 * @file Navbar.tsx
 * @module Landing
 * @description Archivo Navbar alineado a la arquitectura y trazabilidad QART.
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
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import NavSearchBar from './NavSearchBar';
import NavProfile from './NavProfile';

/**
 * @file Navbar.tsx
 * @description Navegación pública reutilizable — Landing + /search.
 * Los links de anclaje usan `/#id` para funcionar desde cualquier ruta.
 */

/* ── Secciones del landing side (siempre visibles, llevan a /#id) ── */
const LANDING_SECTIONS = [
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Locales', href: '/#locales' },
  { label: 'Destacados', href: '/#destacados' },
  { label: 'Contacto', href: '/#contact' },
] as const;

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 w-full z-50 glass-header"
      >
        <div className="navbar-inner">
          {/* ── Logo ── */}
          <div
            className="navbar-logo group"
            onClick={() => navigate('/')}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            aria-label="Ir al inicio"
          >
            <div className="navbar-logo__mark">
              <div className="navbar-logo__bar" />
            </div>
            <span className="navbar-logo__text">
              QART<span className="text-qart-accent">.</span>
            </span>
          </div>

          {/* ── Search bar (centro) ── */}
          <div className="navbar-search-zone">
            <NavSearchBar />
          </div>

          {/* ── Nav links + auth (derecha) ── */}
          <div className="navbar-right">
            {/* ── App Actions (Iconos Invitativos) ── */}
            <div className="flex items-center gap-2 mr-2">
              <Link to="/search" className="nav-action-btn" title="Menú Completo">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </Link>
              <Link to="/craft" className="nav-action-btn" title="Craftear">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </Link>
              <Link to="/config" className="nav-action-btn relative" title="Ajustes">
                {user && (!user.emailVerified || !user.phoneVerified) && (
                  <span
                    className="absolute top-1 right-1 w-2.5 h-2.5 bg-qart-error rounded-full border border-qart-surface shadow-sharp"
                    title="Datos no verificados"
                  ></span>
                )}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </Link>
            </div>

            {/* Section anchors */}
            <nav className="navbar-links" aria-label="Secciones">
              {LANDING_SECTIONS.map(({ label, href }) => (
                <a key={href} href={href} className="navbar-link">
                  {label}
                </a>
              ))}
            </nav>

            {/* Auth area / Profile */}
            <div className="navbar-auth">
              {user ? (
                <NavProfile />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/iam/login')}
                    className="nav-auth-btn nav-auth-btn--ghost"
                  >
                    Ingresá
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/iam/register')}
                    className="nav-auth-btn nav-auth-btn--solid"
                  >
                    Registrate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
