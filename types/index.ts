/**
 * Core data types for the RSS Reader app
 */

// Represents an RSS feed
export interface Feed {
  id: string;
  title: string;
  url: string;
  description?: string;
  lastUpdated?: string;
  errorMessage?: string;
  isLoading?: boolean;
}

// Represents an article from an RSS feed
export interface Article {
  id: string;
  feedId: string;
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  author?: string;
  categories?: string[];
  isoDate?: string;
  // Custom properties for our app
  isRead: boolean;
  isFavorite: boolean;
  isReadLater: boolean;
  imageUrl?: string;
}

// Filter options for articles
export interface ArticleFilters {
  searchTerm: string;
  showOnlyUnread: boolean;
  showOnlyFavorites: boolean;
  showOnlyReadLater: boolean;
  feedId?: string;
}

// Store state types
export interface FeedState {
  feeds: Feed[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addFeed: (url: string, title?: string) => Promise<void>;
  updateFeed: (id: string, updates: Partial<Omit<Feed, 'id'>>) => void;
  deleteFeed: (id: string) => void;
  refreshAllFeeds: () => Promise<void>;
  refreshFeed: (id: string) => Promise<RssFeed>;
}

export interface ArticleState {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  filters: ArticleFilters;
  
  // Actions
  setArticles: (feedId: string, newArticles: Omit<Article, 'feedId' | 'isRead' | 'isFavorite' | 'isReadLater'>[]) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleReadLater: (id: string) => void;
  setFilters: (filters: Partial<ArticleFilters>) => void;
  clearFilters: () => void;
}

// For parsing RSS feeds
export type RssItem = {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
  author?: string;
  categories?: string[];
  [key: string]: any;
};

export type RssFeed = {
  title?: string;
  description?: string;
  link?: string;
  items: RssItem[];
  [key: string]: any;
};