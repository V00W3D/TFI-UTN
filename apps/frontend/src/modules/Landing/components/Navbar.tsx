import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';

/**
 * @file Navbar.tsx
 * @description The ultimate, optically balanced glass navbar for QART.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { mode, setMode } = useAppStore();

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 glass-header"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <img 
            src="/QART_LOGO.png" 
            alt="QART Logo" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
          />
          <span className="font-serif text-2xl tracking-[0.15em] text-qart-primary font-medium">
            QART
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-10">
          {['Carta', 'Legado', 'Reserva'].map((item) => (
             <a 
               key={item} 
               href={`#${item.toLowerCase()}`} 
               className="text-xs uppercase tracking-[0.2em] font-bold text-qart-text-muted hover:text-qart-primary transition-colors duration-300"
             >
               {item}
             </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={toggleMode}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-qart-surface border border-qart-border text-qart-text hover:border-qart-accent hover:text-qart-accent transition-all duration-300 shadow-sm"
            aria-label="Toggle Mode"
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </button>

          <div className="hidden sm:flex items-center gap-4">
            <button 
              onClick={() => navigate('/iam/login')}
              className="text-xs uppercase tracking-[0.2em] font-bold text-qart-text-muted hover:text-qart-primary transition-colors duration-300"
            >
              Ingresar
            </button>
            <button 
              onClick={() => navigate('/iam/register')}
              className="btn-gold"
            >
              Unete
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
