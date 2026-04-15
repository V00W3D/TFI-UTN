/**
 * @file index.tsx
 * @module Navbar
 * @description Navegación pública reutilizable.
 */
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/shared/store/appStore';
import NavSearchBar from '@/modules/Landing/Navbar/NavSearchBar';
import { ProfileCard } from '@/shared/ui/ProfileCard';
import { QARTLogo } from '@/shared/ui/QARTLogo';
import { MenuGridIcon, CraftIcon, InvoiceIcon, SettingsIcon } from '@/shared/ui/AppIcons';
import {
  navActionButtonStyles,
  navAuthButtonStyles,
  navigationStyles,
} from '@/styles/modules/navigation';

const LANDING_SECTIONS = [
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Locales', href: '/#locales' },
  { label: 'Destacados', href: '/#destacados' },
  { label: 'Contacto', href: '/#contact' },
] as const;

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={navigationStyles.navbarShell}
    >
      <div className={navigationStyles.navbarInner}>
        <button
          type="button"
          className={navigationStyles.navbarBrandButton}
          onClick={() => navigate('/')}
        >
          <QARTLogo size="sm" />
        </button>

        <div className={navigationStyles.navbarSearchZone}>
          <NavSearchBar />
        </div>

        <div className={navigationStyles.navbarRight}>
          <div className={navigationStyles.navActionsGroup}>
            <Link to="/search" className={navActionButtonStyles()} title="Menú Completo">
              <MenuGridIcon width={18} height={18} className={navigationStyles.navActionIcon} />
            </Link>
            <Link to="/craft" className={navActionButtonStyles()} title="Craftear">
              <CraftIcon width={18} height={18} className={navigationStyles.navActionIcon} />
            </Link>
            <Link to="/facturacion" className={navActionButtonStyles()} title="Facturación">
              <InvoiceIcon width={18} height={18} className={navigationStyles.navActionIcon} />
            </Link>
            <Link to="/config" className={navActionButtonStyles()} title="Ajustes">
              {user && (!user.emailVerified || !user.phoneVerified) && (
                <span className={navigationStyles.navStatusBadge} title="Datos no verificados" />
              )}
              <SettingsIcon width={18} height={18} className={navigationStyles.navActionIcon} />
            </Link>
          </div>

          <nav className={navigationStyles.navbarLinks} aria-label="Secciones">
            {LANDING_SECTIONS.map(({ label, href }) => (
              <a key={href} href={href} className={navigationStyles.navbarLink}>
                <span>{label}</span>
                <span className={navigationStyles.navbarLinkUnderline} aria-hidden="true" />
              </a>
            ))}
          </nav>

          <div className={navigationStyles.navbarAuth}>
            {user ? (
              <ProfileCard variant="lite" />
            ) : (
              <div className={navigationStyles.navbarGuest}>
                <button
                  type="button"
                  onClick={() => navigate('/iam/login')}
                  className={navAuthButtonStyles({ tone: 'ghost' })}
                >
                  Ingresá
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/iam/register')}
                  className={navAuthButtonStyles({ tone: 'solid' })}
                >
                  Registrate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
