import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';

import { sdk } from '../../../tools/sdk';

/**
 * @file Navbar.tsx
 * @description Sharp, architectural navigation with high-contrast geometry.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppStore();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 w-full z-50 glass-header"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LEFT: LOGO & BRAND */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 bg-qart-accent border-2 border-qart-border flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <div className="w-2 h-5 bg-qart-bg border border-qart-border" />
            </div>
            <span className="text-2xl font-display text-qart-primary tracking-tighter uppercase font-black">
              QART.
            </span>
          </div>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-10">
          {['Menú', 'Cómo Funciona', 'Locales'].map((item) => (
            <a
              key={item}
              href={`#${item
                .toLowerCase()
                .replace(/\s+/g, '-')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')}`}
              className="text-sm font-bold text-qart-primary/80 hover:text-qart-accent transition-all duration-200 relative group uppercase tracking-widest px-2"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-qart-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:block text-xs font-black uppercase tracking-widest text-qart-primary border-b-2 border-qart-accent px-1">
                {user.username}
              </span>
              <button
                onClick={async () => {
                  await sdk.iam.logout();
                  setUser(null);
                  navigate('/iam/login');
                }}
                className="btn-outline py-2 px-6 text-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/iam/login')}
                className="hidden sm:block text-xs font-black uppercase tracking-widest text-qart-primary hover:text-qart-accent transition-colors duration-300 cursor-pointer"
              >
                Ingresar
              </button>
              <button
                onClick={() => navigate('/iam/register')}
                className="btn-primary py-2 px-8 uppercase text-sm tracking-widest"
              >
                Crear Mi Plato
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
