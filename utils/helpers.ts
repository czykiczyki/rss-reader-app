/**
 * Helper utility functions
 */

import { format, parseISO, isValid, parse } from 'date-fns';
import { Article } from '../types';

/**
 * Generate a unique ID for items
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown date';

  let date;

  // Try ISO 8601 first
  if (dateString.includes('T') || dateString.includes('Z')) {
    date = parseISO(dateString);
  }

  // If parseISO didn't work, try native Date
  if (!date || !isValid(date)) {
    date = new Date(dateString);
  }

  // If native Date also failed, try parsing as RFC 2822 (RSS style)
  if (!isValid(date)) {
    try {
      date = parse(dateString, 'EEE, dd LLL yyyy HH:mm:ss xxx', new Date());
    } catch {
      return 'Invalid date';
    }
  }

  if (!isValid(date)) return 'Invalid date';

  // Format depending on how recent the date is
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) {
    return format(date, "'Today at' h:mm a");
  } else if (dayDiff === 1) {
    return format(date, "'Yesterday at' h:mm a");
  } else if (dayDiff < 7) {
    return format(date, "eeee 'at' h:mm a");
  } else {
    return format(date, 'MMM d, yyyy');
  }
};

/**
 * Extract a domain name from a URL
 */
export const extractDomain = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    // Remove www. if present
    return hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
};

/**
 * Create a snippet from HTML content
 */
export const createSnippet = (htmlContent: string, length: number = 120): string => {
  if (!htmlContent) return '';
  
  // Remove HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
  
  // Remove excess whitespace
  const cleanText = textContent.replace(/\s+/g, ' ').trim();
  
  // Truncate to desired length
  if (cleanText.length <= length) return cleanText;
  
  return cleanText.substring(0, length) + '...';
};

/**
 * Sort articles by publication date (newest first)
 */
export const sortArticlesByDate = (articles: Article[]): Article[] => {
  return [...articles].sort((a, b) => {
    // First try to use the ISO date (most reliable)
    if (a.isoDate && b.isoDate) {
      return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
    }
    
    // Fall back to pubDate if no ISO date
    if (a.pubDate && b.pubDate) {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    }
    
    // If no dates available, keep original order
    return 0;
  });
};

/**
 * Filter articles based on search term and other filters
 */
export const filterArticles = (
  articles: Article[], 
  searchTerm: string, 
  showOnlyUnread: boolean, 
  showOnlyFavorites: boolean,
  showOnlyReadLater: boolean,
  feedId?: string
): Article[] => {
  return articles.filter((article) => {
    // Filter by feed if specified
    if (feedId && article.feedId !== feedId) return false;
    
    // Filter by read status
    if (showOnlyUnread && article.isRead) return false;
    
    // Filter by favorites
    if (showOnlyFavorites && !article.isFavorite) return false;
    
    // Filter by read later
    if (showOnlyReadLater && !article.isReadLater) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const inTitle = article.title.toLowerCase().includes(term);
      const inContent = article.contentSnippet ? 
        article.contentSnippet.toLowerCase().includes(term) : false;
      
      return inTitle || inContent;
    }
    
    // Include if it passed all filters
    return true;
  });
};

export default {
  generateUniqueId,
  formatDate,
  extractDomain,
  createSnippet,
  sortArticlesByDate,
  filterArticles,
};