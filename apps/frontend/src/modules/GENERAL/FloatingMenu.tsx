import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ToggleModeButton from './ToggleModeButton';
import './floating-menu.css';

const FloatingMenu = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 80;

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
    <div className={`floating-menu ${visible ? 'floating-menu-visible' : 'floating-menu-hidden'}`}>
      <ToggleModeButton />
    </div>,
    portalRoot,
  );
};

export default FloatingMenu;
