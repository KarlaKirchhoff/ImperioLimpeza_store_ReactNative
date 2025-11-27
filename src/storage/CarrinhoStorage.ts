import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CartItemType } from "../Screens/CarrinhoCompras/CarrinhoCompras";

export default class CarrinhoStorage {
    private CART_STORAGE_KEY = "cart_v1";

    atualzarLista = async (next: CartItemType[]) => {
        try {
            await AsyncStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(next));
        } catch (err) {
            console.error("persist cart", err);
        }
    };

    adicionar = async (p: CartItemType): Promise<boolean> => {
        try {
            const raw = await AsyncStorage.getItem(this.CART_STORAGE_KEY);
            const arr: CartItemType[] = raw ? JSON.parse(raw) : [];
            arr.unshift(p); // adiciona no começo
            await this.atualzarLista(arr);
            return true;
        } catch (err) {
            console.error("saveProductToStorage", err);
            return false;
        }
    };

    listar = async (): Promise<CartItemType[]> => {
        try {
            const raw = await AsyncStorage.getItem(this.CART_STORAGE_KEY);
            const arr: CartItemType[] = raw ? JSON.parse(raw) : [];
            return arr;
        } catch (err) {
            console.error("listProductsFromStorage", err);
            return [];
        }
    }

    apagarTodos = async (): Promise<boolean> => {
        try {
            await AsyncStorage.removeItem(this.CART_STORAGE_KEY);
            return true;
        } catch (err) {
            console.error("deleteAllProducts", err);
            return false;
        }
    };

    apagarItem = async (cod: string): Promise<boolean> => {
        try {
            const raw = await AsyncStorage.getItem(this.CART_STORAGE_KEY);
            if (!raw) return false;

            const arr: CartItemType[] = JSON.parse(raw);
            const atualizado = arr.filter((p) => p.product.cod !== cod);

            await this.atualzarLista(atualizado);
            return true;
        } catch (err) {
            console.error("deleteProductById", err);
            return false;
        }
    };

    atualizarItem = async (produtoAtualizado: CartItemType): Promise<boolean> => {
        try {
            const raw = await AsyncStorage.getItem(this.CART_STORAGE_KEY);
            if (!raw) return false;

            const arr: CartItemType[] = JSON.parse(raw);
            const index = arr.findIndex((p) => p.product.cod === produtoAtualizado.product.cod);

            if (index === -1) return false; // não encontrado

            arr[index] = produtoAtualizado; // substitui
            await this.atualzarLista(arr);
            return true;
        } catch (err) {
            console.error("updateProduct", err);
            return false;
        }
    };
}