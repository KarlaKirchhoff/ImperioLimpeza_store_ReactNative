// src/pages/Home.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
}

const produtosIniciais: Produto[] = [
  {
    id: "1",
    nome: "Detergente Neutro 500ml",
    preco: 3.5,
    imagem:
      "https://cdn.awsli.com.br/600x450/1079/1079397/produto/47156309/301d0c3b8b.jpg",
  },
  {
    id: "2",
    nome: "Desinfetante Lavanda 2L",
    preco: 8.9,
    imagem:
      "https://cdn.awsli.com.br/600x450/1079/1079397/produto/47156312/6c66e23a8a.jpg",
  },
  {
    id: "3",
    nome: "Sabão em Pó 1kg",
    preco: 12.99,
    imagem:
      "https://cdn.awsli.com.br/600x450/1079/1079397/produto/47156322/fd14f293b7.jpg",
  },
];

export default function HomeScreen() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const handleAddCarrinho = (id: string) => {
    console.log(`Produto ${id} adicionado ao carrinho`);
  };

  const handleFavoritar = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleVerProduto = (id: string) => {
    console.log(`Visualizar produto ${id}`);
  };

  const renderItem = ({ item }: { item: Produto }) => {
    const isFavorito = favoritos.includes(item.id);

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imagem }} style={styles.image} />
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.viewButton]}
            onPress={() => handleVerProduto(item.id)}
          >
            <Ionicons name="eye" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cartButton]}
            onPress={() => handleAddCarrinho(item.id)}
          >
            <Ionicons name="cart" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isFavorito ? "#e63946" : "#457b9d" },
            ]}
            onPress={() => handleFavoritar(item.id)}
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
        keyExtractor={(item) => item.id}
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