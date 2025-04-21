import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { RefreshCw, FileEdit, ArrowLeft } from 'lucide-react-native';

import { useFeedStore } from '../../store/feedStore';
import ArticleList from '../../components/article/ArticleList';
import IconButton from '../../components/ui/IconButton';
import theme from '../../theme';
import Modal from 'react-native-modal';
import FeedForm from '../../components/feed/FeedForm';

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { feeds, refreshFeed } = useFeedStore();
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const feed = feeds.find(f => f.id === id);
  
  useEffect(() => {
    if (!feed) {
      // Feed not found, go back
      router.back();
    }
  }, [feed, router]);
  
  const handleRefresh = async () => {
    if (!feed) return;
    
    setIsRefreshing(true);
    
    try {
      await refreshFeed(feed.id);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error refreshing feed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const toggleEditModal = () => {
    setIsEditModalVisible(!isEditModalVisible);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGoBack = () => {
    router.back();
  };
  
  if (!feed) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
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
        <View style={styles.headerRow}>
          <View style={styles.feedInfo}>
            <Text style={styles.feedTitle} numberOfLines={1}>
              {feed.title}
            </Text>
            {feed.description && (
              <Text style={styles.feedDescription} numberOfLines={2}>
                {feed.description}
              </Text>
            )}
          </View>
          
          <View style={styles.headerActions}>
            <IconButton
              icon={<FileEdit size={20} color={theme.colors.neutral.dark} />}
              onPress={toggleEditModal}
              variant="ghost"
              size="small"
              style={styles.actionButton}
            />
            
            <IconButton
              icon={<RefreshCw size={20} color={theme.colors.primary.main} />}
              onPress={handleRefresh}
              variant="ghost"
              size="small"
              style={styles.actionButton}
              disabled={isRefreshing}
            />
          </View>
        </View>
      </SafeAreaView>
      
      <ArticleList 
        feedId={feed.id}
        showFeedInfo={false}
      />
      
      <Modal
        isVisible={isEditModalVisible}
        onBackdropPress={toggleEditModal}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Feed</Text>
          <FeedForm 
            feed={feed} 
            isEditing={true} 
            onComplete={toggleEditModal}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: theme.colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  headerRow: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  feedTitle: {
    ...theme.textStyles.h3,
    color: theme.semanticColors.text.primary,
    marginBottom: 2,
  },
  feedDescription: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.tertiary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: theme.spacing.xs,
  },
  modal: {
    justifyContent: 'center',
    margin: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadow.md,
  },
  modalTitle: {
    ...theme.textStyles.h3,
    color: theme.semanticColors.text.primary,
    marginBottom: theme.spacing.md,
  },
});