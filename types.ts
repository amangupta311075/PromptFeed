export interface Prompt {
  id: string;
  promptText: string;
  category: string;
  targetModel: string;
  platform?: string;
  country?: string;
  trendingDate?: string;
  tags?: string[];
}