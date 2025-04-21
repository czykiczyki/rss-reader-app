import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Heart, Clock } from 'lucide-react-native';

import { Article } from '../../types';
import { formatDate, extractDomain, createSnippet } from '../../utils/helpers';
import { useArticleStore } from '../../store/articleStore';
import IconButton from '../ui/IconButton';
import theme from '../../theme';

interface ArticleCardProps {
  article: Article;
  showFeedInfo?: boolean;
  onLongPress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  showFeedInfo = true,
  onLongPress
}) => {
  const router = useRouter();
  const { markAsRead, toggleFavorite, toggleReadLater } = useArticleStore();
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  
  const handlePress = useCallback(() => {
    markAsRead(article.id);
    const encodedId = encodeURIComponent(article.id);
    router.push(`/article/${encodedId}`);
  }, [article.id, markAsRead, router]);
  
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 200 });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [scale]);
  
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 20, stiffness: 200 });
  }, [scale]);
  
  const handleFavoritePress = useCallback(() => {
    toggleFavorite(article.id);
    
    scale.value = withSpring(0.98, { damping: 20, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 20, stiffness: 200 });
    }, 200);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [article.id, toggleFavorite, scale]);
  
  const handleReadLaterPress = useCallback(() => {
    toggleReadLater(article.id);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [article.id, toggleReadLater]);
  
  // Get card background color based on read status
  const getCardBackground = useCallback(() => {
    if (article.isRead) {
      return theme.semanticColors.status.read;
    }
    return theme.semanticColors.background.primary;
  }, [article.isRead]);
  
  return (
    <AnimatedTouchable
      style={[styles.container, { backgroundColor: getCardBackground() }, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          {showFeedInfo && (
            <Text style={styles.source} numberOfLines={1}>
              {extractDomain(article.link)}
            </Text>
          )}
          <Text style={styles.date}>{formatDate(article.isoDate || article.pubDate)}</Text>
        </View>
        
        <View style={styles.mainContent}>
          <View style={styles.textContent}>
            <Text style={[styles.title, article.isRead && styles.readTitle]} numberOfLines={2}>
              {article.title}
            </Text>
            {article.contentSnippet && (
              <Text style={styles.snippet} numberOfLines={2}>
                {createSnippet(article.contentSnippet)}
              </Text>
            )}
          </View>
          
          {article.imageUrl && (
            <Image 
              source={{ uri: article.imageUrl }} 
              style={styles.thumbnail} 
              resizeMode="cover"
            />
          )}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            {article.isRead && (
              <View style={styles.readBadge}>
                <Text style={styles.readBadgeText}>Read</Text>
              </View>
            )}
            {article.isReadLater && (
              <View style={styles.readLaterBadge}>
                <Clock size={12} color={theme.colors.success.dark} />
                <Text style={styles.readLaterBadgeText}>Later</Text>
              </View>
            )}
          </View>
          
          <View style={styles.actions}>
            <IconButton
              icon={<Clock 
                size={18} 
                color={article.isReadLater ? theme.colors.success.main : theme.colors.neutral.dark} 
              />}
              onPress={handleReadLaterPress}
              variant="ghost"
              size="small"
              style={styles.actionButton}
            />
            
            <IconButton
              icon={<Heart 
                size={18}
                color={article.isFavorite ? theme.colors.accent.main : theme.colors.neutral.dark}
                fill={article.isFavorite ? theme.colors.accent.main : 'transparent'}
              />}
              onPress={handleFavoritePress}
              variant="ghost"
              size="small"
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.sm,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  source: {
    ...theme.textStyles.caption,
    color: theme.semanticColors.text.tertiary,
    flex: 1,
  },
  date: {
    ...theme.textStyles.caption,
    color: theme.semanticColors.text.tertiary,
    marginLeft: theme.spacing.xs,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    ...theme.textStyles.h4,
    marginBottom: theme.spacing.xxs,
    color: theme.semanticColors.text.primary,
  },
  readTitle: {
    color: theme.semanticColors.text.secondary,
  },
  snippet: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.tertiary,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.sm,
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readBadge: {
    backgroundColor: theme.colors.neutral.medium,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
  },
  readBadgeText: {
    ...theme.textStyles.caption,
    color: theme.colors.neutral.white,
  },
  readLaterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success.lightest,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  readLaterBadgeText: {
    ...theme.textStyles.caption,
    color: theme.colors.success.dark,
    marginLeft: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: theme.spacing.xs,
  },
});

export default ArticleCard;