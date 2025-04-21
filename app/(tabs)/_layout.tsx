import React from 'react';
import { Tabs } from 'expo-router';
import { Rss, Search, Bookmark, Settings } from 'lucide-react-native';
import theme from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.neutral.dark,
        tabBarStyle: {
          borderTopColor: theme.colors.neutral.light,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: theme.colors.neutral.white,
        },
        headerTitleStyle: {
          ...theme.textStyles.h3,
          color: theme.semanticColors.text.primary,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'All Articles',
          tabBarIcon: ({ color, size }) => <Rss color={color} size={size} />,
          headerTitle: 'RSS Reader',
        }}
      />
      
      <Tabs.Screen
        name="feeds"
        options={{
          title: 'Feeds',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          headerTitle: 'Manage Feeds',
        }}
      />
      
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size} />,
          headerTitle: 'Saved Articles',
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          headerTitle: 'Search Articles',
        }}
      />
    </Tabs>
  );
}