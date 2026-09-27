import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {CharacterA, CharacterB} from './Characters';
import {Mall} from './Mall';
import {END_CARD, HOOK, LINES, PRICE_CARD} from './timeline';

loadFont({family: 'Tajawal', url: staticFile('Tajawal-ExtraBold.ttf'), weight: '800'});
loadFont({family: 'Tajawal', url: staticFile('Tajawal-Bold.ttf'), weight: '700'});

const NAVY = '#07154a';
const BLUE = '#1673ff';
const ORANGE = '#ff7a00';
const FONT = 'Tajawal, sans-serif';

// Character placement (screen coords of feet) and head centres, used by the camera.
const A_POS = {x: 310, y: 1790};
const B_POS = {x: 770, y: 1790};
const A_FACE = {x: A_POS.x, y: A_POS.y - 790};
const B_FACE = {x: B_POS.x, y: B_POS.y - 790};
const WIDE = {x: 540, y: 1180};

const ease = Easing.bezier(0.2, 0.8, 0.2, 1);

// Camera keyframes: [time, scale, focusX, focusY]
const CAM: [number, number, number, number][] = [
  [0, 1.15, A_FACE.x, A_FACE.y],
  [0.7, 2.5, A_FACE.x, A_FACE.y],
  [2.0, 2.6, A_FACE.x, A_FACE.y],
  [2.7, 1.0, WIDE.x, WIDE.y],
  [19.8, 1.0, WIDE.x, WIDE.y],
  [20.5, 1.45, B_FACE.x, B_FACE.y + 250],
  [23.6, 1.5, B_FACE.x, B_FACE.y + 250],
  [24.2, 1.0, WIDE.x, WIDE.y],
  [25.4, 1.0, WIDE.x, WIDE.y],
  [26.0, 1.4, B_FACE.x, B_FACE.y + 250],
  [28.2, 1.45, B_FACE.x, B_FACE.y + 250],
  [28.8, 1.0, WIDE.x, WIDE.y],
];

