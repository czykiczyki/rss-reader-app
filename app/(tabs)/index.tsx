import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Filter, SearchIcon, X } from 'lucide-react-native';

import ArticleList from '@/components/article/ArticleList';
import theme from '@/theme';
import IconButton from '@/components/ui/IconButton';
import TextInput from '@/components/ui/TextInput';
const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Animation for the search input
  const inputShake = useSharedValue(0);
  
  const inputAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: inputShake.value }],
    };
  });
  
  // Debounce search term
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  // Animation for filter drawer
  const filterHeight = useSharedValue(0);
  
  const filterStyle = useAnimatedStyle(() => {
    return {
      height: filterHeight.value,
      opacity: filterHeight.value > 0 ? 1 : 0,
    };
  });
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    filterHeight.value = withTiming(isFilterOpen ? 0 : 80, { duration: 300 });
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const toggleUnreadFilter = () => {
    setShowOnlyUnread(!showOnlyUnread);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Animated.View style={[styles.inputWrapper, inputAnimatedStyle]}>
          <TextInput
            placeholder="Search articles..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            leftIcon={<SearchIcon size={18} color={theme.colors.neutral.dark} />}
            rightIcon={
              searchTerm ? (
                <IconButton
                  icon={<X size={16} color={theme.colors.neutral.dark} />}
                  onPress={handleClearSearch}
                  variant="ghost"
                  size="small"
                />
              ) : null
            }
            containerStyle={styles.searchInput}
          />
        </Animated.View>
      </View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilter}
          activeOpacity={0.7}
        >
          <Filter 
            size={20} 
            color={isFilterOpen ? theme.colors.primary.main : theme.colors.neutral.dark} 
          />
          <Text style={[
            styles.filterText,
            isFilterOpen && styles.filterTextActive
          ]}>
            Filters
          </Text>
        </TouchableOpacity>
      </View>
      
      <AnimatedView style={[styles.filterContainer, filterStyle]}>
        <TouchableOpacity
          style={[
            styles.filterOption,
            showOnlyUnread && styles.filterOptionActive
          ]}
          onPress={toggleUnreadFilter}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.filterOptionText,
            showOnlyUnread && styles.filterOptionTextActive
          ]}>
            Unread Only
          </Text>
        </TouchableOpacity>
      </AnimatedView>
      <ArticleList 
        showFeedInfo={true}
        searchTerm={debouncedSearchTerm}
        showOnlyUnread={showOnlyUnread}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background.secondary,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xxs,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.white,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  filterText: {
    ...theme.textStyles.body2,
    color: theme.colors.neutral.dark,
    marginLeft: theme.spacing.xxs,
  },
  filterTextActive: {
    color: theme.colors.primary.main,
    fontWeight: theme.fontWeight.medium as any,
  },
  filterContainer: {
    backgroundColor: theme.colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
    overflow: 'hidden',
  },
  filterOption: {
    margin: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.lighter,
    marginRight: theme.spacing.sm,
  },
  filterOptionActive: {
    backgroundColor: theme.colors.primary.lightest,
  },
  filterOptionText: {
    ...theme.textStyles.body2,
    color: theme.colors.neutral.dark,
  },
  filterOptionTextActive: {
    color: theme.colors.primary.dark,
    fontWeight: theme.fontWeight.medium as any,
  },
  searchContainer: {
    backgroundColor: theme.colors.neutral.white,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
});