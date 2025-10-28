import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Header from './src/components/Header';
import Home from './src/page/Home';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});
