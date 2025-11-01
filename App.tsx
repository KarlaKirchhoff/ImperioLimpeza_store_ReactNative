import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import Header from './src/components/Header';
import Home from './src/page/Home';
import AuthScreens from './src/page/Autenticacao/index';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AuthScreens />
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

export default App;
