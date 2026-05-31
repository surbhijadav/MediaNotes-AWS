// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      let parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];

      // Fix old notes that don't have proper date
      parsedNotes = parsedNotes.map(note => ({
        ...note,
        date: note.date || new Date().toISOString(),
      }));

      setNotes(parsedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    loadNotes(); // Initial load

    return unsubscribe;
  }, [navigation]);

  const renderNote = ({ item }) => {
    let formattedDate = 'Unknown date';
    try {
      formattedDate = format(new Date(item.date), 'dd MMM yyyy, hh:mm a');
    } catch (e) {
      formattedDate = 'Invalid date';
    }

    return (
      <TouchableOpacity 
        style={styles.noteCard}
        onPress={() => navigation.navigate('NoteDetail', { note: item })}
      >
        <Text style={styles.noteTitle}>{item.title}</Text>
        
        {item.description ? (
          <Text style={styles.noteDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        {item.mediaUri && (
          <View style={styles.mediaTag}>
            <Ionicons name="image-outline" size={14} color="#3b82f6" />
            <Text style={styles.mediaTagText}>Media Attached</Text>
          </View>
        )}

        <Text style={styles.noteDate}>{formattedDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes ({notes.length})</Text>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text>Loading notes...</Text>
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={80} color="#cbd5e1" />
          <Text style={styles.emptyText}>No notes yet</Text>
          <Text style={styles.emptySubtext}>Create your first media note</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddNote')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
  },
  list: {
    padding: 16,
  },
  noteCard: {
    backgroundColor: Colors.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  noteDescription: {
    fontSize: 15,
    color: Colors.textLight,
    marginBottom: 10,
  },
  mediaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  mediaTagText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // Replace old shadow with this:
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
  },
});