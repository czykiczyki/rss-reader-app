/**
 * Tests for feed store
 */

import { act, renderHook } from '@testing-library/react-native';
import { useFeedStore } from './feedStore';
import { fetchRssFeed } from '../services/rssParser';
import { saveFeeds } from '../services/storageService';

// Mock dependencies
jest.mock('../services/rssParser', () => ({
  fetchRssFeed: jest.fn(),
  convertRssItemsToArticles: jest.fn(() => []),
}));

jest.mock('../services/storageService', () => ({
  saveFeeds: jest.fn(),
  loadFeeds: jest.fn(),
}));

// Mock useArticleStore
jest.mock('./articleStore', () => ({
  useArticleStore: {
    getState: jest.fn(() => ({
      setArticles: jest.fn(),
    })),
  },
}));

describe('useFeedStore', () => {
  beforeEach(() => {
    // Reset the store
    act(() => {
      useFeedStore.setState({
        feeds: [],
        isLoading: false,
        error: null,
      });
    });
    
    // Clear mocks
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (fetchRssFeed as jest.Mock).mockResolvedValue({
      title: 'Test Feed',
      description: 'Test Description',
      items: [],
    });
  });
  
  test('should add a new feed', async () => {
    const { result } = renderHook(() => useFeedStore());
    
    await act(async () => {
      await result.current.addFeed('https://example.com/rss');
    });
    
    // Verify feed was added
    expect(result.current.feeds.length).toBe(1);
    expect(result.current.feeds[0].url).toBe('https://example.com/rss');
    expect(result.current.feeds[0].title).toBe('Test Feed');
    
    // Verify dependencies were called
    expect(fetchRssFeed).toHaveBeenCalledWith('https://example.com/rss');
    expect(saveFeeds).toHaveBeenCalled();
  });
  
  test('should not add duplicate feeds', async () => {
    const { result } = renderHook(() => useFeedStore());
    
    // Add first feed
    await act(async () => {
      await result.current.addFeed('https://example.com/rss');
    });
    
    // Try to add duplicate feed
    await act(async () => {
      await result.current.addFeed('https://example.com/rss');
    });
    
    // Verify only one feed was added
    expect(result.current.feeds.length).toBe(1);
    expect(result.current.error).toBe('This feed already exists');
  });
  
  test('should update a feed', async () => {
    const { result } = renderHook(() => useFeedStore());
    
    // Add a feed first
    await act(async () => {
      await result.current.addFeed('https://example.com/rss');
    });
    
    const feedId = result.current.feeds[0].id;
    
    // Update the feed
    act(() => {
      result.current.updateFeed(feedId, { 
        title: 'Updated Title', 
        description: 'Updated Description' 
      });
    });
    
    // Verify feed was updated
    expect(result.current.feeds[0].title).toBe('Updated Title');
    expect(result.current.feeds[0].description).toBe('Updated Description');
    expect(saveFeeds).toHaveBeenCalled();
  });
  
  test('should delete a feed', async () => {
    const { result } = renderHook(() => useFeedStore());
    
    // Add a feed first
    await act(async () => {
      await result.current.addFeed('https://example.com/rss');
    });
    
    const feedId = result.current.feeds[0].id;
    
    // Delete the feed
    act(() => {
      result.current.deleteFeed(feedId);
    });
    
    // Verify feed was deleted
    expect(result.current.feeds.length).toBe(0);
    expect(saveFeeds).toHaveBeenCalled();
  });
  
  test('should handle error when adding a feed', async () => {
    const { result } = renderHook(() => useFeedStore());
    
    // Mock error response
    (fetchRssFeed as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    // Try to add feed
    await act(async () => {
      await result.current.addFeed('https://example.com/rss');
    });
    
    // Verify error was handled
    expect(result.current.feeds.length).toBe(0);
    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });
});