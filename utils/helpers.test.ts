/**
 * Tests for helper utility functions
 */

import { formatDate, extractDomain, createSnippet, sortArticlesByDate, filterArticles } from './helpers';
import { Article } from '../types';

describe('formatDate', () => {
  test('should handle ISO date strings', () => {
    const isoDate = '2023-05-15T14:30:00Z';
    expect(formatDate(isoDate)).toContain('May 15, 2023');
  });
  
  test('should handle RFC date strings', () => {
    const rfcDate = 'Mon, 15 May 2023 14:30:00 GMT';
    expect(formatDate(rfcDate)).toContain('May 15, 2023');
  });
  
  test('should return "Unknown date" for undefined input', () => {
    expect(formatDate(undefined)).toBe('Unknown date');
  });
  
  test('should return "Invalid date" for malformed input', () => {
    expect(formatDate('not-a-date')).toBe('Invalid date');
  });
});

describe('extractDomain', () => {
  test('should extract domain from URL', () => {
    expect(extractDomain('https://www.example.com/article/123')).toBe('example.com');
  });
  
  test('should handle URLs without www prefix', () => {
    expect(extractDomain('https://example.com/article/123')).toBe('example.com');
  });
  
  test('should return the input if it is not a valid URL', () => {
    expect(extractDomain('not-a-url')).toBe('not-a-url');
  });
});

describe('createSnippet', () => {
  test('should create snippet with default length', () => {
    const html = '<p>This is a <strong>test</strong> paragraph with some HTML content that should be stripped out.</p>';
    const result = createSnippet(html);
    expect(result).toContain('This is a test paragraph');
    expect(result.length).toBeLessThanOrEqual(123); // 120 + '...'
  });
  
  test('should create snippet with custom length', () => {
    const html = '<p>This is a <strong>test</strong> paragraph with some HTML content.</p>';
    const result = createSnippet(html, 20);
    expect(result).toBe('This is a test parag...');
  });
  
  test('should return empty string for empty input', () => {
    expect(createSnippet('')).toBe('');
  });
});

describe('sortArticlesByDate', () => {
  const mockArticles: Article[] = [
    {
      id: '1',
      feedId: 'feed1',
      title: 'Article 1',
      link: 'https://example.com/1',
      pubDate: 'Mon, 15 May 2023 14:30:00 GMT',
      isoDate: '2023-05-15T14:30:00Z',
      isRead: false,
      isFavorite: false,
      isReadLater: false,
    },
    {
      id: '2',
      feedId: 'feed1',
      title: 'Article 2',
      link: 'https://example.com/2',
      pubDate: 'Tue, 16 May 2023 14:30:00 GMT',
      isoDate: '2023-05-16T14:30:00Z',
      isRead: false,
      isFavorite: false,
      isReadLater: false,
    },
    {
      id: '3',
      feedId: 'feed1',
      title: 'Article 3',
      link: 'https://example.com/3',
      pubDate: 'Sun, 14 May 2023 14:30:00 GMT',
      isoDate: '2023-05-14T14:30:00Z',
      isRead: false,
      isFavorite: false,
      isReadLater: false,
    },
  ];
  
  test('should sort articles by date (newest first)', () => {
    const sorted = sortArticlesByDate(mockArticles);
    expect(sorted[0].id).toBe('2'); // newest
    expect(sorted[1].id).toBe('1');
    expect(sorted[2].id).toBe('3'); // oldest
  });
});

describe('filterArticles', () => {
  const mockArticles: Article[] = [
    {
      id: '1',
      feedId: 'feed1',
      title: 'Article about React',
      link: 'https://example.com/1',
      pubDate: 'Mon, 15 May 2023 14:30:00 GMT',
      contentSnippet: 'This is about React',
      isRead: true,
      isFavorite: true,
      isReadLater: false,
    },
    {
      id: '2',
      feedId: 'feed2',
      title: 'Article about Vue',
      link: 'https://example.com/2',
      pubDate: 'Tue, 16 May 2023 14:30:00 GMT',
      contentSnippet: 'This is about Vue',
      isRead: false,
      isFavorite: false,
      isReadLater: true,
    },
    {
      id: '3',
      feedId: 'feed1',
      title: 'Article about Angular',
      link: 'https://example.com/3',
      pubDate: 'Sun, 14 May 2023 14:30:00 GMT',
      contentSnippet: 'This is about Angular',
      isRead: false,
      isFavorite: true,
      isReadLater: false,
    },
  ];
  
  test('should filter by search term in title', () => {
    const filtered = filterArticles(mockArticles, 'React', false, false, false);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('1');
  });
  
  test('should filter by search term in content', () => {
    const filtered = filterArticles(mockArticles, 'Vue', false, false, false);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('2');
  });
  
  test('should filter by unread status', () => {
    const filtered = filterArticles(mockArticles, '', true, false, false);
    expect(filtered.length).toBe(2);
    expect(filtered.map(a => a.id).sort()).toEqual(['2', '3']);
  });
  
  test('should filter by favorite status', () => {
    const filtered = filterArticles(mockArticles, '', false, true, false);
    expect(filtered.length).toBe(2);
    expect(filtered.map(a => a.id).sort()).toEqual(['1', '3']);
  });
  
  test('should filter by read later status', () => {
    const filtered = filterArticles(mockArticles, '', false, false, true);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('2');
  });
  
  test('should filter by feed id', () => {
    const filtered = filterArticles(mockArticles, '', false, false, false, 'feed1');
    expect(filtered.length).toBe(2);
    expect(filtered.map(a => a.id).sort()).toEqual(['1', '3']);
  });
  
  test('should combine multiple filters', () => {
    const filtered = filterArticles(mockArticles, '', true, true, false, 'feed1');
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('3'); // Unread + Favorite + feed1
  });
});