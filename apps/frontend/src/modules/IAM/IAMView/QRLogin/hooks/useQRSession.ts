import { useState, useEffect, useCallback } from 'react';
import type { QRSession, QRStatus } from '@/modules/IAM/IAMView/QRLogin/types';

const QR_LIFETIME_MS = 120_000;

export const useQRSession = (_onSuccess?: () => void) => {
  const [status, setStatus] = useState<QRStatus>('loading');
  const [session, setSession] = useState<QRSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(QR_LIFETIME_MS);

  const generate = useCallback(async () => {
    setStatus('loading');
    setSession(null);
    setTimeLeft(QR_LIFETIME_MS);

    try {
      await new Promise<void>((r) => setTimeout(r, 600));
      const mock: QRSession = {
        sessionId: crypto.randomUUID(),
        qrData: `https://qart.app/auth/qr?session=${crypto.randomUUID()}`,
        expiresAt: Date.now() + QR_LIFETIME_MS,
      };
      setSession(mock);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

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
