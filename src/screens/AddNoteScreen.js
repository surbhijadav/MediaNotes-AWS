// src/screens/AddNoteScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export default function AddNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Pick Image from Gallery or Camera
  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'We need permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Supports images + videos
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    setIsSaving(true);

    try {
      const newNote = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        mediaUri: selectedMedia ? selectedMedia.uri : null,
        mediaType: selectedMedia ? selectedMedia.type : null,
        date: new Date().toISOString(),
      };

      // Save to AsyncStorage (Local Cache)
      const existingNotes = await AsyncStorage.getItem('notes');
      const notes = existingNotes ? JSON.parse(existingNotes) : [];
      
      notes.unshift(newNote); // Add new note at top
      
      await AsyncStorage.setItem('notes', JSON.stringify(notes));

      Alert.alert('Success', 'Note saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Note Title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your note here..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Media Upload Section */}
        <Text style={styles.label}>Media (Optional)</Text>
        <Pressable style={styles.mediaButton} onPress={pickMedia}>
          <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
          <Text style={styles.mediaButtonText}>
            {selectedMedia ? 'Change Media' : 'Upload Photo / Video'}
          </Text>
        </Pressable>

        {selectedMedia && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedMedia.uri }} style={styles.mediaPreview} />
            <Text style={styles.previewText}>Media Selected ✓</Text>
          </View>
        )}

        <Pressable 
          style={[styles.saveButton, isSaving && styles.disabledButton]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Note'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  form: { padding: 20 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    height: 160,
    textAlignVertical: 'top',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  mediaButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  previewText: {
    marginTop: 8,
    color: 'green',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});