import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import Header from './src/components/Header';
import Home from './src/Screens/Home';
import AuthScreens from './src/Screens/Autenticacao/Autenticacao';
import CadastrarProduto_Screen from './src/Screens/CadastrarProduto/CadastrarProduto_Screen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CadastrarProduto_Screen />
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
