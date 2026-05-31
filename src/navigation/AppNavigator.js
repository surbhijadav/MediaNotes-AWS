// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'MediaNotes' }} 
        />
        
        <Stack.Screen 
          name="AddNote" 
          component={AddNoteScreen} 
          options={{ title: 'New Note' }} 
        />
        
        <Stack.Screen 
          name="NoteDetail" 
          component={NoteDetailScreen} 
          options={{ title: 'Note Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}