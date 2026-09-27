// All timings in seconds. Adjust these to match voice-over audio lengths.
export const FPS = 30;
export const DURATION = 30;

export type Speaker = 'A' | 'B';

export const LINES: {speaker: Speaker; from: number; to: number; text: string; audio?: string}[] = [
  {speaker: 'A', from: 2.3, to: 6.8, text: 'عندي منتجات كثيرة واحتاج الى اداة تصميم صور لكي اصمم لمنتجاتي'},
  {speaker: 'B', from: 7.2, to: 13.8, text: 'لا تقلق مع يمن توب رح تجد حل مشكلتك كامل، احنا موفرين لك عرض اداة كانفا افضل اداة تصميم للمنتجات'},
  {speaker: 'A', from: 14.2, to: 17.4, text: 'حلو، بكم سعر الاشتراك وكم مدة الاشتراك؟'},
  {speaker: 'B', from: 17.8, to: 21.8, text: 'سعر الاشتراك ب1400 ريال ومدة الاشتراك سنتين'},
  {speaker: 'B', from: 22.2, to: 25.8, text: 'كل ما عليك هو التواصل معانا على الارقام الظاهرة على الشاشة'},
];

export const HOOK = {from: 0, to: 2.2, text: '🎨 تصمم منتجاتك زي المحترفين؟ شوف الحل!'};
export const PRICE_CARD = {from: 18.3, to: 22.0};
export const END_CARD = {from: 26.0, to: DURATION, text: 'واتساب: 771922199 - 775883709 📲'};
