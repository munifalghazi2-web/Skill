import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

loadFont({family: 'Tajawal', url: staticFile('Tajawal-ExtraBold.ttf'), weight: '800'});
loadFont({family: 'Tajawal', url: staticFile('Tajawal-Bold.ttf'), weight: '700'});

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
const FONT = 'Tajawal, sans-serif';
const ORANGE = '#ff8a1f';
const PURPLE = '#6d3df5';

// Timeline (seconds)
const HOOK = {from: 0, len: 2.5};
const V1 = {from: 2.5, len: 10};
const V2 = {from: 12.5, len: 10};
const END = {from: 22.5, len: 2.5};
export const TOTAL = s(END.from + END.len);

// On-screen text, relative to each video's start
const CAPTIONS: {at: number; from: number; to: number; text: string; hl?: string}[] = [
  {at: V1.from, from: 0, to: 2.2, text: 'عالم الحماس والمنافسة 🔥', hl: 'الحماس'},
  {at: V1.from, from: 2.2, to: 4.4, text: 'ألعاب الرياضة بين يديك ⚽', hl: 'بين يديك'},
  {at: V1.from, from: 4.4, to: 6.0, text: 'فيفا موبايل و eFootball بيس 🎮', hl: 'فيفا'},
  {at: V1.from, from: 6.0, to: 10, text: 'شحن مباشر وسريع ⚡', hl: 'وسريع'},
  {at: V2.from, from: 0, to: 2.0, text: 'لا تبحث كثيرًا... اشحن الآن', hl: 'اشحن الآن'},
  {at: V2.from, from: 2.0, to: 4.1, text: 'أسعار منافسة 💰', hl: 'منافسة'},
  {at: V2.from, from: 4.1, to: 6.1, text: 'شحن نقاط فيفا وكوينز بيس موبايل 🪙', hl: 'نقاط فيفا'},
  {at: V2.from, from: 6.1, to: 8.1, text: 'جميع العروض واللاعبين ⭐', hl: 'العروض'},
  {at: V2.from, from: 8.1, to: 10, text: 'كل العروض متوفرة عندنا ✅', hl: 'متوفرة'},
];

