import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";

// Tipagem do Pedido
interface Pedido {
  id: string;
  nome?: string;
  dataHora: string;
  arquivoHtml: string; // caminho/URL simulada do arquivo do pedido
}

// Componente principal da página
export default function HistoricoPedidos_Screen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: "1",
      nome: "Pedido Limpeza Mensal",
      dataHora: "2025-10-31 10:20",
      arquivoHtml: "pedido_1.html",
    },
    {
      id: "2",
      dataHora: "2025-10-29 15:45",
      arquivoHtml: "pedido_2.html",
    },
  ]);

  const handleRenomear = (id: string, novoNome: string) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, nome: novoNome } : p))
    );
  };

  const handleAbrirPedido = (pedido: Pedido) => {
    Alert.alert(
      "Abrir Pedido",
      `Abrindo arquivo HTML: ${pedido.arquivoHtml}`
    );
    // Aqui entraria a lógica para abrir o arquivo HTML do pedido
  };

  const handleComprarNovamente = () => {
    Alert.alert("Comprar novamente", "Gerando novo pedido...");
    // Aqui você pode redirecionar o usuário para o fluxo de compra
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📜 Histórico de Pedidos</Text>

      <ListaPedidos_Component
        pedidos={pedidos}
        onRenomear={handleRenomear}
        onAbrir={handleAbrirPedido}
      />

      <TouchableOpacity style={styles.botaoComprar} onPress={handleComprarNovamente}>
        <Text style={styles.textoBotao}>🛒 Comprar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ------------------ COMPONENTE ListaPedidos -------------------
interface ListaPedidosProps {
  pedidos: Pedido[];
  onRenomear: (id: string, novoNome: string) => void;
  onAbrir: (pedido: Pedido) => void;
}

const ListaPedidos_Component: React.FC<ListaPedidosProps> = ({
  pedidos,
  onRenomear,
  onAbrir,
}) => {
  return (
    <FlatList
      data={pedidos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Item_ListaPedidos
          pedido={item}
          onRenomear={onRenomear}
          onAbrir={onAbrir}
        />
      )}
    />
  );
};

// ------------------ COMPONENTE Item_ListaPedidos -------------------
interface ItemProps {
  pedido: Pedido;
  onRenomear: (id: string, novoNome: string) => void;
  onAbrir: (pedido: Pedido) => void;
}

const Item_ListaPedidos: React.FC<ItemProps> = ({
  pedido,
  onRenomear,
  onAbrir,
}) => {
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState(pedido.nome || "");

  const handleSalvarNome = () => {
    if (novoNome.trim().length === 0) {
      Alert.alert("Erro", "O nome do pedido não pode estar vazio.");
      return;
    }
    onRenomear(pedido.id, novoNome.trim());
    setEditando(false);
  };

  return (
    <TouchableOpacity
      style={styles.itemPedido}
      onPress={() => onAbrir(pedido)}
      activeOpacity={0.8}
    >
      {editando ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.inputNome}
            value={novoNome}
            onChangeText={setNovoNome}
            maxLength={50}
          />
          <TouchableOpacity onPress={handleSalvarNome} style={styles.btnSalvar}>
            <Text style={styles.textoBotaoPequeno}>Salvar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.infoPedido}>
          <Text style={styles.nomePedido}>
            {pedido.nome || pedido.dataHora}
          </Text>
          <Text style={styles.dataPedido}>{pedido.dataHora}</Text>

          <TouchableOpacity
            onPress={() => setEditando(true)}
            style={styles.btnRenomear}
          >
            <Text style={styles.textoBotaoPequeno}>✏️ Renomear</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ------------------ ESTILOS -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  itemPedido: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  infoPedido: {
    flexDirection: "column",
  },
  nomePedido: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  dataPedido: {
    color: "#777",
    marginVertical: 4,
  },
  btnRenomear: {
    alignSelf: "flex-start",
    backgroundColor: "#E3F2FD",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textoBotaoPequeno: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputNome: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  btnSalvar: {
    backgroundColor: "#1976D2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  botaoComprar: {
    marginTop: 20,
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
