import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { useOrderStore } from '../../../orderStore';
import { sdk } from '../../../tools/sdk';
import { ParchmentIcon } from './OrderPanel';

/**
 * @file Navbar.tsx
 * @description Sharp, architectural navigation with high-contrast geometry.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppStore();
  const { toggleOpen, items } = useOrderStore();
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 w-full z-50 glass-header"
    >
      <div className="max-w-7xl mx-auto px-6 h-[4rem] flex items-center justify-between">
        {/* LEFT: LOGO & BRAND */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-7 h-7 bg-qart-accent border-2 border-qart-border flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <div className="w-1.5 h-[0.95rem] bg-qart-bg border border-qart-border" />
            </div>
            <span className="text-lg font-display text-qart-primary tracking-tighter uppercase font-black">
              QART.
            </span>
          </div>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6">
          {['Menú', 'Cómo Funciona', 'Locales'].map((item) => (
            <a
              key={item}
              href={`#${item
                .toLowerCase()
                .replace(/\s+/g, '-')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')}`}
              className="text-[0.84rem] font-bold text-qart-primary/80 hover:text-qart-accent transition-all duration-200 relative group uppercase tracking-widest px-2"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-qart-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2.5">
          {/* ORDEN button */}
          <button
            type="button"
            className="nav-orden-btn"
            onClick={toggleOpen}
            aria-label="Ver orden"
          >
            <span className="nav-orden-icon-wrap">
              <ParchmentIcon className="nav-orden-icon" />
              {totalItems > 0 && (
                <span className="nav-orden-badge">{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </span>
            <span className="nav-orden-label">Orden</span>
          </button>

          {user ? (
            <>
              <span className="hidden sm:block text-[0.68rem] font-black uppercase tracking-widest text-qart-primary border-b-2 border-qart-accent px-1">
                {user.username}
              </span>
              <button
                onClick={async () => {
                  await sdk.iam.logout();
                  setUser(null);
                  navigate('/iam/login');
                }}
                className="btn-outline py-2 px-5 text-[0.82rem]"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/iam/login')}
                className="hidden sm:block text-[0.68rem] font-black uppercase tracking-widest text-qart-primary hover:text-qart-accent transition-colors duration-300 cursor-pointer"
              >
                Ingresar
              </button>
              <button
                onClick={() => navigate('/iam/register')}
                className="btn-primary py-2 px-6 uppercase text-[0.82rem] tracking-widest"
              >
                Crear cuenta
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
