/**
 * @file App.tsx
 * @module Frontend
 * @description Archivo App alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
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
import FloatingActions from './modules/Landing/components/FloatingActions';
import { ToastProvider } from './components/shared/ToastProvider';

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
      <FloatingActions />
      <ToastProvider />
    </>
  );
};

export default App;
