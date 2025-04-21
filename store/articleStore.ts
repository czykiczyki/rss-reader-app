import { create } from 'zustand';
import { Article, ArticleState, ArticleFilters } from '../types';
import { saveArticles, loadArticles, saveArticleStatus, loadArticleStatus } from '../services/storageService';

const DEFAULT_FILTERS: ArticleFilters = {
  searchTerm: '',
  showOnlyUnread: false,
  showOnlyFavorites: false,
  showOnlyReadLater: false,
  feedId: undefined,
};

export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  isLoading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  
  // Set articles for a specific feed
  setArticles: (feedId: string, newArticles) => {
    const { articles } = get();
    
    // Get existing article statuses for this feed
    const existingArticleMap = articles
      .filter(article => article.feedId === feedId)
      .reduce((map, article) => {
        map[article.id] = {
          isRead: article.isRead,
          isFavorite: article.isFavorite,
          isReadLater: article.isReadLater,
        };
        return map;
      }, {} as Record<string, { isRead: boolean; isFavorite: boolean; isReadLater: boolean }>);
    
    // Remove existing articles for this feed
    const otherArticles = articles.filter(article => article.feedId !== feedId);
    
    // Add new articles with preserved statuses or defaults
    const updatedArticles = [
      ...otherArticles,
      ...newArticles.map((article: any) => ({
        ...article,
        feedId,
        isRead: existingArticleMap[article.id]?.isRead || false,
        isFavorite: existingArticleMap[article.id]?.isFavorite || false,
        isReadLater: existingArticleMap[article.id]?.isReadLater || false,
      })),
    ];
    
    set({ articles: updatedArticles });
    
    // Save to storage
    saveArticles(updatedArticles).catch(err => {
      console.error('Error saving articles:', err);
    });
    
    saveArticleStatus(updatedArticles).catch(err => {
      console.error('Error saving article status:', err);
    });
  },
  
  // Mark an article as read
  markAsRead: (id: string) => {
    const { articles } = get();
    const updatedArticles = articles.map(article => 
      article.id === id ? { ...article, isRead: true } : article
    );
    
    set({ articles: updatedArticles });
    
    // Save status changes
    saveArticleStatus(updatedArticles).catch(err => {
      console.error('Error saving article status:', err);
    });
  },
  
  // Mark an article as unread
  markAsUnread: (id: string) => {
    const { articles } = get();
    const updatedArticles = articles.map(article => 
      article.id === id ? { ...article, isRead: false } : article
    );
    
    set({ articles: updatedArticles });
    
    // Save status changes
    saveArticleStatus(updatedArticles).catch(err => {
      console.error('Error saving article status:', err);
    });
  },
  
  // Toggle favorite status
  toggleFavorite: (id: string) => {
    const { articles } = get();
    const updatedArticles = articles.map(article => 
      article.id === id ? { ...article, isFavorite: !article.isFavorite } : article
    );
    
    set({ articles: updatedArticles });
    
    // Save status changes
    saveArticleStatus(updatedArticles).catch(err => {
      console.error('Error saving article status:', err);
    });
  },
  
  // Toggle read later status
  toggleReadLater: (id: string) => {
    const { articles } = get();
    const updatedArticles = articles.map(article => 
      article.id === id ? { ...article, isReadLater: !article.isReadLater } : article
    );
    
    set({ articles: updatedArticles });
    
    // Save status changes
    saveArticleStatus(updatedArticles).catch(err => {
      console.error('Error saving article status:', err);
    });
  },
  
  // Update filters
  setFilters: (filters: Partial<ArticleFilters>) => {
    set({ filters: { ...get().filters, ...filters } });
  },
  
  // Clear all filters
  clearFilters: () => {
    set({ filters: DEFAULT_FILTERS });
  },
}));

// Initialize articles from storage
export const initializeArticleStore = async (): Promise<void> => {
  try {
    // Load minimal article data
    const articleData = await loadArticles();
    // Load article statuses
    const statusData = await loadArticleStatus();
    
    if (articleData && articleData.length > 0) {
      // Combine data with statuses
      const fullArticles = articleData.map(article => ({
        ...article,
        isRead: statusData[article.id as string]?.isRead || false,
        isFavorite: statusData[article.id as string]?.isFavorite || false,
        isReadLater: statusData[article.id as string]?.isReadLater || false,
      })) as Article[];
      
      useArticleStore.setState({ articles: fullArticles });
    }
  } catch (error) {
    console.error('Error initializing article store:', error);
  }
};

export default { useArticleStore, initializeArticleStore };