import { HeroArticle, Category, ArticleCard } from '@/types/models/news';

export const mockCategories: Category[] = [
  { name: 'All', slug: 'all', count: 42, isActive: true },
  { name: 'Fragrances', slug: 'fragrances', count: 15, isActive: false },
  { name: 'Reviews', slug: 'reviews', count: 12, isActive: false },
  { name: 'Trends', slug: 'trends', count: 8, isActive: false },
  { name: 'Guides', slug: 'guides', count: 7, isActive: false },
  { name: 'Industry', slug: 'industry', count: 5, isActive: false },
  { name: 'Interviews', slug: 'interviews', count: 3, isActive: false },
];

export const mockArticles: (HeroArticle & ArticleCard)[] = [
  {
    title: 'The Art of Layering: Creating Your Signature Scent Combination',
    excerpt:
      "Discover how to combine different fragrances to create a unique scent that's distinctly yours. Learn from expert perfumers about the science and art of layering.",
    image:
      'https://images.unsplash.com/photo-1595425279734-0c16adbd8c8b?w=800&auto=format&fit=crop&q=60',
    category: 'Guides',
    readingTime: 8,
    author: {
      name: 'Sophie Laurent',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
    },
    publishDate: new Date('2024-03-10'),
    gradient: {
      from: '#4F46E5',
      to: '#000000',
      opacity: 0.7,
    },
    engagement: {
      likes: 234,
      shares: 56,
    },
  },
  {
    title: 'Summer 2024 Fragrance Trends: Light and Airy Takes Center Stage',
    excerpt:
      'Explore the upcoming summer fragrance trends with a focus on light, airy, and refreshing scents that will define the season.',
    image:
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=60',
    category: 'Trends',
    readingTime: 5,
    author: {
      name: 'Marcus Chen',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60',
    },
    publishDate: new Date('2024-03-09'),
    gradient: {
      from: '#2563EB',
      to: '#000000',
      opacity: 0.6,
    },
    engagement: {
      likes: 189,
      shares: 42,
    },
  },
  // Add more mock articles as needed
];
