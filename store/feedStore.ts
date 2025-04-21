import { create } from 'zustand';
import { Feed, FeedState } from '../types';
import { generateUniqueId } from '../utils/helpers';
import { fetchRssFeed, convertRssItemsToArticles } from '../services/rssParser';
import { saveFeeds, loadFeeds } from '../services/storageService';
import { useArticleStore } from './articleStore';

export const useFeedStore = create<FeedState>((set, get) => ({
  feeds: [],
  isLoading: false,
  error: null,
  
  // Add a new RSS feed
  addFeed: async (url: string, title?: string) => {
    // Check if feed already exists
    const { feeds } = get();
    if (feeds.some(feed => feed.url === url)) {
      set({ error: 'This feed already exists' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // Fetch feed data to validate and get title/description
      const feedData = await fetchRssFeed(url);
      
      // Create new feed object
      const newFeed: Feed = {
        id: generateUniqueId(),
        title: title || feedData.title || 'Untitled Feed',
        url,
        description: feedData.description,
        lastUpdated: new Date().toISOString(),
      };
      
      // Update state
      const updatedFeeds = [...feeds, newFeed];
      set({ feeds: updatedFeeds, isLoading: false });
      
      // Save to storage
      await saveFeeds(updatedFeeds);
      
      // Convert and store articles
      if (feedData.items && feedData.items.length > 0) {
        const articles = convertRssItemsToArticles(newFeed.id, feedData.items);
        useArticleStore.getState().setArticles(newFeed.id, articles);
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to add feed' 
      });
    }
  },
  
  // Update an existing feed
  updateFeed: (id: string, updates: Partial<Omit<Feed, 'id'>>) => {
    const { feeds } = get();
    const updatedFeeds = feeds.map(feed => 
      feed.id === id ? { ...feed, ...updates } : feed
    );
    
    set({ feeds: updatedFeeds });
    saveFeeds(updatedFeeds).catch(err => {
      console.error('Error saving updated feeds:', err);
    });
  },
  
  // Delete a feed
  deleteFeed: (id: string) => {
    const { feeds } = get();
    const updatedFeeds = feeds.filter(feed => feed.id !== id);
    
    set({ feeds: updatedFeeds });
    saveFeeds(updatedFeeds).catch(err => {
      console.error('Error saving feeds after deletion:', err);
    });
  },
  
  // Refresh all feeds
  refreshAllFeeds: async () => {
    const { feeds } = get();
    set({ isLoading: true, error: null });
    
    try {
      // Update loading state for all feeds
      const feedsWithLoading = feeds.map(feed => ({ ...feed, isLoading: true }));
      set({ feeds: feedsWithLoading });
      
      // Process each feed
      await Promise.all(
        feeds.map(async (feed) => {
          try {
            await get().refreshFeed(feed.id);
          } catch (error) {
            // Update individual feed error state
            get().updateFeed(feed.id, { 
              errorMessage: error instanceof Error ? error.message : 'Failed to refresh feed',
              isLoading: false
            });
          }
        })
      );
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to refresh feeds'
      });
    }
  },
  
  // Refresh a single feed
  refreshFeed: async (id: string) => {
    const { feeds } = get();
    const feed = feeds.find(f => f.id === id);
    
    if (!feed) {
      throw new Error('Feed not found');
    }
    
    // Update loading state for this feed
    get().updateFeed(id, { isLoading: true, errorMessage: undefined });
    
    try {
      // Fetch feed data
      const feedData = await fetchRssFeed(feed.url);
      
      // Convert and store articles
      if (feedData.items && feedData.items.length > 0) {
        const articles = convertRssItemsToArticles(feed.id, feedData.items);
        useArticleStore.getState().setArticles(feed.id, articles);
      }
      
      // Update feed with latest info
      get().updateFeed(id, {
        title: feedData.title || feed.title,
        description: feedData.description || feed.description,
        lastUpdated: new Date().toISOString(),
        isLoading: false,
        errorMessage: undefined
      });
      
      return feedData;
    } catch (error) {
      // Update feed with error info
      get().updateFeed(id, { 
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to refresh feed'
      });
      
      throw error;
    }
  },
}));

// Initialize feeds from storage
export const initializeFeedStore = async (): Promise<void> => {
  try {
    const feeds = await loadFeeds();
    if (feeds && feeds.length > 0) {
      useFeedStore.setState({ feeds });
    }
  } catch (error) {
    console.error('Error initializing feed store:', error);
  }
};

export default { useFeedStore, initializeFeedStore };