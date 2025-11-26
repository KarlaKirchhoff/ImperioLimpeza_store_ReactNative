import 'react-native-reanimated';
import { enableScreens } from 'react-native-screens';
enableScreens();
import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/routes';

export default function App(){
  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // adicione uma cor de fundo padrão
  },
});

