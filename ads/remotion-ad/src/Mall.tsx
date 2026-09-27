import React from 'react';

// Navy-and-white mall walkway. No green anywhere.
const SHOP_BLOBS = ['#ff8a2a', '#3f7bff', '#e24a5a', '#9b6bff', '#ffffff', '#ffb347', '#6fb6ff'];

export const Mall: React.FC<{t: number}> = ({t}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="ceil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#081647" />
        <stop offset="1" stopColor="#13307f" />
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dfe6f3" />
        <stop offset="1" stopColor="#f6f8fc" />
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7e5ff" />
        <stop offset="1" stopColor="#aec7f2" />
      </linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="7" /></filter>
      <filter id="soft"><feGaussianBlur stdDeviation="30" /></filter>
    </defs>

    {/* ceiling */}
    <rect width={1080} height={560} fill="url(#ceil)" />
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3, 4].map((i) => (
        <ellipse key={`${row}-${i}`} cx={108 + i * 216} cy={120 + row * 150} rx={70 - row * 10} ry={14 - row * 2} fill="#ffffff" opacity={0.9} />
      ))
    )}

    {/* back wall + storefronts (blurred for depth) */}
    <g filter="url(#blur)">
      <rect y={560} width={1080} height={600} fill="#f2f5fb" />
      <rect y={580} width={1080} height={70} fill="#0b1d5c" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={40 + i * 262} y={596} width={200} height={38} rx={8} fill="#ffffff" opacity={0.85} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={30 + i * 262} y={680} width={230} height={440} fill="url(#glass)" stroke="#0b1d5c" strokeWidth={8} />
          {[0, 1, 2, 3, 4, 5].map((j) => (
            <rect
              key={j}
              x={50 + i * 262 + (j % 3) * 70}
              y={720 + Math.floor(j / 3) * 170}
              width={50}
              height={110}
              rx={10}
              fill={SHOP_BLOBS[(i * 3 + j) % SHOP_BLOBS.length]}
              opacity={0.75}
            />
          ))}
        </g>
      ))}
    </g>

    {/* floor */}
    <rect y={1140} width={1080} height={780} fill="url(#floor)" />
    {[-6, -4, -2, 0, 2, 4, 6].map((k) => (
      <line key={k} x1={540 + k * 60} y1={1140} x2={540 + k * 420} y2={1920} stroke="#c7d2e6" strokeWidth={3} />
    ))}
    {[1210, 1320, 1480, 1700].map((y) => (
      <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke="#c7d2e6" strokeWidth={3} />
    ))}
    <ellipse cx={540} cy={1260} rx={420} ry={60} fill="#ffffff" opacity={0.6} filter="url(#soft)" />

    {/* foreground pillars */}
    {[-30, 960].map((x) => (
      <g key={x}>
        <rect x={x} y={0} width={150} height={1920} fill="#ffffff" />
        <rect x={x} y={0} width={150} height={1920} fill="#0b1d5c" opacity={0.06} />
        <rect x={x} y={900} width={150} height={40} fill="#0b1d5c" />
        <rect x={x} y={1500} width={150} height={24} fill="#0b1d5c" />
      </g>
    ))}
    {/* gentle light sweep */}
    <rect x={((t * 120) % 1600) - 400} y={0} width={180} height={1920} fill="#ffffff" opacity={0.05} transform="skewX(-15)" />
  </svg>
);
