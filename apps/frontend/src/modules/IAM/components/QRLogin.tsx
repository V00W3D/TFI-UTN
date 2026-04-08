/**
 * @file QRLogin.tsx
 * @module IAM
 * @description Archivo QRLogin alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-02
 * rnf: RNF-02
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: react
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
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
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
/**
 * @file QRLogin.tsx
 * @description Panel de login por QR — UI shell lista para conectar al backend.
 * Diseñado para montarse en el lado derecho del card de login (split 60/40).
 * @module QRLogin
 */

import { useState, useEffect, useCallback, memo } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

type QRStatus = 'loading' | 'ready' | 'expired' | 'error';

interface QRSession {
  sessionId: string;
  /** Datos codificados en el QR — URL de autenticación que abrirá la app móvil. */
  qrData: string;
  expiresAt: number;
}

export interface QRLoginProps {
  /**
   * Callback ejecutado cuando el backend confirma que el QR fue escaneado
   * y la sesión fue autorizada.
   */
  onSuccess?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

/** Tiempo de vida del QR en milisegundos (2 minutos). */
const QR_LIFETIME_MS = 120_000;

/**
 * Intervalo de polling para verificar si el QR fue escaneado (ms).
 *
 * TODO: Conectar al endpoint de polling cuando esté disponible.
 * Endpoint sugerido: GET /iam/qr-status?sessionId=...
 * Respuesta: { status: 'pending' | 'scanned' | 'authorized' }
 */
const POLL_INTERVAL_MS = 2_000;

// ─────────────────────────────────────────────────────────────────────────────
// HOOK DE SESIÓN QR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @internal
 * Maneja el ciclo de vida del QR: generación, countdown y estructura de polling.
 *
 * TODO — generateSession: reemplazar la simulación con:
 *   const response = await sdk.iam.qrGenerate();
 *   if (isFailureResponse(response)) throw new Error(response.error.code);
 *   return response.data; // { sessionId, qrData, expiresAt }
 *
 * TODO — polling: descomentar el bloque de useEffect de polling y conectar:
 *   const response = await sdk.iam.qrStatus({ sessionId });
 *   if (isSuccessResponse(response) && response.data.status === 'authorized') {
 *     setStatus('expired'); // reemplazar con estado 'scanned'
 *     onSuccess?.();
 *   }
 */
const useQRSession = (onSuccess?: () => void) => {
  const [status, setStatus] = useState<QRStatus>('loading');
  const [session, setSession] = useState<QRSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(QR_LIFETIME_MS);

  const generate = useCallback(async () => {
    setStatus('loading');
    setSession(null);
    setTimeLeft(QR_LIFETIME_MS);

    try {
      // ── TODO: reemplazar con llamada real al SDK ─────────────────────────
      await new Promise<void>((r) => setTimeout(r, 600));
      const mock: QRSession = {
        sessionId: crypto.randomUUID(),
        qrData: `https://qart.app/auth/qr?session=${crypto.randomUUID()}`,
        expiresAt: Date.now() + QR_LIFETIME_MS,
      };
      // ────────────────────────────────────────────────────────────────────
      setSession(mock);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  // Countdown
  useEffect(() => {
    if (status !== 'ready' || !session) return;
    const id = setInterval(() => {
      const remaining = session.expiresAt - Date.now();
      if (remaining <= 0) {
        clearInterval(id);
        setStatus('expired');
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 500);
    return () => clearInterval(id);
  }, [status, session]);

  // Polling — TODO: descomentar y conectar al endpoint real
  // useEffect(() => {
  //   if (status !== 'ready' || !session) return;
  //   const id = setInterval(async () => {
  //     try {
  //       const response = await sdk.iam.qrStatus({ sessionId: session.sessionId });
  //       if (isSuccessResponse(response) && response.data.status === 'authorized') {
  //         clearInterval(id);
  //         onSuccess?.();
  //       }
  //     } catch { /* ignorar errores transitorios */ }
  //   }, POLL_INTERVAL_MS);
  //   return () => clearInterval(id);
  // }, [status, session, onSuccess]);

  // Silenciar lint mientras el polling está comentado
  void POLL_INTERVAL_MS;
  void onSuccess;

  // Arrancar al montar
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!mounted) return;
      await generate();
    })();

    return () => {
      mounted = false;
    };
  }, [generate]);

  const secondsLeft = Math.ceil(timeLeft / 1000);
  const timeDisplay = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const progress = timeLeft / QR_LIFETIME_MS;

  return { status, session, progress, timeDisplay, generate };
};

// ─────────────────────────────────────────────────────────────────────────────
// QR VISUAL (placeholder deterministico)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @internal
 * QR visual generado deterministicamente desde los datos de la sesión.
 * TODO: reemplazar con <QRCodeSVG value={data} size={size} /> de `qrcode.react`
 */
const QRCodeVisual = memo(({ data, size = 160 }: { data: string; size?: number }) => {
  const CELLS = 21;
  const cell = size / CELLS;
  const hash = data.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0);

  const isCorner = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= CELLS - 8 && y < 8) || (x < 8 && y >= CELLS - 8);

