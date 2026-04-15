export type QRStatus = 'loading' | 'ready' | 'expired' | 'error';

export interface QRSession {
  sessionId: string;
  qrData: string;
  expiresAt: number;
}

export interface QRLoginProps {
  onSuccess?: () => void;
}
