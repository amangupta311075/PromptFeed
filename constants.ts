export const CATEGORIES = ['All', 'Image Generation', 'Writing', 'Code', 'Viral Trends'];
export const PLATFORMS = ['All', 'TikTok', 'Instagram', 'X'];
export const COUNTRIES = ['Global', 'India', 'USA', 'UK', 'Brazil'];

export const CATEGORY_COLORS: { [key: string]: string } = {
    'Image Generation': 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30',
    'Writing': 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30',
    'Code': 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30',
    'Viral Trends': 'bg-brand-pink/20 text-brand-pink border border-brand-pink/30',
    'default': 'bg-slate-700/50 text-slate-300 border border-slate-600'
};

export const PLATFORM_COLORS: { [key: string]: string } = {
    'TikTok': 'bg-black text-white border border-gray-500',
    'Instagram': 'bg-pink-600/90 text-white border border-pink-500/50',
    'X': 'bg-sky-500/90 text-white border border-sky-400/50',
    'default': 'bg-slate-700/50 text-slate-300 border border-slate-600'
};