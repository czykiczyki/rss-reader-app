/**
 * Tests for article store
 */

import { act, renderHook } from '@testing-library/react-native';
import { useArticleStore } from './articleStore';
import { saveArticles, saveArticleStatus } from '../services/storageService';

// Mock dependencies
jest.mock('../services/storageService', () => ({
  saveArticles: jest.fn(),
  loadArticles: jest.fn(),
  saveArticleStatus: jest.fn(),
  loadArticleStatus: jest.fn(),
}));

describe('useArticleStore', () => {
  beforeEach(() => {
    // Reset the store
    act(() => {
      useArticleStore.setState({
        articles: [],
        isLoading: false,
        error: null,
        filters: {
          searchTerm: '',
          showOnlyUnread: false,
          showOnlyFavorites: false,
          showOnlyReadLater: false,
          feedId: undefined,
        },
      });
    });
    
    // Clear mocks
    jest.clearAllMocks();
  });
  
  test('should set articles for a feed', () => {
    const { result } = renderHook(() => useArticleStore());
    
    const newArticles = [
      {
        id: '1',
        title: 'Test Article 1',
        link: 'https://example.com/1',
        pubDate: 'Mon, 15 May 2023 14:30:00 GMT',
      },
      {
        id: '2',
        title: 'Test Article 2',
        link: 'https://example.com/2',
        pubDate: 'Tue, 16 May 2023 14:30:00 GMT',
      },
    ];
    
    act(() => {
      result.current.setArticles('feed1', newArticles);
    });
    
    // Verify articles were added
    expect(result.current.articles.length).toBe(2);
    expect(result.current.articles[0].feedId).toBe('feed1');
    expect(result.current.articles[0].isRead).toBe(false);
    expect(result.current.articles[0].isFavorite).toBe(false);
    expect(result.current.articles[0].isReadLater).toBe(false);
    
    // Verify dependencies were called
    expect(saveArticles).toHaveBeenCalled();
    expect(saveArticleStatus).toHaveBeenCalled();
  });
  
  test('should mark article as read', () => {
    const { result } = renderHook(() => useArticleStore());
    
    // Add articles first
    act(() => {
      result.current.setArticles('feed1', [
        {
          id: '1',
          title: 'Test Article 1',
          link: 'https://example.com/1',
          pubDate: 'Mon, 15 May 2023 14:30:00 GMT',
        },
      ]);
    });
    
    // Mark as read
    act(() => {
      result.current.markAsRead('1');
    });
    
    // Verify article was marked as read
    expect(result.current.articles[0].isRead).toBe(true);
    expect(saveArticleStatus).toHaveBeenCalled();
  });
  
  test('should mark article as unread', () => {
    const { result } = renderHook(() => useArticleStore());
    
    // Add articles first
    act(() => {
      result.current.setArticles('feed1', [
        {
          id: '1',
          title: 'Test Article 1',
          link: 'https://example.com/1',
          pubDate: 'Mon, 15 May 2023 14:30:00 GMT',
        },
      ]);
    });
    
    // Mark as read, then unread
    act(() => {
      result.current.markAsRead('1');
    });
    
    act(() => {
      result.current.markAsUnread('1');
    });
    
    // Verify article was marked as unread
    expect(result.current.articles[0].isRead).toBe(false);
    expect(saveArticleStatus).toHaveBeenCalledTimes(2);
  });
  
  test('should toggle favorite status', () => {
    const { result } = renderHook(() => useArticleStore());
    
    // Add articles first
    act(() => {
      result.current.setArticles('feed1', [
        {
          id: '1',
          title: 'Test Article 1',
          link: 'https://example.com/1',
          pubDate: 'Mon, 15 May 2023 14:30:00 GMT',
        },
      ]);
    });
    
    // Toggle favorite
    act(() => {
      result.current.toggleFavorite('1');
    });
    
    // Verify article was marked as favorite
    expect(result.current.articles[0].isFavorite).toBe(true);
    
    // Toggle again
    act(() => {
      result.current.toggleFavorite('1');
    });
    
    // Verify favorite status was toggled off
    expect(result.current.articles[0].isFavorite).toBe(false);
    expect(saveArticleStatus).toHaveBeenCalledTimes(2);
  });
  
  test('should toggle read later status', () => {
    const { result } = renderHook(() => useArticleStore());
    
    // Add articles first
    act(() => {
      result.current.setArticles('feed1', [
        {
          id: '1',
          title: 'Test Article 1',
          link: 'https://example.com/1',
          pubDate: 'Mon, 15 May 2023 14:30:00 GMT',
        },
      ]);
    });
    
    // Toggle read later
    act(() => {
      result.current.toggleReadLater('1');
    });
    
    // Verify article was marked for read later
    expect(result.current.articles[0].isReadLater).toBe(true);
    
    // Toggle again
    act(() => {
      result.current.toggleReadLater('1');
    });
    
    // Verify read later status was toggled off
    expect(result.current.articles[0].isReadLater).toBe(false);
    expect(saveArticleStatus).toHaveBeenCalledTimes(2);
  });
  
  test('should set filters', () => {
    const { result } = renderHook(() => useArticleStore());
    
    // Set filters
    act(() => {
      result.current.setFilters({ 
        searchTerm: 'test',
        showOnlyUnread: true,
      });
    });
    
    // Verify filters were set
    expect(result.current.filters.searchTerm).toBe('test');
    expect(result.current.filters.showOnlyUnread).toBe(true);
    expect(result.current.filters.showOnlyFavorites).toBe(false);
    
    // Add more filters
    act(() => {
      result.current.setFilters({ 
        showOnlyFavorites: true,
      });
    });
    
    // Verify filters were updated (not replaced)
    expect(result.current.filters.searchTerm).toBe('test');
    expect(result.current.filters.showOnlyUnread).toBe(true);
    expect(result.current.filters.showOnlyFavorites).toBe(true);
  });
  
  test('should clear filters', () => {
    const { result } = renderHook(() => useArticleStore());
    
    // Set filters
    act(() => {
      result.current.setFilters({ 
        searchTerm: 'test',
        showOnlyUnread: true,
        showOnlyFavorites: true,
      });
    });
    
    // Clear filters
    act(() => {
      result.current.clearFilters();
    });
    
    // Verify filters were cleared
    expect(result.current.filters.searchTerm).toBe('');
    expect(result.current.filters.showOnlyUnread).toBe(false);
    expect(result.current.filters.showOnlyFavorites).toBe(false);
    expect(result.current.filters.showOnlyReadLater).toBe(false);
    expect(result.current.filters.feedId).toBeUndefined();
  });
});