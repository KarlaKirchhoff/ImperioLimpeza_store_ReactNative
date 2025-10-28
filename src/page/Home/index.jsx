import { FlatList, View, StyleSheet, Text } from 'react-native';
import CardProduto from '../../components/CardProduto';
import produtos from '../../storage/produtos.json';

export default function Home_Page() {
    return (
        <FlatList
            data={produtos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CardProduto produto={item} />}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.titulo}>🧽 Produtos de Limpeza</Text>
                    <Text style={styles.subtitulo}>
                        Confira nossa seleção completa de produtos para deixar sua casa brilhando!
                    </Text>
                </View>
            }
            ListFooterComponent={
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 - Imperio da Limpeza Ltda.</Text>
                </View>
            }
            contentContainerStyle={styles.listaConteudo}
        />
    );
}

const styles = StyleSheet.create({
    container: {
    },
}); 