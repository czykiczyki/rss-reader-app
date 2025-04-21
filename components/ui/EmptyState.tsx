import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rss, Search, BookMarked, Heart, Clock } from 'lucide-react-native';
import theme from '../../theme';

type IconType = 'feed' | 'search' | 'favorite' | 'readLater' | 'bookmark';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'feed',
}) => {
  const getIcon = () => {
    const iconSize = 64;
    const iconColor = theme.colors.neutral.medium;
    
    switch (icon) {
      case 'feed':
        return <Rss size={iconSize} color={iconColor} />;
      case 'search':
        return <Search size={iconSize} color={iconColor} />;
      case 'favorite':
        return <Heart size={iconSize} color={iconColor} />;
      case 'readLater':
        return <Clock size={iconSize} color={iconColor} />;
      case 'bookmark':
        return <BookMarked size={iconSize} color={iconColor} />;
      default:
        return <Rss size={iconSize} color={iconColor} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    height: 300,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
    opacity: 0.8,
  },
  title: {
    ...theme.textStyles.h3,
    color: theme.semanticColors.text.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...theme.textStyles.body1,
    color: theme.semanticColors.text.tertiary,
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default EmptyState;