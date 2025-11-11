import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";

import CarrinhoStorage from "../../storage/CarrinhoStorage"; const storage = new CarrinhoStorage();
import ComprovantePedidoHTML from "./ComprovantePedidoHTML";

/**
 * Tipos
 */
export type Categoria = { id: string; nome: string };

export interface Product {
  cod: string;
  nome: string;
  marca: string;
  preco: number; // número (ex: 12.34)
  termos_pesquisa: string;
  descricao?: string;
  dt_criacao: string; // ISO string
  categorias: Categoria[];
  imagem?: string; // uri
  estoque?: number; // quantidade disponível (opcional)
}

/** Item do carrinho */
export interface CartItemType {
  id: number
  product: Product;
  quantity: number;
}


/**
 * Props:
 * - userId / userName são opcionais, mas usados ao gerar pedido.
 */
export default function CarrrinhoCompras_Screen({ userId, userName }: { userId?: string; userName?: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const itens = await storage.listar();
        setItems(itens);
      } catch (err) {
        console.error("Erro ao carregar o carrinho", err);
      } finally {
        setLoading(false);
      }

    })();
  }, []);

  /* ---------- Helpers storage ---------- */
  const atualizarStorage = async (next: CartItemType[]) => {
    setItems(next);
    try {
      await storage.atualzarLista(next);
    } catch (err) {
      console.error("persist cart", err);
    }
  };

  /* ---------- Add item to cart
     If product already exists (same cod) -> sum quantities (respecting estoque).
     Otherwise push new item.
  ---------- */
  const addToCart = (product: Product, qty = 1) => {
    const existing = items.find((i) => i.product.cod === product.cod);
    const max = product.estoque ?? Number.MAX_SAFE_INTEGER;
    if (existing) {
      const newQty = Math.min(existing.quantity + qty, max);
      const next = items.map((i) =>
        i.product.cod === product.cod ? { ...i, quantity: newQty } : i
      );
      atualizarStorage(next);
      return;
    }
    const q = Math.min(qty, max);
    const next = [{ product, quantity: q }, ...items];
    atualizarStorage(next);
  };

  /* ---------- Update quantity (from item component) ---------- */
  const updateQuantity = (cod: string, quantity: number) => {
    const next = items.map((i) => (i.product.cod === cod ? { ...i, quantity } : i));
    atualizarStorage(next);
  };

  /* ---------- Remove item ---------- */
  const removeItem = (cod: string) => {
    const next = items.filter((i) => i.product.cod !== cod);
    atualizarStorage(next);
  };

  /* ---------- Totals ---------- */
  const totalItems = items.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = items.reduce((s, it) => s + it.quantity * Number(it.product.preco ?? 0), 0);

  /* ---------- Finalize: create file and share (or open WhatsApp link) ---------- */
  const finalizeOrder = async () => {
    if (items.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione produtos antes de finalizar.");
      return;
    }

    try {
      setSharing(true);
      const gerarPedido = new ComprovantePedidoHTML(
        items, { id: userId ?? "", nome: userName ?? "" },
        { items: totalItems, preco: totalPrice }
      );

      const orderFile = await gerarPedido.gerarPedido();
      if (orderFile){
        Alert.alert("Pedido Finalizado", "Arquivo disponível em: " + orderFile);
      }
     
      // Após finalizar, opcionalmente limpar carrinho:
      await storage.apagarTodos();
      setItems([]);
    } catch (err) {
      console.error("finalizeOrder err", err);
      Alert.alert("Erro", "Falha ao finalizar o pedido.");
    } finally {
      setSharing(false);
    }
  };

  /* ---------- Render item component ---------- */
  const CartItem = ({ item }: { item: CartItemType }) => {
    const stock = item.product.estoque ?? 999999;
    return (
      <View style={styles.itemCard}>
        <TouchableOpacity onPress={() => setPreviewProduct(item.product)} style={{ flexDirection: "row" }}>
          {item.product.imagem ? (
            <Image source={{ uri: item.product.imagem }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]}>
              <Text style={{ color: "#666" }}>Sem imagem</Text>
            </View>
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.itemTitle}>{item.product.nome}</Text>
            <Text style={styles.itemBrand}>{item.product.marca}</Text>
            <Text style={styles.itemPrice}>R$ {item.product.preco.toFixed(2)}</Text>

            <View style={styles.rowBetween}>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.cod, Math.max(1, item.quantity - 1))}
                >
                  <Text style={styles.btnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.cod, Math.min(stock, item.quantity + 1))}
                >
                  <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ fontWeight: "600" }}>R$ {(item.quantity * item.product.preco).toFixed(2)}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => removeItem(item.product.cod)}>
            <Text style={styles.removeText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Carrinho</Text>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text>Seu carrinho está vazio.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => i.product.cod}
            renderItem={({ item }) => <CartItem item={item} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <View style={styles.summary}>
            <Text style={styles.summaryText}>Quantidade total: {totalItems}</Text>
            <Text style={styles.summaryText}>Valor total: R$ {totalPrice.toFixed(2)}</Text>

            <TouchableOpacity
              style={[styles.checkoutBtn, items.length === 0 && styles.disabledBtn]}
              disabled={items.length === 0 || sharing}
              onPress={finalizeOrder}
            >
              <Text style={styles.checkoutText}>{sharing ? "Processando..." : "Finalizar Compra"}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Preview modal */}
      <Modal visible={!!previewProduct} animationType="slide" onRequestClose={() => setPreviewProduct(null)}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 16 }}>
            <TouchableOpacity onPress={() => setPreviewProduct(null)}>
              <Text style={{ color: "#2a7cff", marginBottom: 12 }}>← Voltar</Text>
            </TouchableOpacity>

            {previewProduct && (
              <>
                {previewProduct.imagem ? (
                  <Image source={{ uri: previewProduct.imagem }} style={{ width: "100%", height: 240, borderRadius: 8 }} />
                ) : (
                  <View style={[styles.thumb, styles.thumbPlaceholder]}>
                    <Text style={{ color: "#666" }}>Sem imagem</Text>
                  </View>
                )}

                <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>{previewProduct.nome}</Text>
                <Text style={{ color: "#666", marginTop: 6 }}>{previewProduct.marca}</Text>
                <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 12 }}>R$ {previewProduct.preco.toFixed(2)}</Text>

                <Text style={{ marginTop: 12, color: "#333" }}>{previewProduct.descricao || "Sem descrição"}</Text>

                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontSize: 14, color: "#666" }}>Categorias:</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {previewProduct.categorias.map((c) => (
                      <View key={c.id} style={{ backgroundColor: "#eef5ff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 6 }}>
                        <Text style={{ color: "#2a7cff" }}>{c.nome}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={{ marginTop: 12, color: "#999" }}>Obs: Esta tela é apenas visualização — não é possível adicionar novamente ao carrinho aqui.</Text>
              </>
            )}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb", padding: 12 },
  header: { fontSize: 22, fontWeight: "700", marginVertical: 8 },
  empty: { padding: 20, alignItems: "center" },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "column",
    elevation: 2,
  },
  thumb: { width: 90, height: 90, borderRadius: 8 },
  thumbPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e3eb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafbff",
  },
  itemTitle: { fontWeight: "700", fontSize: 16 },
  itemBrand: { color: "#666", marginTop: 4 },
  itemPrice: { marginTop: 6, fontWeight: "600" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#eef5ff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  btnText: { fontWeight: "700", color: "#2a7cff" },
  qtyText: { minWidth: 18, textAlign: "center", fontWeight: "600" },
  itemActions: { marginTop: 8, alignItems: "flex-end" },
  removeText: { color: "#d64545", fontWeight: "600" },
  summary: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  summaryText: { fontWeight: "600", marginBottom: 8 },
  checkoutBtn: {
    marginTop: 8,
    backgroundColor: "#2a7cff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "700" },
  disabledBtn: { opacity: 0.6 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
