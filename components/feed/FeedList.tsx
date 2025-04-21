import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AlertCircle, RefreshCw, Edit3, Trash2 } from 'lucide-react-native';

import { Feed } from '../../types';
import { useFeedStore } from '../../store/feedStore';
import { formatDate } from '../../utils/helpers';
import IconButton from '../ui/IconButton';
import EmptyState from '../ui/EmptyState';
import theme from '../../theme';

interface FeedListProps {
  onEditFeed?: (feed: Feed) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const FeedList: React.FC<FeedListProps> = ({ onEditFeed }) => {
  const router = useRouter();
  const { feeds, refreshFeed, refreshAllFeeds, deleteFeed, isLoading } = useFeedStore();
  
  const handleFeedPress = useCallback((feedId: string) => {
    router.push(`/feed/${feedId}`);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [router]);
  
  const handleRefreshFeed = useCallback((feed: Feed) => {
    refreshFeed(feed.id);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [refreshFeed]);
  
  const handleEditFeed = useCallback((feed: Feed) => {
    if (onEditFeed) {
      onEditFeed(feed);
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [onEditFeed]);
  
  const handleDeleteFeed = useCallback((feed: Feed) => {
    if (Platform.OS === 'web') {
      if (confirm(`Are you sure you want to delete "${feed.title}"?`)) {
        deleteFeed(feed.id);
      }
    } else {
      Alert.alert(
        'Delete Feed',
        `Are you sure you want to delete "${feed.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              deleteFeed(feed.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        ]
      );
    }
  }, [deleteFeed]);
  
  const renderFeedItem = useCallback(({ item, index }: { item: Feed; index: number }) => {
    return (
      <AnimatedView 
        entering={FadeIn.delay(index * 50).duration(300)}
        exiting={FadeOut.duration(200)}
        style={styles.feedItem}
      >
        <TouchableOpacity
          style={styles.feedContent}
          onPress={() => handleFeedPress(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.feedInfo}>
            <Text style={styles.feedTitle} numberOfLines={1}>
              {item.title}
            </Text>
            
            {item.lastUpdated && (
              <Text style={styles.feedUpdated}>
                Updated: {formatDate(item.lastUpdated)}
              </Text>
            )}
            
            {item.errorMessage && (
              <View style={styles.errorContainer}>
                <AlertCircle size={12} color={theme.colors.error.main} />
                <Text style={styles.errorText} numberOfLines={1}>
                  {item.errorMessage}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.feedActions}>
            <IconButton
              icon={<RefreshCw size={18} color={theme.colors.primary.main} />}
              onPress={() => handleRefreshFeed(item)}
              variant="ghost"
              size="small"
              style={styles.actionButton}
              disabled={isLoading || item.isLoading}
            />
            
            <IconButton
              icon={<Edit3 size={18} color={theme.colors.neutral.dark} />}
              onPress={() => handleEditFeed(item)}
              variant="ghost"
              size="small"
              style={styles.actionButton}
            />
            
            <IconButton
              icon={<Trash2 size={18} color={theme.colors.error.main} />}
              onPress={() => handleDeleteFeed(item)}
              variant="ghost"
              size="small"
              style={styles.actionButton}
            />
          </View>
        </TouchableOpacity>
      </AnimatedView>
    );
  }, [handleFeedPress, handleRefreshFeed, handleEditFeed, handleDeleteFeed, isLoading]);
  
  return (
    <FlatList
      data={feeds}
      keyExtractor={(item) => item.id}
      renderItem={renderFeedItem}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshAllFeeds}
          colors={[theme.colors.primary.main]}
          tintColor={theme.colors.primary.main}
        />
      }
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <EmptyState
          title="No feeds added yet"
          description="Add your first RSS feed to get started"
          icon="feed"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  feedItem: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.sm,
    overflow: 'hidden',
  },
  feedContent: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedInfo: {
    flex: 1,
  },
  feedTitle: {
    ...theme.textStyles.h4,
    color: theme.semanticColors.text.primary,
    marginBottom: 4,
  },
  feedUpdated: {
    ...theme.textStyles.caption,
    color: theme.semanticColors.text.tertiary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  errorText: {
    ...theme.textStyles.caption,
    color: theme.colors.error.main,
    marginLeft: 4,
  },
  feedActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: theme.spacing.xs,
  },
});

export default FeedList;