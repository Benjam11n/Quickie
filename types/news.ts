export interface HeroArticle {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readingTime: number;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: Date;
  gradient: {
    from: string;
    to: string;
    opacity: number;
  };
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  isActive: boolean;
}

export interface ArticleCard {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readingTime: number;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: Date;
  engagement: {
    likes: number;
    shares: number;
  };
}

export interface NewsItem {
  title: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  timeAgo: string;
  readMore: string;
}

export interface TrendingArticle {
  position: number;
  title: string;
  views: number;
  comments: number;
}

export interface NewsletterSection {
  title: string;
  description: string;
  inputPlaceholder: string;
  buttonText: string;
  gradient: {
    from: string;
    to: string;
  };
}
