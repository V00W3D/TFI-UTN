/**
 * @file index.tsx
 * @module IAM
 * @description Panel de login por QR unificado y modularizado.
 */
import { memo } from 'react';
import { CountdownRing } from '@/modules/IAM/IAMView/QRLogin/components/CountdownRing';
import { QRCodeVisual } from '@/modules/IAM/IAMView/QRLogin/components/QRCodeVisual';
import { useQRSession } from '@/modules/IAM/IAMView/QRLogin/hooks/useQRSession';
import type { QRLoginProps } from '@/modules/IAM/IAMView/QRLogin/types';
import { iamStyles } from '@/styles/modules/iam';
import { cn } from '@/styles/utils/cn';

export const QRLogin = memo(({ onSuccess }: QRLoginProps) => {
  const { status, session, progress, timeDisplay, generate } = useQRSession(onSuccess);

  return (
    <div className={iamStyles.qrPanel}>
      <div className={iamStyles.qrContent}>
        <div className={iamStyles.qrHeader}>
          <p className={iamStyles.qrTitle}>Ingresar con QR</p>
          <p className={iamStyles.qrSubtitle}>
            Escaneá el código para iniciar sesión instantáneamente
          </p>
        </div>

        <div className={iamStyles.qrCanvas}>
          {status === 'loading' && (
            <div className={iamStyles.qrPlaceholder}>
              <div className={iamStyles.qrSpinner} />
            </div>
          )}

          {status === 'ready' && session && (
            <div className={iamStyles.qrWrap}>
              <CountdownRing progress={progress} />
              <div className={iamStyles.qrFrame}>
                <QRCodeVisual data={session.qrData} size={160} />
              </div>
              <span className={iamStyles.qrTimer}>{timeDisplay}</span>
            </div>
          )}

          {status === 'expired' && (
            <div className={cn(iamStyles.qrPlaceholder, iamStyles.qrPlaceholderExpired)}>
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
              <span className={iamStyles.qrStateLabel}>Código expirado</span>
            </div>
          )}

          {status === 'error' && (
            <div className={cn(iamStyles.qrPlaceholder, iamStyles.qrPlaceholderError)}>
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
              <span className={iamStyles.qrStateLabel}>No se pudo generar</span>
            </div>
          )}
        </div>

        {(status === 'expired' || status === 'error') && (
          <button type="button" className={iamStyles.qrRefresh} onClick={generate}>
            Generar nuevo código
          </button>
        )}

        <ol className={iamStyles.qrSteps}>
          <li>Abrí la app de QART en tu celular</li>
          <li>Tocá el ícono de QR en el inicio</li>
          <li>Apuntá la cámara al código</li>
        </ol>
      </div>
    </div>
  );
});
