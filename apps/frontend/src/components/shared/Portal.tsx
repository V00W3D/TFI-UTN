import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * @file Portal.tsx
 * @description A simple wrapper to render children into the #portal-root element.
 */
interface PortalProps {
  children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const portalRoot = document.getElementById('portal-root');

  if (!portalRoot) {
    return <>{children}</>;
  }

  return createPortal(children, portalRoot);
};

export default Portal;
