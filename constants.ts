import { TemplateCategory } from './types';

export const CATEGORIES = Object.values(TemplateCategory);

export const ASPECT_RATIOS = [
  { label: 'Square (1:1)', value: '1:1', icon: 'M4 4h16v16H4z' },
  { label: 'Portrait (3:4)', value: '3:4', icon: 'M6 2h12v20H6z' },
  { label: 'Landscape (4:3)', value: '4:3', icon: 'M2 6h20v12H2z' },
  { label: 'Mobile (9:16)', value: '9:16', icon: 'M7 2h10v20H7z' },
  { label: 'Wide (16:9)', value: '16:9', icon: 'M2 7h20v10H2z' },
];

export const COLOR_PALETTES = [
  'Vibrant & Neon',
  'Monochrome & Minimalist',
  'Pastel & Soft',
  'Dark & Moody',
  'Corporate Blue & Grey',
  'Earthy & Natural',
  'Gold & Luxury',
];

export const STYLES = [
  'Modern Geometric',
  'Vintage/Retro',
  'Abstract Art',
  'Photorealistic',
  'Typographic Heavy',
  '3D Rendered',
  'Watercolor',
  'Cyberpunk',
  'Minimalist Line Art',
  'Pop Art',
];

export const TONES = [
  'Exciting & Energetic',
  'Professional & Serious',
  'Warm & Welcoming',
  'Mysterious & Edgy',
  'Elegant & Sophisticated',
  'Fun & Playful',
];

export const TEMPLATE_PROMPTS: Record<TemplateCategory, string> = {
  [TemplateCategory.SOCIAL]: `
    SUBJECT: A dynamic and inclusive community event poster.
    COMPOSITION: Collage-style or fluid layout connecting diverse human figures.
    VIBE: Unity, celebration, diversity.
  `.trim(),

  [TemplateCategory.PROFESSIONAL]: `
    SUBJECT: A high-end academic conference poster.
    COMPOSITION: Strict grid-based layout, Bauhaus influence.
    VIBE: Knowledge, authority, innovation.
  `.trim(),

  [TemplateCategory.LIFESTYLE]: `
    SUBJECT: A trendy lifestyle or wellness poster.
    COMPOSITION: Organic framing with botanicals.
    VIBE: Serenity, health, aesthetic.
  `.trim(),

  [TemplateCategory.NIGHTLIFE]: `
    SUBJECT: An electrifying nightlife event poster.
    COMPOSITION: Dynamic motion blur, neon lights.
    VIBE: Adrenaline, loud music, nocturnal.
  `.trim(),

  [TemplateCategory.CORPORATE]: `
    SUBJECT: A polished corporate summit poster.
    COMPOSITION: Asymmetrical modern balance, skyscrapers.
    VIBE: Trust, success, strategy.
  `.trim(),
};

export const EXPLORE_TILES = [
  {
    label: 'Social & Cultural',
    icon: '🎉',
    gradient: 'from-pink-500 to-rose-600',
    prompt: 'A vibrant social event poster for a community gathering, featuring diverse people and festive decorations.',
    category: TemplateCategory.SOCIAL
  },
  {
    label: 'Professional & Academic',
    icon: '🌍',
    gradient: 'from-blue-600 to-indigo-600',
    prompt: 'A modern academic conference poster with a clean grid layout, geometric shapes, and professional typography.',
    category: TemplateCategory.PROFESSIONAL
  },
  {
    label: 'Personal & Lifestyle',
    icon: '🌿',
    gradient: 'from-emerald-500 to-teal-600',
    prompt: 'A soft and aesthetic lifestyle event poster for a wellness workshop, featuring botanical illustrations and calming colors.',
    category: TemplateCategory.LIFESTYLE
  },
  {
    label: 'Entertainment',
    icon: '🎵',
    gradient: 'from-violet-600 to-purple-600',
    prompt: 'An electrifying music concert poster with neon lights, dynamic motion, and high energy visuals.',
    category: TemplateCategory.NIGHTLIFE
  },
  {
    label: 'Corporate',
    icon: '💼',
    gradient: 'from-slate-600 to-gray-700',
    prompt: 'A polished corporate summit poster featuring skyscrapers, abstract data visualization, and a trustworthy blue color palette.',
    category: TemplateCategory.CORPORATE
  }
];