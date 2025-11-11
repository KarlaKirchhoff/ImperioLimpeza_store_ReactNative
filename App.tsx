import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import Header from './src/components/Header';
import Home from './src/Screens/Home/Home_Screen';
import AuthScreens from './src/Screens/Autenticacao/Autenticacao';
import CadastrarProduto_Screen from './src/Screens/CadastrarProduto/CadastrarProduto_Screen';
import HomeScreen from './src/Screens/Home/Home_Screen';
import SobreNos_Screen from './src/Screens/SobreNos/SobreNos_Screen';
import Produto_Screen from './src/Screens/Produto/Produto_Screen';
import HistoricoPedidos_Screen from './src/Screens/HistoricoPedidos/HistoricoPedidos_Screen';
import CarrrinhoCompras_Screen from './src/Screens/CarrinhoCompras/CarrinhoCompras';

const produto = {
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

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Produto_Screen produto={produto} />
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
