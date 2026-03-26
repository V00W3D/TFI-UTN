import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';

/**
 * @file Navbar.tsx
 * @description Sovereign V4 Symmetric Navbar.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { mode, setMode } = useAppStore();
  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-100 bg-surface border-b border-border"
    >
      <div className="container-sharp flex justify-between items-center h-[var(--p-16)]">
        <div className="flex items-center gap-[var(--p-2)] cursor-pointer" onClick={() => navigate('/')}>
          <img src="/QART_LOGO.png" alt="QART" className="h-[var(--p-8)] w-auto object-contain" />
          <span className="font-serif text-[var(--f-xl)] tracking-[0.15em] font-medium">QART</span>
        </div>

        <div className="hidden lg:flex items-center gap-[var(--p-8)] h-full">
          {['Carta', 'Legado', 'Reserva'].map((item) => (
             <a 
               key={item} 
               href={`#${item.toLowerCase()}`} 
               className="text-[var(--f-xs)] uppercase tracking-[0.3em] font-bold opacity-60 hover:opacity-100 hover:text-accent transition-all h-full flex items-center border-b-2 border-transparent hover:border-accent"
             >
               {item}
             </a>
          ))}
        </div>

        <div className="flex items-center gap-[var(--p-4)]">
          <button 
            onClick={toggleMode}
            className="size-[var(--p-10)] flex items-center justify-center border border-border hover:bg-surface-soft transition-colors"
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </button>

          <div className="flex items-center gap-[var(--p-4)]">
            <button 
              onClick={() => navigate('/iam/login')} 
              className="text-[var(--f-xs)] uppercase tracking-[0.2em] font-extrabold opacity-60 hover:opacity-100"
            >
              Log in
            </button>
            <button onClick={() => navigate('/iam/register')} className="btn-v4 px-[var(--p-6)]">
              Join
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
