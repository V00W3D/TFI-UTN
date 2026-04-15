/**
 * @file App.tsx
 * @module Frontend
 * @description Raíz de la aplicación con bootstrap de estilos runtime y sesión inicial.
 */
import { useEffect } from 'react';
import AppRoutes from '@/AppRoutes';
import { sdk } from '@/shared/utils/sdk';
import { useAppStore } from '@/shared/store/appStore';
import FloatingActions from '@/modules/Landing/LandingView/FloatingActions';
import { ToastProvider } from '@/shared/ui/ToastProvider';
import { appStyles } from '@/styles/app';
import { applyTheme, ensureStyleResources } from '@/styles/theme';

const App = () => {
  const setUser = useAppStore((s) => s.setUser);
  const mode = useAppStore((s) => s.mode);

  useEffect(() => {
    ensureStyleResources();
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    sdk.iam
      .me()
      .then((res) => {
        if ('data' in res) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [setUser]);

  return (
    <div className={appStyles.shell}>
      <div className={appStyles.chrome} aria-hidden="true" />
      <div className={appStyles.grain} aria-hidden="true" />
      <div className={appStyles.viewport}>
        <AppRoutes />
        <FloatingActions />
        <ToastProvider />
      </div>
    </div>
  );
};

export default App;
