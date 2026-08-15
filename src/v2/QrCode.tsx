import { useMemo } from "react";
import QRCode from "qrcode";

/* Branded QR: lime modules on the violet-dark ground, rounded finder eyes,
   and a punched-out centre carrying the K mark. Error correction H keeps it
   scannable with ~30% of the code obscured, which the logo hole uses. */

type Props = {
  value: string;
  size?: number;
  /** fraction of the code width reserved for the logo hole */
  logoRatio?: number;
  className?: string;
  title?: string;
};

const QrCode = ({ value, size = 220, logoRatio = 0.26, className, title }: Props) => {
  const { cells, count } = useMemo(() => {
    const qr = QRCode.create(value, { errorCorrectionLevel: "H" });
    const n = qr.modules.size;
    const data = qr.modules.data;
    return { cells: data, count: n };
  }, [value]);

  const pad = 2; // quiet zone in modules
  const total = count + pad * 2;
  const unit = size / total;

  /* finder patterns (7x7) sit at three corners — drawn as rounded frames */
  const finders = [
    [0, 0],
    [count - 7, 0],
    [0, count - 7],
  ];
  const inFinder = (x: number, y: number) =>
    finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);

  /* logo hole in the middle */
  const holeMods = Math.round(count * logoRatio);
  const holeStart = Math.floor((count - holeMods) / 2);
  const inHole = (x: number, y: number) =>
    x >= holeStart &&
    x < holeStart + holeMods &&
    y >= holeStart &&
    y < holeStart + holeMods;

  const dots: JSX.Element[] = [];
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (!cells[y * count + x]) continue;
      if (inFinder(x, y) || inHole(x, y)) continue;
      dots.push(
        <rect
          key={`${x}-${y}`}
          x={(x + pad) * unit}
          y={(y + pad) * unit}
          width={unit}
          height={unit}
          rx={unit * 0.32}
        />
      );
    }
  }

  const finderEl = ([fx, fy]: number[], i: number) => {
    const X = (fx + pad) * unit;
    const Y = (fy + pad) * unit;
    const S = 7 * unit;
    return (
      <g key={`f${i}`}>
        <rect
          x={X + unit * 0.4}
          y={Y + unit * 0.4}
          width={S - unit * 0.8}
          height={S - unit * 0.8}
          rx={unit * 1.9}
          fill="none"
          stroke="currentColor"
          strokeWidth={unit * 1.05}
        />
        <rect
          x={X + unit * 2.25}
          y={Y + unit * 2.25}
          width={S - unit * 4.5}
          height={S - unit * 4.5}
          rx={unit * 0.95}
          fill="currentColor"
        />
      </g>
    );
  };

  const holePx = holeMods * unit;
  const holeXY = (holeStart + pad) * unit;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={title || `QR code for ${value}`}
      shapeRendering="geometricPrecision"
    >
      <g fill="currentColor">{dots}</g>
      {finders.map(finderEl)}
      {/* K mark in the punched centre */}
      <g transform={`translate(${holeXY} ${holeXY})`}>
        <rect
          width={holePx}
          height={holePx}
          rx={holePx * 0.22}
          fill="currentColor"
        />
        <g
          transform={`translate(${holePx * 0.2} ${holePx * 0.2}) scale(${
            (holePx * 0.6) / 100
          })`}
          fill="var(--qr-bg, #050b17)"
        >
          {/* simplified Kosh K: bracket frame + K stroke */}
          <path d="M0 0 h26 v100 h-26 z" />
          <path d="M52 0 h48 v26 h-48 z" />
          <path d="M74 74 h26 v26 h-26 z" />
          <path d="M26 44 l34 -30 h34 l-38 36 40 50 h-36 l-34 -44 z" />
        </g>
      </g>
    </svg>
  );
};

export default QrCode;