const LogoTab: React.FC = () => (
  <div style={{position: 'absolute', top: 0, right: 45, width: 210, height: 246, background: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,.35)'}}>
    <Img src={staticFile('logo.png')} style={{width: 230, height: 230, objectFit: 'cover', clipPath: 'circle(40% at 49.5% 50.3%)'}} />
  </div>
);

const Caption: React.FC<{text: string; hl?: string; frame: number; len: number}> = ({text, hl, frame, len}) => {
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const hlWords = new Set((hl ?? '').split(' ').filter(Boolean));
  const out = interpolate(frame, [len - 5, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const box = spring({frame, fps, config: {damping: 14, stiffness: 220}});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, bottom: 70, display: 'flex', justifyContent: 'center', opacity: out}}>
      <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', padding: '22px 40px', borderRadius: 34, background: 'rgba(10,8,40,.82)', border: '3px solid rgba(255,255,255,.12)', boxShadow: '0 16px 40px rgba(0,0,0,.45)', transform: `scale(${0.85 + 0.15 * box})`}}>
        {words.map((w, i) => {
          const p = spring({frame: frame - i * 3, fps, config: {damping: 12, stiffness: 260}});
          return (
            <span key={i} style={{fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.35, color: hlWords.has(w) ? ORANGE : '#fff', display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.7 + 0.3 * p})`}}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Flash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [s(at) - 2, s(at), s(at) + 7], [0, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return o > 0 ? <AbsoluteFill style={{background: '#fff', opacity: o}} /> : null;
};

const Clip: React.FC<{src: string; startFrom?: number; muted?: boolean; zoom?: [number, number]; len: number; blur?: number}> = ({src, startFrom = 0, muted, zoom = [1.08, 1], len, blur = 0}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, len === s(10) ? 10 : len], zoom, {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${z})`, filter: blur ? `blur(${blur}px)` : undefined}}>
      <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted={muted} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

// eFootball artwork: blurred cover fill behind a sharp, full-width copy.
const ImageBg: React.FC<{zoom: [number, number]; len: number; blurAll?: boolean}> = ({zoom, len, blurAll}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, len], zoom, {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Img src={staticFile('efootball.jpg')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(28px) brightness(.8)', transform: 'scale(1.15)'}} />
      {blurAll ? null : (
        <Img src={staticFile('efootball.jpg')} style={{position: 'absolute', left: 0, top: 960 - 303, width: 1080, height: 606, objectFit: 'cover', transform: `scale(${z})`, boxShadow: '0 30px 80px rgba(0,0,0,.6)'}} />
      )}
    </AbsoluteFill>
  );
};

// Clean price card that covers the original cards (which showed ₹ and garbled text).
const PricePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 13, stiffness: 240}});
  const out = interpolate(frame, [s(2.0) - 4, s(2.0)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const chip = (t: string) => (
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 32, whiteSpace: 'nowrap', color: '#fff', padding: '14px 20px', borderRadius: 24, background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.18)'}}>{t}</div>
  );
  return (
    <div style={{position: 'absolute', left: 130, right: 130, top: 735, height: 1060, opacity: out, transform: `scale(${0.92 + 0.08 * p})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 56, background: 'linear-gradient(180deg, rgba(12,10,46,.98), rgba(24,14,70,.98) 92%, rgba(24,14,70,.6))'}} />
      <div style={{position: 'relative', direction: 'rtl', margin: '90px 50px 0', background: '#fff', borderRadius: 44, padding: '44px 40px 48px', textAlign: 'center', boxShadow: '0 30px 70px rgba(0,0,0,.45)'}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: '#6b6f8f'}}>شحن ألعاب · Top-up</div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 56, color: '#1b1446', marginTop: 10}}>اشحن الآن</div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 150, lineHeight: 1.1, marginTop: 6, background: `linear-gradient(90deg, ${PURPLE}, ${ORANGE})`, WebkitBackgroundClip: 'text', color: 'transparent'}}>
          <span style={{direction: 'ltr', unicodeBidi: 'isolate'}}>1500</span> <span style={{fontSize: 80}}>ريال</span>
        </div>
      </div>
      <div style={{position: 'relative', direction: 'rtl', display: 'flex', justifyContent: 'center', gap: 14, marginTop: 44}}>
        {chip('⚽ فيفا موبايل')}
        {chip('🎮 eFootball')}
        {chip('⚡ شحن فوري')}
      </div>
      <div style={{position: 'relative', direction: 'rtl', textAlign: 'center', marginTop: 70, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: '#fff'}}>
        📲 اطلب عبر واتساب أو تيليجرام
      </div>
    </div>
  );
};

export const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // hook text
  const h1 = spring({frame: frame - 2, fps, config: {damping: 9, stiffness: 220}});
  const h2 = spring({frame: frame - s(1.0), fps, config: {damping: 9, stiffness: 220}});
  const shake = t < 1.2 ? Math.sin(frame * 2.2) * 6 * Math.max(0, 1 - t) : 0;

  const endIn = spring({frame: frame - s(END.from), fps, config: {damping: 12}});
  const waIn = spring({frame: frame - s(END.from + 0.5), fps, config: {damping: 10, stiffness: 160}});
  const waPulse = 1 + 0.05 * Math.max(0, Math.sin((t - END.from - 1.2) * 5));

  return (
    <AbsoluteFill style={{background: '#07061f'}}>
      {/* HOOK: eFootball 2026 artwork, then the FC Mobile screen, with audio from video 1 */}
      <Sequence from={0} durationInFrames={s(1.25)}>
        <ImageBg zoom={[1.0, 1.12]} len={s(1.25)} />
      </Sequence>
      <Sequence from={s(1.25)} durationInFrames={s(1.25)}>
        <Clip src="v1.mp4" startFrom={s(4.7)} muted zoom={[1.25, 1.05]} len={s(1.25)} blur={4} />
      </Sequence>
      <Sequence from={0} durationInFrames={s(HOOK.len)}>
        <Audio src={staticFile('v1.mp4')} startFrom={s(5)} volume={(f) => interpolate(f, [s(2.2), s(2.5)], [1, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,6,31,.9) 0%, rgba(7,6,31,.2) 32%, rgba(7,6,31,.2) 68%, rgba(7,6,31,.9) 100%)'}} />
        <div style={{position: 'absolute', top: 330, left: 30, right: 30, textAlign: 'center', direction: 'rtl', transform: `translateX(${shake}px)`}}>
          <div style={{display: 'inline-block', fontFamily: FONT, fontWeight: 800, fontSize: 96, lineHeight: 1.25, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,.7)', transform: `scale(${0.4 + 0.6 * h1})`, opacity: Math.min(1, h1 * 1.5)}}>
            لاعب فيفا أو بيس؟ 🎮
          </div>
        </div>
        <div style={{position: 'absolute', top: 1400, left: 30, right: 30, textAlign: 'center', direction: 'rtl'}}>
          <div style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.3, whiteSpace: 'nowrap', color: '#fff', padding: '18px 36px', borderRadius: 30, background: `linear-gradient(90deg, ${ORANGE}, #ff5a1f)`, boxShadow: '0 16px 50px rgba(255,120,30,.5)', transform: `scale(${h2})`}}>
            🔥 لا تشحن قبل ما تشوف هذا 👀
          </div>
        </div>
        <LogoTab />
      </Sequence>

      {/* VIDEO 1 */}
      <Sequence from={s(V1.from)} durationInFrames={s(V1.len)}>
        <Clip src="v1.mp4" len={s(10)} />
      </Sequence>

      {/* VIDEO 2 (TikTok handle removed) + clean riyal price card over the first scene */}
      <Sequence from={s(V2.from)} durationInFrames={s(V2.len)}>
        <Clip src="v2.mp4" len={s(10)} />
        <Sequence from={0} durationInFrames={s(2.0)}>
          <PricePanel />
        </Sequence>
      </Sequence>

      {/* END CARD */}
      <Sequence from={s(END.from)} durationInFrames={s(END.len)}>
        <Audio src={staticFile('v1.mp4')} startFrom={s(7.5)} volume={(f) => interpolate(f, [0, s(2.1), s(2.5)], [1, 1, 0], {extrapolateRight: 'clamp'})} />
        <ImageBg zoom={[1.05, 1.15]} len={s(END.len)} blurAll />
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 38%, rgba(59,29,143,.82), rgba(18,8,47,.94) 75%)'}} />
        <AbsoluteFill style={{background: 'transparent', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <div style={{width: 400, height: 400, borderRadius: '50%', overflow: 'hidden', background: '#fff', position: 'relative', transform: `scale(${endIn})`, boxShadow: '0 0 0 14px rgba(255,255,255,.08), 0 30px 90px rgba(0,0,0,.5)'}}>
            <Img src={staticFile('logo.png')} style={{position: 'absolute', width: '122%', height: '122%', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', objectFit: 'contain'}} />
          </div>
          <div style={{direction: 'rtl', marginTop: 60, fontFamily: FONT, fontWeight: 800, fontSize: 76, color: '#fff', transform: `scale(${endIn})`}}>اشحن الآن 🎮</div>
          <div style={{direction: 'rtl', marginTop: 46, fontFamily: FONT, fontWeight: 800, fontSize: 52, color: '#fff', padding: '30px 38px', borderRadius: 38, background: `linear-gradient(90deg, ${ORANGE}, #ff5a1f)`, boxShadow: '0 20px 60px rgba(255,122,0,.45)', transform: `scale(${waIn * waPulse})`}}>
            واتساب: <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>771922199 - 775883709</span> 📲
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* captions */}
      {CAPTIONS.map((c, i) => (
        <Sequence key={i} from={s(c.at + c.from)} durationInFrames={s(c.to - c.from)} layout="none">
          <Caption text={c.text} hl={c.hl} frame={frame - s(c.at + c.from)} len={s(c.to - c.from)} />
        </Sequence>
      ))}

      <Flash at={HOOK.len / 2} />
      <Flash at={V1.from} />
      <Flash at={V2.from} />
      <Flash at={END.from} />
    </AbsoluteFill>
  );
};
