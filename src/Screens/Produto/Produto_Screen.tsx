import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native';

import type { Produto } from "../CadastrarProduto/CadastrarProduto_Screen";

type RootStackParamList = {
  InfoProduto: { produto: Produto };
};

type InfoProdutoRouteProp = RouteProp<RootStackParamList, 'InfoProduto'>;

// Página principal
export default function Produto_Screen() {
  const route = useRoute<InfoProdutoRouteProp>();
  const { produto } = route.params

  let estoque = 20

  const [quantidade, setQuantidade] = useState(1);
  const [favorito, setFavorito] = useState(false);

  const precoTotal = (produto.preco * quantidade).toFixed(2);

  // importar a quantidade do estoque via API
  const aumentarQtd = () => {
    if (quantidade < estoque) setQuantidade(quantidade + 1);
    else Alert.alert("Aviso", "Quantidade máxima em estoque atingida!");
  };

  const diminuirQtd = () => {
    if (quantidade > 1) setQuantidade(quantidade - 1);
  };

  const handleAddFavorito = () => {
    setFavorito(!favorito);
    Alert.alert(
      favorito ? "Removido dos Favoritos" : "Adicionado aos Favoritos"
    );
  };

  const handleAddCarrinho = () => {
    Alert.alert(
      "Adicionado ao Carrinho",
      `${quantidade}x ${produto.nome} - Total: R$ ${precoTotal}`
    );
    // Aqui entraria a lógica para salvar no carrinho (AsyncStorage)
  };

  return (
    <View style={styles.container}>
      <ProdutoInfo_Component produto={produto} />

      <View style={styles.qtdContainer}>
        <TouchableOpacity
          style={styles.btnQtd}
          onPress={diminuirQtd}
          disabled={quantidade === 1}
        >
          <Text style={styles.textBtn}>−</Text>
        </TouchableOpacity>

        <Text style={styles.qtdTexto}>{quantidade}</Text>

        <TouchableOpacity
          style={styles.btnQtd}
          onPress={aumentarQtd}
          disabled={quantidade === estoque}
        >
          <Text style={styles.textBtn}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.total}>💰 Total: R$ {precoTotal}</Text>

      <View style={styles.btnsContainer}>
        <TouchableOpacity
          style={[styles.btnFavorito, favorito && styles.btnFavoritoAtivo]}
          onPress={handleAddFavorito}
        >
          <Text style={styles.textBtnAcao}>
            {favorito ? "❤️ Favoritado" : "🤍 Add Favoritos"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnCarrinho} onPress={handleAddCarrinho}>
          <Text style={styles.textBtnAcao}>🛒 Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------- COMPONENTE PRODUTO ----------------
interface ProdutoInfoProps {
  produto: Produto;
}

const ProdutoInfo_Component: React.FC<ProdutoInfoProps> = ({ produto }) => {

  const termos = produto.termos_pesquisa.split("#")
    .map(item => item.trim())
    .filter(item => item.length > 0);

  return (
    <View style={styles.produtoContainer}>
      <Image source={{ uri: produto.imagem }} style={styles.imgProduto} />

      <Text style={styles.nomeProduto}>{produto.nome}</Text>
      <Text style={styles.marcaProduto}>Marca: {produto.marca}</Text>

      {produto.descricao && (
        <Text style={styles.descricao}>
          {produto.descricao.slice(0, 250)}
        </Text>
      )}

      <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>

      <View style={styles.termosContainer}>
        {termos.map((t: string, index: number) => (
          <Text key={index} style={styles.termo}>
            {t}
          </Text>
        ))}
      </View>
    </View>
  );
};

// ---------------- ESTILOS ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  produtoContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  imgProduto: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 10,
  },
  nomeProduto: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  marcaProduto: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  preco: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 10,
  },
  termosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  termo: {
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 4,
    fontSize: 13,
  },
  qtdContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  btnQtd: {
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  textBtn: {
    fontSize: 20,
    fontWeight: "bold",
  },
  qtdTexto: {
    fontSize: 18,
    fontWeight: "600",
  },
  total: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  btnsContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  btnFavorito: {
    backgroundColor: "#8f9b8fff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  btnFavoritoAtivo: {
    backgroundColor: "#FFCDD2",
  },
  btnCarrinho: {
    backgroundColor: "#388E3C",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  textBtnAcao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
