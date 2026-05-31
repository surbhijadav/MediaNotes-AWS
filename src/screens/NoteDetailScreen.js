// src/screens/NoteDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NoteDetailScreen({ route, navigation }) {
  const { note } = route.params;
  const [showMedia, setShowMedia] = useState(false);
  const [currentNote, setCurrentNote] = useState(note);

  useEffect(() => {
    navigation.setOptions({ title: currentNote.title });
  }, [currentNote.title]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const savedNotes = await AsyncStorage.getItem('notes');
              let notes = savedNotes ? JSON.parse(savedNotes) : [];
              
              notes = notes.filter(n => n.id !== currentNote.id);
              
              await AsyncStorage.setItem('notes', JSON.stringify(notes));
              
              Alert.alert('Deleted', 'Note deleted successfully');
              navigation.goBack(); 
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  const toggleMedia = () => setShowMedia(!showMedia);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{currentNote.title}</Text>
        <Text style={styles.date}>
          Created: {new Date(currentNote.date).toLocaleString()}
        </Text>

        {currentNote.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{currentNote.description}</Text>
          </View>
        ) : null}

        {currentNote.mediaUri ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attached Media</Text>
            
            <Pressable style={styles.showMediaButton} onPress={toggleMedia}>
              <Ionicons name={showMedia ? "eye-off-outline" : "eye-outline"} size={20} color="#fff" />
              <Text style={styles.showMediaText}>
                {showMedia ? 'Hide Media' : 'Show Media'}
              </Text>
            </Pressable>

            {showMedia && (
              <View style={styles.mediaContainer}>
                <Image 
                  source={{ uri: currentNote.mediaUri }} 
                  style={styles.mediaFull} 
                  resizeMode="contain"
                />
                <Text style={styles.webNote}>
                  📝 On Web browser, media preview may not work properly. 
                  It will work fine on Android app.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.noMedia}>No media attached</Text>
        )}

        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Delete Note</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  date: { fontSize: 14, color: Colors.textLight, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  showMediaButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  showMediaText: { color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 16 },
  mediaContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mediaFull: { width: '100%', height: 320, borderRadius: 8 },
  webNote: {
    textAlign: 'center',
    fontSize: 13,
    color: '#f59e0b',
    marginTop: 10,
    fontStyle: 'italic',
  },
  noMedia: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
  },
  deleteButtonText: { color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 16 },
});