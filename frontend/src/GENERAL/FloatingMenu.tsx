import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ToggleModeButton from './ToggleModeButton';

const FloatingMenu = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 80; // px desde el borde derecho

      if (window.innerWidth - e.clientX < threshold) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  return createPortal(
    <div
      className={`
        fixed top-1/2 right-4 -translate-y-1/2
        flex flex-col gap-4 p-3 rounded-2xl
        bg-white/10 dark:bg-black/40
        backdrop-blur-xl border border-white/20
        shadow-xl
        transition-all duration-500
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}
      `}
    >
      <ToggleModeButton />
    </div>,
    portalRoot,
  );
};

export default FloatingMenu;
