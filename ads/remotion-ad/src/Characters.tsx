import React from 'react';

// Both characters are drawn in local coords: feet at (0,0), head top near y=-890.
type Props = {t: number; talking: boolean; mood?: 'concerned' | 'happy'};

const mouthOpen = (t: number, talking: boolean, seed: number) =>
  talking ? Math.max(0, 0.25 + 0.45 * Math.abs(Math.sin(t * 13 + seed)) + 0.3 * Math.sin(t * 7.3 + seed * 2)) : 0;

const blink = (t: number, offset: number) => {
  const p = (t + offset) % 3.4;
  return p < 0.12 ? 0.12 : 1;
};

const Eyes: React.FC<{t: number; look: number; offset: number; brow: number}> = ({t, look, offset, brow}) => {
  const b = blink(t, offset);
  return (
    <g>
      {[-30, 30].map((x) => (
        <g key={x} transform={`translate(${x},-800) scale(1,${b})`}>
          <ellipse rx={14} ry={10} fill="#fff" />
          <circle cx={look} r={6.5} fill="#1a120c" />
          <circle cx={look + 2} cy={-2} r={2} fill="#fff" />
        </g>
      ))}
      {/* brows: brow>0 raises inner ends (concerned) */}
      <path d={`M-48,-824 Q-32,${-834 - brow} -14,${-826 - brow * 1.6}`} stroke="#1b1410" strokeWidth={7} strokeLinecap="round" fill="none" />
      <path d={`M48,-824 Q32,${-834 - brow} 14,${-826 - brow * 1.6}`} stroke="#1b1410" strokeWidth={7} strokeLinecap="round" fill="none" />
    </g>
  );
};

const Mouth: React.FC<{open: number; smile: number}> = ({open, smile}) =>
  open > 0.05 ? (
    <g transform="translate(0,-742)">
      <ellipse rx={17} ry={3 + open * 15} fill="#5b1f1a" />
      <ellipse cy={2 + open * 8} rx={10} ry={2 + open * 5} fill="#d9695f" />
    </g>
  ) : (
    <path d={`M-18,-745 Q0,${-745 + smile} 18,-745`} stroke="#5b1f1a" strokeWidth={6} strokeLinecap="round" fill="none" />
  );

const Head: React.FC<{skin: string; t: number; talking: boolean; look: number; brow: number; smile: number; seed: number; beard: 'light' | 'full'}> = ({
  skin, t, talking, look, brow, smile, seed, beard,
}) => (
  <g>
    <rect x={-24} y={-720} width={48} height={34} fill={skin} />
    <circle cx={-80} cy={-790} r={17} fill={skin} />
    <circle cx={80} cy={-790} r={17} fill={skin} />
    <ellipse cx={0} cy={-790} rx={80} ry={94} fill={skin} />
    {beard === 'light' ? (
      <path d="M-78,-790 Q-76,-710 -30,-700 Q0,-692 30,-700 Q76,-710 78,-790 Q70,-730 40,-722 Q0,-716 -40,-722 Q-70,-730 -78,-790Z" fill="#2a1d15" opacity={0.55} />
    ) : (
      <path d="M-80,-800 Q-82,-700 -35,-672 Q0,-658 35,-672 Q82,-700 80,-800 Q70,-740 38,-730 Q0,-724 -38,-730 Q-70,-740 -80,-800Z" fill="#1b1410" />
    )}
    <path d={beard === 'light' ? 'M-26,-758 Q0,-768 26,-758 Q0,-760 -26,-758Z' : 'M-32,-756 Q0,-772 32,-756 Q0,-762 -32,-756Z'} fill="#1b1410" stroke="#1b1410" strokeWidth={6} />
    {/* hair */}
    <path d="M-82,-800 Q-90,-900 0,-892 Q90,-900 82,-800 Q76,-850 40,-858 Q0,-872 -40,-858 Q-76,-850 -82,-800Z" fill="#1b1410" />
    <path d="M-6,-790 Q-10,-770 2,-766" stroke="#8a5a3a" strokeWidth={5} fill="none" strokeLinecap="round" />
    <Eyes t={t} look={look} offset={seed} brow={brow} />
    <Mouth open={mouthOpen(t, talking, seed)} smile={smile} />
  </g>
);

