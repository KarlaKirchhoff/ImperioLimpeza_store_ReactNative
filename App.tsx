import 'react-native-reanimated';
import { enableScreens } from 'react-native-screens';
enableScreens();
import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/routes';
import Home_Screen from './src/Screens/Home/Home_Screen';
import HistoricoPedidos_Screen from './src/Screens/HistoricoPedidos/HistoricoPedidos_Screen';
import AuthScreens from './src/Screens/Autenticacao/Autenticacao';
import Produto_Screen from './src/Screens/Produto/Produto_Screen';

/* const produto = {
  cod: 'string',
  nome: 'string',
  marca: 'string',
  preco: 90,
  termos_pesquisa: "#limpeza_azul#multiuso", // exemplo: "#limpeza_azul#multiuso"
  descricao: 'string',
  dt_criacao: '2020-01-12', // ISO string
  categorias: [{id: '1', nome: "limpeza"}, {id: '2', nome: "casa"}],
  imagem: '' // uri local do arquivo redimensionado
}
 */
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

