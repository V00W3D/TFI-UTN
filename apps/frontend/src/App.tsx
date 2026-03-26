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

const App = () => {
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    // Initial Session Hydration
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
    </>
  );
};

export default App;
