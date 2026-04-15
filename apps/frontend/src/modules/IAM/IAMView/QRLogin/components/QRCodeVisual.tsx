import { memo } from 'react';

export const QRCodeVisual = memo(({ data, size = 160 }: { data: string; size?: number }) => {
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
