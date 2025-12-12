export enum TemplateCategory {
  SOCIAL = 'Social & Cultural',
  PROFESSIONAL = 'Professional & Academic',
  LIFESTYLE = 'Personal & Lifestyle',
  NIGHTLIFE = 'Entertainment & Nightlife',
  CORPORATE = 'Corporate Marketing',
}

export interface PosterConfig {
  prompt: string; // Main user prompt
  title?: string; // Optional event title for reference
  style: string;
  aspectRatio: string;
  // Legacy fields mapped for compatibility or advanced options
  category?: TemplateCategory; 
  colorPalette?: string;
  tone?: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface GeneratedPoster extends PosterConfig {
  id: string;
  imageUrl: string;
  generatedAt: string; // ISO date string
  generationTimeMs: number;
  promptUsed: string;
  tokenUsage?: TokenUsage;
  eventName: string;
  additionalInfo?: string;
}

export interface GenerationMetrics {
  durationMs: number;
  status: 'success' | 'error';
  errorMessage?: string;
}