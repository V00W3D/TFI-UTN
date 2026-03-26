import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';

/**
 * @file Navbar.tsx
 * @description Luxury navigation bar with glassmorphism and mode toggle.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { mode, setMode } = useAppStore();

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-bg/10 backdrop-blur-xl border-b border-white/5"
    >
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
        <img src="/QART_LOGO.png" alt="QART Logo" className="size-10 object-contain" />
        <span className="font-serif text-2xl tracking-widest text-accent">QART</span>
      </div>

      <div className="hidden md:flex items-center gap-12 text-sm uppercase tracking-[0.2em] font-medium opacity-80">
        <a href="#menu" className="hover:text-accent transition-colors">
          Carta
        </a>
        <a href="#story" className="hover:text-accent transition-colors">
          Legado
        </a>
        <a href="#reserve" className="hover:text-accent transition-colors">
          Reserva
        </a>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleMode}
          className="p-2 rounded-full border border-white/10 hover:border-accent/40 transition-all group"
          aria-label="Toggle Dark Mode"
        >
          {mode === 'light' ? (
            <span className="text-xl group-hover:scale-110 block transition-transform">🌙</span>
          ) : (
            <span className="text-xl group-hover:scale-110 block transition-transform">☀️</span>
          )}
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/iam/login')}
            className="text-xs uppercase tracking-widest border-b border-transparent hover:border-accent pb-1 transition-all"
          >
            Ingresar
          </button>
          <button
            onClick={() => navigate('/iam/register')}
            className="bg-accent text-inverse px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-primary transition-all shadow-lg"
          >
            Unirse
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
