import React from 'react';
import 'react-native-reanimated';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/routes';

enableScreens();

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
const App: React.FC = () => {
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

export default App;
