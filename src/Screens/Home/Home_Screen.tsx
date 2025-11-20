// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Ionicons from "@expo/vector-icons/Ionicons";

import ProdutoStorage from "../../storage/ProdutoStorage"; const storage = new ProdutoStorage();
import { Produto } from "../CadastrarProduto/CadastrarProduto_Screen";
import CarrinhoStorage from "../../storage/CarrinhoStorage"; const carrinhoStorage = new CarrinhoStorage();

import type { CartItemType } from "../CarrinhoCompras/CarrinhoCompras";
import type { RootStackParamList } from "../../routes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type Props = {
  navigation: NavigationProp;
};

interface RenderItemProps {
  item: Produto;
}

export default function Home_Screen({ navigation }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // 🔹 Buscar os produtos salvos no AsyncStorage
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const produtosStorage = await storage.listar();
        setProdutos(produtosStorage);
      } catch (err) {
        console.error("Erro ao carregar produtos do AsyncStorage:", err);
      }
    };

    carregarProdutos();
  }, []);

  const handleAddCarrinho = async (produto: Produto) => {
    console.log('produto');
    console.log(produto);

    try {
      const carrinhoAtual = await carrinhoStorage.listar();
      console.log('carrinhoAtual');
      console.log(carrinhoAtual);

      const itens: CartItemType[] = carrinhoAtual.map((i: any) =>
        i.product ? i : { product: i, quantity: 1 }
      );

      // verifica se o produto já existe
      const jaExiste = itens.find((p) => p.product.cod === produto.cod);

      if (!jaExiste) {
        itens.push({ id: carrinhoAtual.length + 1 ,product: produto, quantity: 1 });
        await carrinhoStorage.atualzarLista(itens);
        Alert.alert("Produto adicionado ao carrinho:", produto.nome);
      } else {
        Alert.alert("Produto já está no carrinho:", produto.nome);
      }
    } catch (err) {
      Alert.alert("Erro ao adicionar ao carrinho", "Tente novamente mais tarde.");
      console.error("Erro ao adicionar ao carrinho", err);
    }
  };


  const handleFavoritar = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleVerProduto = (id: string) => {
    console.log(`Visualizar produto ${id}`);
  };

  const renderItem = ({ item }: RenderItemProps) => {
    const isFavorito = favoritos.includes(item.cod);

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imagem }} style={styles.image} />
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.viewButton]}
            onPress={() => navigation.navigate("InfoProduto", item)}
          >
            <Ionicons name="eye" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cartButton]}
            onPress={() => handleAddCarrinho(item)}
          >
            <Ionicons name="cart" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isFavorito ? "#e63946" : "#457b9d" },
            ]}
            onPress={() => handleFavoritar(item.cod)}
          >
            <Ionicons
              name={isFavorito ? "heart" : "heart-outline"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧴 Império da Limpeza</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.cod}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#1d3557",
  },
  list: {
    paddingBottom: 50,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  nome: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#333",
    marginBottom: 5,
  },
  preco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d3557",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    padding: 8,
    borderRadius: 8,
  },
  viewButton: {
    backgroundColor: "#2a9d8f",
  },
  cartButton: {
    backgroundColor: "#e9c46a",
  },
});