const camera = (t: number) => {
  const times = CAM.map((k) => k[0]);
  const at = (i: number) => interpolate(t, times, CAM.map((k) => k[i]), {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {s: at(1), fx: at(2), fy: at(3)};
};

const Bubble: React.FC<{speaker: 'A' | 'B'; text: string; frame: number; fps: number; len: number}> = ({speaker, text, frame, fps, len}) => {
  const inS = spring({frame, fps, config: {damping: 14, stiffness: 180}});
  const out = interpolate(frame, [len - 6, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const isA = speaker === 'A';
  return (
    <div
      style={{
        position: 'absolute', top: 250, left: 60, right: 60, display: 'flex', justifyContent: isA ? 'flex-start' : 'flex-end',
        opacity: out, transform: `scale(${0.6 + 0.4 * inS}) translateY(${(1 - inS) * 40}px)`, transformOrigin: isA ? 'left bottom' : 'right bottom',
      }}
    >
      <div
        style={{
          direction: 'rtl', maxWidth: 860, padding: '30px 40px', borderRadius: 44, fontFamily: FONT, fontWeight: 800, fontSize: 50, lineHeight: 1.45,
          background: isA ? '#ffffff' : `linear-gradient(135deg, ${BLUE}, #0d4fd6)`, color: isA ? NAVY : '#fff',
          boxShadow: '0 18px 50px rgba(3,10,42,.35)', position: 'relative',
          borderBottomLeftRadius: isA ? 10 : 44, borderBottomRightRadius: isA ? 44 : 10,
        }}
      >
        <div style={{fontSize: 30, fontWeight: 700, opacity: 0.7, marginBottom: 6}}>{isA ? 'الزبون' : 'يمن توب'}</div>
        {text}
      </div>
    </div>
  );
};

const LogoCircle: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <div style={{width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: '#fff', position: 'relative', ...style}}>
    <Img src={staticFile('logo.png')} style={{position: 'absolute', width: '122%', height: '122%', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', objectFit: 'contain'}} />
  </div>
);

export const Ad: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const f = (s: number) => Math.round(s * fps);

  const speaking = LINES.find((l) => t >= l.from && t < l.to);
  const {s, fx, fy} = camera(t);
  const m = Math.min(1, Math.max(0, (s - 1) / 0.5));
  const cx = fx + (540 - fx) * m;
  const cy = fy + (1060 - fy) * m;

  const hookIn = spring({frame, fps, config: {damping: 12, stiffness: 200}, delay: 6});
  const hookOut = interpolate(t, [HOOK.to - 0.25, HOOK.to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const priceS = spring({frame: frame - f(PRICE_CARD.from), fps, config: {damping: 11, stiffness: 160}});
  const priceOut = interpolate(t, [PRICE_CARD.to - 0.3, PRICE_CARD.to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pricePulse = 1 + 0.06 * Math.max(0, Math.sin((t - PRICE_CARD.from - 0.6) * 5));

  const endFade = interpolate(t, [END_CARD.from, END_CARD.from + 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const endLogo = spring({frame: frame - f(END_CARD.from + 0.2), fps, config: {damping: 12}});
  const endWa = spring({frame: frame - f(END_CARD.from + 0.9), fps, config: {damping: 10, stiffness: 150}});
  const waPulse = 1 + 0.05 * Math.max(0, Math.sin((t - END_CARD.from - 1.8) * 4));

  return (
    <AbsoluteFill style={{background: NAVY}}>
      {/* world (camera) */}
      <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${cx - fx * s}px, ${cy - fy * s}px) scale(${s})`}}>
        <Mall t={t} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${A_POS.x},${A_POS.y})`}>
            <CharacterA t={t} talking={speaking?.speaker === 'A'} mood={t < 7 ? 'concerned' : 'happy'} />
          </g>
          <g transform={`translate(${B_POS.x},${B_POS.y})`}>
            <CharacterB t={t} talking={speaking?.speaker === 'B'} />
          </g>
        </svg>
      </AbsoluteFill>

      {/* dialogue bubbles + optional voice-over files */}
      {LINES.map((l, i) => (
        <Sequence key={i} from={f(l.from)} durationInFrames={f(l.to - l.from)} layout="none">
          <Bubble speaker={l.speaker} text={l.text} frame={frame - f(l.from)} fps={fps} len={f(l.to - l.from)} />
          {l.audio ? <Audio src={staticFile(l.audio)} /> : null}
        </Sequence>
      ))}

      {/* hook */}
      {t < HOOK.to ? (
        <div style={{position: 'absolute', top: 170, left: 50, right: 50, textAlign: 'center', opacity: hookOut, transform: `scale(${0.5 + 0.5 * hookIn})`}}>
          <div style={{display: 'inline-block', direction: 'rtl', fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.4, color: '#fff', padding: '28px 44px', borderRadius: 40, background: 'rgba(7,21,74,.88)', boxShadow: '0 20px 60px rgba(0,0,0,.4)'}}>
            {HOOK.text.replace(' شوف الحل!', '')}
            <br />
            <span style={{color: ORANGE}}>شوف الحل!</span>
          </div>
        </div>
      ) : null}

      {/* price emphasis */}
      {t >= PRICE_CARD.from && t < PRICE_CARD.to ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', justifyContent: 'center', opacity: priceOut, transform: `scale(${priceS * pricePulse})`}}>
          <div style={{direction: 'rtl', textAlign: 'center', background: '#fff', borderRadius: 48, padding: '30px 60px 40px', boxShadow: '0 30px 80px rgba(3,10,42,.45)', border: `8px solid ${ORANGE}`}}>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: '#5b6aa0'}}>💰 سعر الاشتراك</div>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 150, lineHeight: 1.1, color: ORANGE}}>
              <span style={{direction: 'ltr', unicodeBidi: 'isolate'}}>1400</span> <span style={{fontSize: 72}}>ريال</span>
            </div>
            <div style={{display: 'inline-block', marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 50, color: '#fff', padding: '14px 40px', borderRadius: 36, background: `linear-gradient(90deg, ${NAVY}, ${BLUE})`}}>⏳ مدة الاشتراك: سنتين</div>
          </div>
        </div>
      ) : null}

      {/* end card */}
      {t >= END_CARD.from ? (
        <AbsoluteFill style={{opacity: endFade, background: 'radial-gradient(circle at 50% 40%, rgba(22,53,141,.96), rgba(3,10,42,.98) 80%)', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <LogoCircle size={420} style={{transform: `scale(${endLogo})`, boxShadow: '0 0 0 14px rgba(255,255,255,.08), 0 30px 90px rgba(0,0,0,.5)'}} />
          <div style={{direction: 'rtl', marginTop: 70, fontFamily: FONT, fontWeight: 800, fontSize: 70, color: '#fff', transform: `scale(${endLogo})`}}>تواصل معنا الآن</div>
          <div style={{direction: 'rtl', marginTop: 50, fontFamily: FONT, fontWeight: 800, fontSize: 54, color: '#fff', padding: '32px 40px', borderRadius: 40, background: `linear-gradient(90deg, ${ORANGE}, #ff9d2e)`, boxShadow: '0 20px 60px rgba(255,122,0,.4)', transform: `scale(${endWa * waPulse})`}}>
            واتساب: <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>771922199 - 775883709</span> 📲
          </div>
        </AbsoluteFill>
      ) : null}

      {/* watermark: original logo, bottom-right, 80% opacity */}
      <LogoCircle size={150} style={{position: 'absolute', right: 44, bottom: 56, opacity: 0.8}} />
    </AbsoluteFill>
  );
};
