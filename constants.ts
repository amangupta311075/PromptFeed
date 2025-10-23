export const CATEGORIES = ['All', 'Image Generation', 'Writing', 'Code', 'Viral Trends'];
export const PLATFORMS = ['All', 'TikTok', 'Instagram', 'Facebook', 'Reddit'];
export const COUNTRIES = ['Global', 'India', 'USA', 'UK', 'Brazil'];

export const CATEGORY_COLORS: { [key: string]: string } = {
    'Image Generation': 'bg-blue-100 text-blue-800 dark:bg-brand-blue/20 dark:text-brand-blue border border-blue-200 dark:border-brand-blue/30',
    'Writing': 'bg-purple-100 text-purple-800 dark:bg-brand-purple/20 dark:text-brand-purple border border-purple-200 dark:border-brand-purple/30',
    'Code': 'bg-teal-100 text-teal-800 dark:bg-brand-teal/20 dark:text-brand-teal border border-teal-200 dark:border-brand-teal/30',
    'Viral Trends': 'bg-pink-100 text-pink-800 dark:bg-brand-pink/20 dark:text-brand-pink border border-pink-200 dark:border-brand-pink/30',
    'default': 'bg-gray-200 text-gray-700 dark:bg-slate-700/50 dark:text-slate-300 border border-gray-300 dark:border-slate-600'
};

export const PLATFORM_COLORS: { [key: string]: string } = {
    'TikTok': 'bg-black text-white border border-gray-500',
    'Instagram': 'bg-pink-600/90 text-white border border-pink-500/50',
    'Facebook': 'bg-blue-600/90 text-white border border-blue-500/50',
    'Reddit': 'bg-orange-600/90 text-white border border-orange-500/50',
    'default': 'bg-gray-200 text-gray-700 dark:bg-slate-700/50 dark:text-slate-300 border border-gray-300 dark:border-slate-600'
};