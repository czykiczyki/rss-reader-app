import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Link2 } from 'lucide-react-native';

import { Feed } from '../../types';
import { useFeedStore } from '../../store/feedStore';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import theme from '../../theme';

interface FeedFormProps {
  feed?: Feed;
  isEditing?: boolean;
  onComplete?: () => void;
}

export const FeedForm: React.FC<FeedFormProps> = ({ 
  feed, 
  isEditing = false,
  onComplete,
}) => {
  const { addFeed, updateFeed, isLoading, error } = useFeedStore();
  
  const [title, setTitle] = useState(feed?.title || '');
  const [url, setUrl] = useState(feed?.url || '');
  const [formError, setFormError] = useState({
    title: '',
    url: '',
  });
  
  const validateForm = (): boolean => {
    let valid = true;
    const errors = {
      title: '',
      url: '',
    };
    
    if (!title.trim()) {
      errors.title = 'Title is required';
      valid = false;
    }
    
    if (!url.trim()) {
      errors.url = 'URL is required';
      valid = false;
    } else {
      try {
        new URL(url);
      } catch (e) {
        errors.url = 'Please enter a valid URL';
        valid = false;
      }
    }
    
    setFormError(errors);
    return valid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (isEditing && feed) {
      updateFeed(feed.id, { title, url });
      if (onComplete) onComplete();
    } else {
      await addFeed(url, title);
      if (!error && onComplete) onComplete();
    }
  };
  
  const handleCancel = () => {
    if (onComplete) onComplete();
  };
  
  return (
    <View 
      style={styles.container}
    >
      <TextInput
        label="Feed Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter feed title"
        error={formError.title}
        autoCapitalize="words"
      />
      
      <TextInput
        label="Feed URL"
        value={url}
        onChangeText={setUrl}
        placeholder="https://example.com/rss"
        error={formError.url || (error ? error : '')}
        autoCapitalize="none"
        keyboardType="url"
        leftIcon={<Link2 size={18} color={theme.colors.neutral.dark} />}
      />
      
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="secondary"
          style={styles.cancelButton}
        />
        
        <Button
          title={isEditing ? "Update Feed" : "Add Feed"}
          onPress={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.lg,
  },
  cancelButton: {
    marginRight: theme.spacing.md,
  },
  submitButton: {
    minWidth: 120,
  },
});

export default FeedForm;