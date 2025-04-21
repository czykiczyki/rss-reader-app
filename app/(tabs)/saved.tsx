import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Heart, Clock } from 'lucide-react-native';

import ArticleList from '../../components/article/ArticleList';
import theme from '../../theme';

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'readLater'>('favorites');
  
  const handleTabChange = (tab: 'favorites' | 'readLater') => {
    setActiveTab(tab);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'favorites' && styles.activeTab
          ]}
          onPress={() => handleTabChange('favorites')}
          activeOpacity={0.7}
        >
          <Heart 
            size={18} 
            color={activeTab === 'favorites' ? theme.colors.accent.main : theme.colors.neutral.dark} 
            fill={activeTab === 'favorites' ? theme.colors.accent.main : 'transparent'}
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'favorites' && styles.activeTabText
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'readLater' && styles.activeTab
          ]}
          onPress={() => handleTabChange('readLater')}
          activeOpacity={0.7}
        >
          <Clock 
            size={18} 
            color={activeTab === 'readLater' ? theme.colors.success.main : theme.colors.neutral.dark}
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'readLater' && styles.activeReadLaterText
            ]}
          >
            Read Later
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'favorites' ? (
        <ArticleList showOnlyFavorites={true} />
      ) : (
        <ArticleList showOnlyReadLater={true} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background.secondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.neutral.white,
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xxs,
  },
  activeTab: {
    backgroundColor: theme.colors.neutral.lightest,
  },
  tabText: {
    ...theme.textStyles.body1,
    color: theme.colors.neutral.dark,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium as any,
  },
  activeTabText: {
    color: theme.colors.accent.main,
  },
  activeReadLaterText: {
    color: theme.colors.success.main,
  },
});