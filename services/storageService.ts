/**
 * Service for handling local storage operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feed, Article } from '../types';
import { Mutex } from 'async-mutex';

// Storage keys
const STORAGE_KEYS = {
  FEEDS: 'rss_reader_feeds',
  ARTICLES: 'rss_reader_articles',
  ARTICLE_STATUS: 'rss_reader_article_status',
};

// Mutexes to prevent race conditions when saving data
const feedsMutex = new Mutex();
const articlesMutex = new Mutex();
const articleStatusMutex = new Mutex();

/**
 * Save feeds to AsyncStorage
 */
export const saveFeeds = async (feeds: Feed[]): Promise<void> => {
  return feedsMutex.runExclusive(async () => {
    try {
      const jsonValue = JSON.stringify(feeds);
      await AsyncStorage.setItem(STORAGE_KEYS.FEEDS, jsonValue);
    } catch (e) {
      console.error('Error saving feeds to storage:', e);
      throw new Error('Failed to save feeds');
    }
  });
};

/**
 * Load feeds from AsyncStorage
 */
export const loadFeeds = async (): Promise<Feed[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.FEEDS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading feeds from storage:', e);
    return [];
  }
};

/**
 * Save all articles to AsyncStorage
 */
export const saveArticles = async (articles: Article[]): Promise<void> => {
  return articlesMutex.runExclusive(async () => {
    try {
      // We only save the bare minimum data needed for article restoration
      const minimalArticles = articles.map(article => ({
        id: article.id,
        feedId: article.feedId,
        title: article.title,
        link: article.link,
        pubDate: article.pubDate,
        isoDate: article.isoDate,
        imageUrl: article.imageUrl,
      }));
      
      const jsonValue = JSON.stringify(minimalArticles);
      await AsyncStorage.setItem(STORAGE_KEYS.ARTICLES, jsonValue);
    } catch (e) {
      console.error('Error saving articles to storage:', e);
      throw new Error('Failed to save articles');
    }
  });
};

/**
 * Save article status (read/favorite/readLater) to AsyncStorage
 */
export const saveArticleStatus = async (articles: Article[]): Promise<void> => {
  return articleStatusMutex.runExclusive(async () => {
    try {
      // Only save status information to reduce storage size
      const statusData = articles.map(article => ({
        id: article.id,
        isRead: article.isRead,
        isFavorite: article.isFavorite,
        isReadLater: article.isReadLater,
      }));
      
      const jsonValue = JSON.stringify(statusData);
      await AsyncStorage.setItem(STORAGE_KEYS.ARTICLE_STATUS, jsonValue);
    } catch (e) {
      console.error('Error saving article status to storage:', e);
      throw new Error('Failed to save article status');
    }
  });
};

/**
 * Load articles from AsyncStorage
 */
export const loadArticles = async (): Promise<Partial<Article>[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ARTICLES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading articles from storage:', e);
    return [];
  }
};

/**
 * Load article status from AsyncStorage
 */
export const loadArticleStatus = async (): Promise<Record<string, { isRead: boolean; isFavorite: boolean; isReadLater: boolean }>> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ARTICLE_STATUS);
    if (jsonValue == null) return {};
    
    const statusArray = JSON.parse(jsonValue);
    // Convert array to lookup object by id
    return statusArray.reduce(
      (acc: Record<string, any>, item: any) => {
        acc[item.id] = {
          isRead: item.isRead || false,
          isFavorite: item.isFavorite || false,
          isReadLater: item.isReadLater || false,
        };
        return acc;
      },
      {}
    );
  } catch (e) {
    console.error('Error loading article status from storage:', e);
    return {};
  }
};

/**
 * Clear all storage (for debugging/testing)
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.FEEDS,
      STORAGE_KEYS.ARTICLES,
      STORAGE_KEYS.ARTICLE_STATUS,
    ]);
  } catch (e) {
    console.error('Error clearing storage:', e);
    throw new Error('Failed to clear storage');
  }
};

export default {
  saveFeeds,
  loadFeeds,
  saveArticles,
  loadArticles,
  saveArticleStatus,
  loadArticleStatus,
  clearAllStorage,
};