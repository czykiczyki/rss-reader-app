import React, { useCallback, useState } from 'react';
import { 
  FlatList, 
  View, 
  StyleSheet, 
  RefreshControl, 
  Text,
  ActivityIndicator 
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { sortArticlesByDate, filterArticles } from '../../utils/helpers';
import { useArticleStore } from '../../store/articleStore';
import { useFeedStore } from '../../store/feedStore';

import ArticleCard from './ArticleCard';
import EmptyState from '../ui/EmptyState';
import theme from '../../theme';

interface ArticleListProps {
  showFeedInfo?: boolean;
  feedId?: string;
  showOnlyFavorites?: boolean;
  showOnlyReadLater?: boolean;
  showOnlyUnread?: boolean;
  searchTerm?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const ArticleList: React.FC<ArticleListProps> = ({ 
  showFeedInfo = true,
  feedId,
  showOnlyFavorites = false,
  showOnlyReadLater = false,
  showOnlyUnread = false,
  searchTerm = '',
}) => {
  const { articles, isLoading: isArticlesLoading } = useArticleStore();
  const { refreshAllFeeds, refreshFeed, isLoading: isRefreshing } = useFeedStore();
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleItems, setVisibleItems] = useState(20); // Start with 20 items
  
  const filteredArticles = React.useMemo(() => {
    const filtered = filterArticles(
      articles,
      searchTerm,
      showOnlyUnread,
      showOnlyFavorites,
      showOnlyReadLater,
      feedId
    );
    return sortArticlesByDate(filtered);
  }, [
    articles,
    searchTerm,
    showOnlyUnread,
    showOnlyFavorites,
    showOnlyReadLater,
    feedId,
  ]);
  
  // Get the articles to display based on the visible items limit
  const displayedArticles = React.useMemo(() => {
    return filteredArticles.slice(0, visibleItems);
  }, [filteredArticles, visibleItems]);
  
  const handleRefresh = useCallback(() => {
    if (feedId) {
      refreshFeed(feedId);
    } else {
      refreshAllFeeds();
    }
  }, [feedId, refreshFeed, refreshAllFeeds]);
  
  const handleLoadMore = useCallback(() => {
    if (displayedArticles.length < filteredArticles.length) {
      setIsLoadingMore(true);
        setVisibleItems(prev => prev + 20); // Load 20 more items
        setIsLoadingMore(false);
    }
  }, [displayedArticles.length, filteredArticles.length]);
  
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary.main} />
      </View>
    );
  }, [isLoadingMore]);
  
  const renderEmptyState = useCallback(() => {
    if (isArticlesLoading || isRefreshing) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      );
    }
    
    return (
      <EmptyState
        title="No articles found"
        description={searchTerm ? "Try adjusting your search term" : "Add new feeds to get started"}
        icon="feed"
      />
    );
  }, [isArticlesLoading, isRefreshing, searchTerm]);
  
  return (
    <FlatList
      data={displayedArticles}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <AnimatedView 
          entering={FadeIn.delay(index * 50).duration(300)} 
          exiting={FadeOut.duration(200)}
        >
          <ArticleCard
            article={item}
            showFeedInfo={showFeedInfo}
          />
        </AnimatedView>
      )}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={renderEmptyState}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary.main]}
          tintColor={theme.colors.primary.main}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  loadingText: {
    ...theme.textStyles.body1,
    color: theme.semanticColors.text.secondary,
    marginTop: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
});

export default ArticleList;