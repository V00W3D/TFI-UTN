import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';

import { sdk } from '../../../tools/sdk';

/**
 * @file Navbar.tsx
 * @description The bright, tactile fast-casual navigation with bouncy interactions.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppStore(); // Assuming the user toggles manually or we just use bright mode

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="fixed top-0 left-0 w-full z-50 glass-header"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          {/* Fictional Burger Logo - A simple appetizing icon */}
          <div className="w-10 h-10 bg-qart-accent text-white rounded-xl flex items-center justify-center font-display text-2xl shadow-sm transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            🍔
          </div>
          <span className="font-display text-2xl tracking-tighter text-qart-primary">
            QART<span className="text-qart-accent">Burger</span>
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {['Menú', 'Cómo Funciona', 'Locales'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-bold text-qart-text-muted hover:text-qart-accent transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-qart-accent rounded-full transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:block text-sm font-bold text-qart-primary">
                Hola, {user.username}
              </span>
              <button
                onClick={async () => {
                  await sdk.iam.logout();
                  setUser(null);
                  navigate('/iam/login');
                }}
                className="btn-outline py-2 px-6"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/iam/login')}
                className="hidden sm:block text-sm font-bold text-qart-primary hover:text-qart-accent transition-colors duration-300 cursor-pointer"
              >
                Ingresar
              </button>
              <button onClick={() => navigate('/iam/register')} className="btn-primary py-2 px-6">
                Crear Burger
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