// Character A: mid-20s, t-shirt and trousers, holding a phone.
export const CharacterA: React.FC<Props> = ({t, talking, mood = 'happy'}) => {
  const skin = '#c68c5e';
  const bob = talking ? Math.sin(t * 6) * 3 : Math.sin(t * 1.6) * 2;
  const concerned = mood === 'concerned';
  return (
    <g>
      <ellipse cx={0} cy={0} rx={130} ry={18} fill="#0b1d5c" opacity={0.18} />
      {/* legs */}
      <path d="M-62,-430 L-58,-24 L-10,-24 L-4,-380 L4,-380 L10,-24 L58,-24 L62,-430Z" fill="#2b3445" />
      <ellipse cx={-36} cy={-16} rx={34} ry={16} fill="#111" />
      <ellipse cx={36} cy={-16} rx={34} ry={16} fill="#111" />
      <g transform={`translate(0,${bob})`}>
        {/* left arm hanging */}
        <path d="M-104,-660 Q-132,-560 -124,-470" stroke={skin} strokeWidth={30} strokeLinecap="round" fill="none" />
        <circle cx={-124} cy={-462} r={18} fill={skin} />
        {/* torso t-shirt */}
        <path d="M-112,-680 Q0,-706 112,-680 L100,-420 L-100,-420Z" fill="#4f6690" />
        <path d="M-112,-680 L-140,-600 L-104,-586 L-96,-640Z" fill="#4f6690" />
        <path d="M112,-680 L140,-600 L104,-586 L96,-640Z" fill="#4f6690" />
        <path d="M-30,-694 Q0,-676 30,-694" stroke="#3c5078" strokeWidth={8} fill="none" />
        {/* right arm holding phone at chest */}
        <path d="M122,-610 Q138,-540 96,-532 Q62,-530 40,-560" stroke={skin} strokeWidth={30} strokeLinecap="round" fill="none" />
        <g transform={`translate(22,-640) rotate(${concerned ? -8 : -18})`}>
          <rect x={0} y={0} width={46} height={84} rx={8} fill="#111827" />
          <rect x={4} y={6} width={38} height={70} rx={4} fill={concerned ? '#6fa8ff' : '#9cc3ff'} />
        </g>
        <circle cx={40} cy={-560} r={18} fill={skin} />
        <g transform={concerned ? 'rotate(8 0 -700)' : 'rotate(0)'}>
          <Head skin={skin} t={t} talking={talking} look={concerned ? 2 : 6} brow={concerned ? 7 : 0} smile={concerned ? -4 : 8} seed={0.7} beard="light" />
        </g>
      </g>
    </g>
  );
};

// Character B: early 30s, white Yemeni thobe, jambiya belt, shawl over shoulder.
export const CharacterB: React.FC<Props> = ({t, talking}) => {
  const skin = '#b77b4f';
  const bob = talking ? Math.sin(t * 5.5 + 1) * 3 : Math.sin(t * 1.5 + 1) * 2;
  // gesture: forearm lifts while talking
  const lift = talking ? 22 + Math.sin(t * 3) * 10 : 0;
  return (
    <g>
      <ellipse cx={0} cy={0} rx={150} ry={20} fill="#0b1d5c" opacity={0.18} />
      <ellipse cx={-40} cy={-12} rx={36} ry={13} fill="#6b4226" />
      <ellipse cx={40} cy={-12} rx={36} ry={13} fill="#6b4226" />
      <g transform={`translate(0,${bob})`}>
        {/* thobe */}
        <path d="M-120,-684 Q0,-708 120,-684 L146,-26 L-146,-26Z" fill="#f7f7f2" stroke="#d9d9cf" strokeWidth={3} />
        <path d="M-60,-500 L-70,-40" stroke="#e6e6dc" strokeWidth={6} />
        <path d="M60,-500 L72,-40" stroke="#e6e6dc" strokeWidth={6} />
        <path d="M-26,-696 L0,-640 L26,-696" stroke="#d9d9cf" strokeWidth={4} fill="none" />
        {/* left arm (towards A) with gesture */}
        <path d="M-118,-676 L-146,-520" stroke="#f7f7f2" strokeWidth={46} strokeLinecap="round" />
        <g transform={`rotate(${lift} -146 -520)`}>
          <path d="M-146,-520 L-146,-420" stroke="#f7f7f2" strokeWidth={42} strokeLinecap="round" />
          <circle cx={-146} cy={-396} r={20} fill={skin} />
        </g>
        {/* right arm */}
        <path d="M118,-676 L142,-420" stroke="#f7f7f2" strokeWidth={44} strokeLinecap="round" />
        <circle cx={144} cy={-396} r={20} fill={skin} />
        {/* belt */}
        <rect x={-132} y={-462} width={264} height={44} rx={8} fill="#7a4a22" />
        {[-100, -70, -40, 40, 70, 100].map((x) => (
          <circle key={x} cx={x} cy={-440} r={6} fill="#e0b04f" />
        ))}
        {/* jambiya: handle up, curved sheath down */}
        <path d="M-20,-430 Q-26,-330 30,-300 Q64,-290 58,-326 Q24,-346 20,-430Z" fill="#c8932f" stroke="#8a5f17" strokeWidth={4} />
        <path d="M-6,-420 Q-8,-350 34,-316" stroke="#f0cf73" strokeWidth={4} fill="none" />
        <rect x={-18} y={-540} width={36} height={86} rx={12} fill="#efe2c4" stroke="#b9a57a" strokeWidth={3} />
        <ellipse cx={0} cy={-544} rx={28} ry={14} fill="#efe2c4" stroke="#b9a57a" strokeWidth={3} />
        <rect x={-20} y={-464} width={40} height={14} rx={4} fill="#e0b04f" />
        {/* shawl draped over right shoulder */}
        <path d="M-30,-700 Q40,-716 126,-684 L150,-470 Q128,-462 104,-470 L96,-636 Q40,-670 -20,-676Z" fill="#8b1e2d" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${100 + i * 1},${-620 + i * 32} L${146 - i * 0.5},${-612 + i * 32}`} stroke="#f3e3c3" strokeWidth={6} />
        ))}
        <path d="M104,-470 L108,-448 M116,-468 L120,-446 M128,-468 L132,-446 M140,-470 L144,-448" stroke="#f3e3c3" strokeWidth={4} />
        <Head skin={skin} t={t} talking={talking} look={-6} brow={-2} smile={12} seed={2.1} beard="full" />
      </g>
    </g>
  );
};
