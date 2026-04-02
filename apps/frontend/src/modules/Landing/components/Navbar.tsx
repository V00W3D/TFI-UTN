import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { useOrderStore } from '../../../orderStore';
import { sdk } from '../../../tools/sdk';
import { ParchmentIcon } from './OrderPanel';
import OrderHistoryPanel from './OrderHistoryPanel';

/**
 * @file Navbar.tsx
 * @description Navegación principal: menú público, orden e ingreso IAM (login / registro).
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAppStore();
  const { toggleOpen, items } = useOrderStore();
  const [historyOpen, setHistoryOpen] = useState(false);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 w-full z-50 glass-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[4rem] py-2 sm:py-0 flex flex-wrap items-center justify-between gap-y-2 gap-x-2">
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

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/search"
            className={`text-[0.84rem] font-bold transition-all duration-200 relative group uppercase tracking-widest px-2 ${
              location.pathname === '/search'
                ? 'text-qart-accent'
                : 'text-qart-primary/80 hover:text-qart-accent'
            }`}
          >
            Menú
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-qart-accent transition-all duration-300 group-hover:w-full" />
          </Link>
          <a
            href="#como-funciona"
            className="text-[0.84rem] font-bold text-qart-primary/80 hover:text-qart-accent transition-all duration-200 relative group uppercase tracking-widest px-2"
          >
            Cómo funciona
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-qart-accent transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#locales"
            className="text-[0.84rem] font-bold text-qart-primary/80 hover:text-qart-accent transition-all duration-200 relative group uppercase tracking-widest px-2"
          >
            Delivery y local
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-qart-accent transition-all duration-300 group-hover:w-full" />
          </a>
          <button
            type="button"
            className="relative text-[0.84rem] font-bold text-qart-primary/80 hover:text-qart-accent transition-all duration-200 group uppercase tracking-widest px-2 cursor-pointer bg-transparent border-0"
            onClick={() => setHistoryOpen(true)}
          >
            Historial
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-qart-accent transition-all duration-300 group-hover:w-full" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 ml-auto">
          <button
            type="button"
            className="nav-historial-compact md:hidden"
            onClick={() => setHistoryOpen(true)}
            aria-label="Historial de pedidos"
          >
            Hist.
          </button>
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
              <span className="hidden sm:inline-flex items-center text-[0.68rem] font-black uppercase tracking-widest text-qart-primary border-2 border-qart-border bg-qart-surface px-2.5 py-1.5 max-w-[9rem] truncate">
                {user.username}
              </span>
              <button
                onClick={async () => {
                  await sdk.iam.logout();
                  setUser(null);
                  navigate('/iam/login');
                }}
                className="btn-outline py-2 px-4 sm:px-5 text-[0.72rem] sm:text-[0.82rem] uppercase tracking-widest"
              >
                Salir
              </button>
            </>
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
      <OrderHistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;
