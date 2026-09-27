// All timings in seconds. Adjust these to match voice-over audio lengths.
export const FPS = 30;
export const DURATION = 33;

export type Speaker = 'A' | 'B';

export const LINES: {speaker: Speaker; from: number; to: number; text: string; audio?: string}[] = [
  {speaker: 'A', from: 2.3, to: 7.7, text: 'عندي منتجات كثيرة واحتاج الى اداة تصميم صور لكي اصمم لمنتجاتي', audio: 'audio/line-0.wav'},
  {speaker: 'B', from: 8.1, to: 15.6, text: 'لا تقلق مع يمن توب رح تجد حل مشكلتك كامل، احنا موفرين لك عرض اداة كانفا افضل اداة تصميم للمنتجات', audio: 'audio/line-1.wav'},
  {speaker: 'A', from: 16.0, to: 19.4, text: 'حلو، بكم سعر الاشتراك وكم مدة الاشتراك؟', audio: 'audio/line-2.wav'},
  {speaker: 'B', from: 19.8, to: 24.1, text: 'سعر الاشتراك ب1400 ريال ومدة الاشتراك سنتين', audio: 'audio/line-3.wav'},
  {speaker: 'B', from: 24.5, to: 28.4, text: 'كل ما عليك هو التواصل معانا على الارقام الظاهرة على الشاشة', audio: 'audio/line-4.wav'},
];

export const HOOK = {from: 0, to: 2.2, text: '🎨 تصمم منتجاتك زي المحترفين؟ شوف الحل!'};
export const PRICE_CARD = {from: 20.3, to: 24.1};
export const END_CARD = {from: 28.8, to: DURATION, text: 'واتساب: 771922199 - 775883709 📲'};
