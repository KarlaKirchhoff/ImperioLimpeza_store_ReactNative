import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import img from "../../../assets/icon.png"

export default function CardProduto_Component({produto}){
    return (
        <View>
            <Image style={styles.img} src={img}/>
            <View style={styles.infoProduto}>
                <Text style={styles.nome}>{produto.nome}</Text>
                <Text style={styles.preco}>{produto.preco}</Text>
            </View>
            <View>
                <TextInput style={styles.input}>0</TextInput>
                <TouchableOpacity style={styles.btnAdicionar}>Adicionar</TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
  },
});