  const cornerFilled = (x: number, y: number): boolean => {
    const cx = x < 8 ? x : x - (CELLS - 8);
    const cy = y < 8 ? y : y - (CELLS - 8);
    return (
      cx === 0 || cx === 7 || cy === 0 || cy === 7 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4)
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="white" rx="6" />
      {Array.from({ length: CELLS * CELLS }, (_, i) => {
        const x = i % CELLS;
        const y = Math.floor(i / CELLS);
        const filled = isCorner(x, y)
          ? cornerFilled(x, y)
          : ((hash * (i + 1) * 2654435761) >>> 0) % 3 !== 0;
        if (!filled) return null;
        return (
          <rect
            key={i}
            x={x * cell + 0.5}
            y={y * cell + 0.5}
            width={cell - 1}
            height={cell - 1}
            fill="hsl(340 15% 12%)"
            rx="1"
          />
        );
      })}
    </svg>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ANILLO DE COUNTDOWN
// ─────────────────────────────────────────────────────────────────────────────

const CountdownRing = memo(({ progress }: { progress: number }) => {
  const SIZE = 184;
  const SW = 2.5;
  const R = (SIZE - SW) / 2;
  const C = 2 * Math.PI * R;
  const dash = C * Math.max(0, progress);
  const color =
    progress > 0.5
      ? 'var(--color-primary)'
      : progress > 0.25
        ? 'var(--color-warning, hsl(38 80% 48%))'
        : 'var(--color-error)';

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ position: 'absolute', inset: -12, pointerEvents: 'none' }}
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        fill="none"
        stroke="var(--border)"
        strokeWidth={SW}
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={SW}
        strokeDasharray={`${dash} ${C}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        style={{ transition: 'stroke-dasharray 0.5s linear, stroke 0.4s ease' }}
      />
    </svg>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @public
 * @summary Panel de login por QR — columna derecha del card de login.
 * @remarks UI completa con countdown, estados y botón de regenerar.
 * La lógica de polling está preparada pero comentada — ver TODOs en `useQRSession`.
 */
export const QRLogin = memo(({ onSuccess }: QRLoginProps) => {
  const { status, session, progress, timeDisplay, generate } = useQRSession(onSuccess);

  return (
    <div className="qrl-panel">
      {/* Contenido */}
      <div className="qrl-content">
        {/* Encabezado */}
        <div className="qrl-header">
          <p className="qrl-title">Ingresar con QR</p>
          <p className="qrl-subtitle">Escaneá el código para iniciar sesión instantáneamente</p>
        </div>

        {/* Zona del código */}
        <div className="qrl-canvas">
          {/* Cargando */}
          {status === 'loading' && (
            <div className="qrl-placeholder">
              <div className="qrl-spinner" />
            </div>
          )}

          {/* Listo */}
          {status === 'ready' && session && (
            <div className="qrl-qr-wrap">
              <CountdownRing progress={progress} />
              <div className="qrl-qr-frame">
                <QRCodeVisual data={session.qrData} size={160} />
              </div>
              <span className="qrl-timer">{timeDisplay}</span>
            </div>
          )}

          {/* Expirado */}
          {status === 'expired' && (
            <div className="qrl-placeholder qrl-placeholder--expired">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-error)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="qrl-state-label">Código expirado</span>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="qrl-placeholder qrl-placeholder--error">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-error)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span className="qrl-state-label">No se pudo generar</span>
            </div>
          )}
        </div>

        {/* Botón regenerar */}
        {(status === 'expired' || status === 'error') && (
          <button type="button" className="qrl-refresh" onClick={generate}>
            Generar nuevo código
          </button>
        )}

        {/* Instrucción */}
        <ol className="qrl-steps">
          <li>Abrí la app de QART en tu celular</li>
          <li>Tocá el ícono de QR en el inicio</li>
          <li>Apuntá la cámara al código</li>
        </ol>
      </div>
    </div>
  );
});
