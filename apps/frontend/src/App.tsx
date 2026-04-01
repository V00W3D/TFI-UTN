/**
 * @file App.tsx
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 */
import { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { sdk } from './tools/sdk';
import { useAppStore } from './appStore';
import ThemeToggle from './modules/ThemeToggle';

const App = () => {
  const setUser = useAppStore((s) => s.setUser);
  const mode = useAppStore((s) => s.mode);

  useEffect(() => {
    // Dynamic theme loading
    let link = document.getElementById('qart-theme') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = 'qart-theme';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `/themes/${mode}.css`;
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
    <>
      <AppRoutes />
      <ThemeToggle />
    </>
  );
};

export default App;
