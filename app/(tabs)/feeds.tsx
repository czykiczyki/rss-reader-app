import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PlusCircle, X } from 'lucide-react-native';

import { Feed } from '../../types';
import FeedList from '../../components/feed/FeedList';
import FeedForm from '../../components/feed/FeedForm';
import theme from '../../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function FeedsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | undefined>(undefined);
  
  const fabScale = useSharedValue(1);
    
  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fabScale.value }],
    };
  });
  
  const openModal = (feed?: Feed) => {
    setSelectedFeed(feed);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setSelectedFeed(undefined);
  };
  
  const handleFabPress = () => {
    fabScale.value = withSpring(0.9, { damping: 10, stiffness: 200 });
    setTimeout(() => {
      fabScale.value = withSpring(1, { damping: 10, stiffness: 200 });
      openModal();
    }, 100);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FeedList onEditFeed={openModal} />
      
      <AnimatedTouchable
        style={[styles.fab, fabAnimatedStyle]}
        onPress={handleFabPress}
        activeOpacity={0.8}
      >
        <PlusCircle size={24} color="white" />
      </AnimatedTouchable>
      
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedFeed ? 'Edit Feed' : 'Add New Feed'}
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <X size={24} color={theme.colors.neutral.dark} />
              </TouchableOpacity>
            </View>
            
            <FeedForm 
              feed={selectedFeed} 
              isEditing={!!selectedFeed} 
              onComplete={closeModal}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background.secondary,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    ...theme.shadow.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
    padding: theme.spacing.md,
  },
  modalTitle: {
    ...theme.textStyles.h3,
    color: theme.semanticColors.text.primary,
  },
});