/**
 * @file main.tsx
 * @module Frontend
 * @description Archivo main alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: providers globales, rutas, estilos y variables publicas
 * outputs: bootstrap de la aplicacion y configuracion base de la interfaz
 * rules: centralizar montaje, entorno y navegacion
 *
 * @technical
 * dependencies: react, react-dom/client, react-router-dom, App, bootstrap styles
 * flow: carga configuracion y providers base; monta rutas y capas compartidas; inicia el frontend o expone su configuracion global.
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
 * decisions: la base del frontend se concentra en archivos raiz pequenos y coordinados
 */
/**
 * @file main.tsx
 * @author Victor
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/styles/index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
