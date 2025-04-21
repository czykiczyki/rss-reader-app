import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { WebView } from 'react-native-webview';
import { Heart, ExternalLink, Clock, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useArticleStore } from '../../store/articleStore';
import { formatDate } from '../../utils/helpers';
import IconButton from '../../components/ui/IconButton';
import theme from '../../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { articles, toggleFavorite, toggleReadLater } = useArticleStore();
  const article = articles.find((a) => a.id === id);
  
  
  const handleToggleFavorite = () => {
    if (article) {
      toggleFavorite(article.id);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };
  
  const handleToggleReadLater = () => {
    if (article) {
      toggleReadLater(article.id);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  const handleOpenOriginal = () => {
    if (article && article.link) {
      if (Platform.OS === 'web') {
        window.open(article.link, '_blank');
      } else {
        Linking.openURL(article.link);
      }
    }
  };

  const handleGoBack = () => {
    router.back();
  };
  
  if (!article) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Article not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Create sanitized content for WebView
  const sanitizedContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #1F2937;
            padding: 16px;
            margin: 0;
            font-size: 16px;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
          }
          a {
            color: #3B82F6;
            text-decoration: none;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #111827;
          }
          pre, code {
            background-color: #F3F4F6;
            border-radius: 4px;
            padding: 8px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        ${article.content || ''}
      </body>
    </html>
  `;
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AnimatedView 
        entering={FadeIn.duration(400)} 
        style={styles.contentContainer}
      >
        <IconButton
          icon={<ArrowLeft 
            size={24}
            color={theme.colors.neutral.dark}
          />}
          onPress={handleGoBack}
          variant="ghost"
          size="medium"
          style={styles.actionButton}
        />
        <View style={styles.article}>
          <Text style={styles.articleDate}>
            {formatDate(article.isoDate || article.pubDate)}
          </Text>
          
          <Text style={styles.articleTitle}>
            {article.title}
          </Text>
          
          {article.author && (
            <Text style={styles.articleAuthor}>
              By {article.author}
            </Text>
          )}
          
          <View style={styles.actionButtons}>
            <IconButton
              icon={<Heart 
                size={24}
                color={article.isFavorite ? theme.colors.accent.main : theme.colors.neutral.dark}
                fill={article.isFavorite ? theme.colors.accent.main : 'transparent'}
              />}
              onPress={handleToggleFavorite}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
            
            <IconButton
              icon={<Clock 
                size={24} 
                color={article.isReadLater ? theme.colors.success.main : theme.colors.neutral.dark} 
              />}
              onPress={handleToggleReadLater}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
            
            <IconButton
              icon={<ExternalLink size={24} color={theme.colors.primary.main} />}
              onPress={handleOpenOriginal}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
          </View>
        </View>
        
        <View style={styles.webViewContainer}>
          <WebView
            source={{ html: sanitizedContent }}
            style={styles.webView}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </AnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.white,
  },
  contentContainer: {
    flex: 1,
  },
  article: {
    flexGrow: 0,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
  },
  webView: {
    flex: 1,
  },
  articleDate: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.tertiary,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  articleTitle: {
    ...theme.textStyles.h2,
    color: theme.semanticColors.text.primary,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  articleAuthor: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.secondary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  articleImage: {
    width: '100%',
    height: 200,
    marginBottom: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  actionButton: {
    marginHorizontal: theme.spacing.xs,
  },
  errorText: {
    ...theme.textStyles.h3,
    color: theme.semanticColors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  backButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
  },
  backButtonText: {
    ...theme.textStyles.button,
    color: theme.colors.neutral.white,
  },
});