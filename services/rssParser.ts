/**
 * Service for fetching and parsing RSS feeds
 */

import RSSParser from 'react-native-rss-parser';
import { RssFeed, RssItem, Article } from '../types';
import { generateUniqueId } from '../utils/helpers';

interface Enclosure {
  url: string;
  type?: string;
}

/**
 * Fetch and parse an RSS feed from a URL
 */
export const fetchRssFeed = async (url: string): Promise<RssFeed> => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const feed = await RSSParser.parse(text);
    return feed as RssFeed;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch RSS feed');
  }
};

/**
 * Extract image URL from an RSS item
 */
const extractImageUrl = (item: RssItem): string | undefined => {
  // Try different possible image sources in RSS feeds
  if (item.enclosures && item.enclosures.length > 0) {
    const imageEnclosure = item.enclosures.find(
      (enclosure: Enclosure) => enclosure.type && enclosure.type.startsWith('image/')
    );
    if (imageEnclosure) {
      return imageEnclosure.url;
    }
  }
  // Try to find image in content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  return undefined;
};

/**
 * Convert RSS items to our Article format
 */
export const convertRssItemsToArticles = (
  feedId: string, 
  items: RssItem[]
): Omit<Article, 'isRead' | 'isFavorite' | 'isReadLater'>[] => {

  return items.map(item => ({
    id: item.id || generateUniqueId(),
    feedId,
    title: item.title || 'Untitled',
    link: item.links?.[0]?.url || '',
    pubDate: item.published || '',
    content: item.content || '',
    contentSnippet: item.description || '',
    author: item.authors?.[0]?.name,
    categories: item.categories,
    isoDate: item.published,
    imageUrl: extractImageUrl(item),
  }));
};

export default {
  fetchRssFeed,
  convertRssItemsToArticles,
};