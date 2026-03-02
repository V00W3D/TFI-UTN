import { useMemo } from 'react';

/* =========================================
   LIMITS & REGEX
========================================= */

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

const HAS_UPPER = /[A-Z]/;
const HAS_LOWER = /[a-z]/;
const HAS_NUMBER = /[0-9]/;
const HAS_SYMBOL = /[^A-Za-z0-9]/;

interface Props {
  password: string;
  mode?: 'register' | 'login';
}

const PasswordStrengthPlugin = ({ password, mode = 'register' }: Props) => {
  const isRegister = mode === 'register';

  const strength = useMemo(() => {
    if (!isRegister || !password) return 0;

    let score = 0;

    if (password.length >= PASSWORD_MIN) score++;
    if (HAS_UPPER.test(password)) score++;
    if (HAS_LOWER.test(password)) score++;
    if (HAS_NUMBER.test(password)) score++;
    if (HAS_SYMBOL.test(password)) score++;

    return score;
  }, [password, isRegister]);

  const strengthLabel = ['', 'muy débil', 'débil', 'decente', 'segura', 'muy segura'][strength];

  const strengthColor = [
    '',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-400',
    'bg-green-500',
    'bg-rgb-soft animate-rgb-soft',
  ][strength];

  const strengthWidth = `${(strength / 5) * 100}%`;

  if (!isRegister || !password) return null;

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="w-full h-2 bg-(--border) rounded overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthColor}`}
          style={{ width: strengthWidth }}
        />
      </div>

      {strength > 0 && (
        <span className="text-xs text-(--text-secondary)">
          Fuerza: <span className="font-semibold">{strengthLabel}</span>
        </span>
      )}

      <style>
        {`
          @keyframes rgbShift {
            0% { background-color: #22c55e; }
            33% { background-color: #3b82f6; }
            66% { background-color: #a855f7; }
            100% { background-color: #22c55e; }
          }
          .bg-rgb-soft {
            background-color: #22c55e;
          }
          .animate-rgb-soft {
            animation: rgbShift 3s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default PasswordStrengthPlugin;
