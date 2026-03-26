import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';

/**
 * @file Navbar.tsx
 * @description Symmetric navigation bar.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { mode, setMode } = useAppStore();
  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <motion.nav 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-50 bg-surface border-b border-border shadow-sm"
    >
      <div className="l-container py-3 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/QART_LOGO.png" alt="QART" className="size-8 object-contain" />
          <span className="font-serif text-xl tracking-[0.2em]">QART</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.25em] font-bold opacity-60">
          <a href="#menu" className="hover:text-primary transition-colors">Carta</a>
          <a href="#story" className="hover:text-primary transition-colors">Legado</a>
          <a href="#reserve" className="hover:text-primary transition-colors">Reserva</a>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleMode}
            className="size-9 flex items-center justify-center border border-border hover:bg-surface-alt transition-all"
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </button>

          <div className="flex gap-4">
            <button onClick={() => navigate('/iam/login')} className="text-[10px] uppercase tracking-widest font-bold opacity-70 hover:opacity-100">
              Ingresar
            </button>
            <button onClick={() => navigate('/iam/register')} className="btn btn-primary !py-2 !px-5 text-[10px]">
              Unirse
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
