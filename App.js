import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Header from './src/components/Header';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <View>
        <Text>teste</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});
