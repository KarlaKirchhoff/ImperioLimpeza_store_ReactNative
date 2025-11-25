import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Produto } from "../types/interface";

export default class ProdutoStorage {
    private PRODUCTS_STORAGE_KEY = "products_v1";

    atualzarLista = async (next: Produto[]) => {
        try {
            await AsyncStorage.setItem(this.PRODUCTS_STORAGE_KEY, JSON.stringify(next));
        } catch (err) {
            console.error("persist cart", err);
        }
    }

    salvar = async (p: Produto): Promise<boolean> => {
        try {
            const raw = await AsyncStorage.getItem(this.PRODUCTS_STORAGE_KEY);
            const arr: Produto[] = raw ? JSON.parse(raw) : [];
            arr.unshift(p); // adiciona no começo
            await this.atualzarLista(arr);
            return true;
        } catch (err) {
            console.error("saveProductToStorage", err);
            return false;
        }
    };

    listar = async (): Promise<Produto[]> => {
        try {
            const raw = await AsyncStorage.getItem(this.PRODUCTS_STORAGE_KEY);
            const arr: Produto[] = raw ? JSON.parse(raw) : [];
            return arr;
        } catch (err) {
            console.error("listProductsFromStorage", err);
            return [];
        }
    }

    apagarTodos = async (): Promise<boolean> => {
        try {
            await AsyncStorage.removeItem(this.PRODUCTS_STORAGE_KEY);
            return true;
        } catch (err) {
            console.error("deleteAllProducts", err);
            return false;
        }
    };

    apagarPorCod = async (cod: string): Promise<boolean> => {
        try {
            const raw = await AsyncStorage.getItem(this.PRODUCTS_STORAGE_KEY);
            if (!raw) return false;

            const arr: Produto[] = JSON.parse(raw);
            const atualizado = arr.filter((p) => p.cod !== cod);

            await this.atualzarLista(atualizado);
            return true;
        } catch (err) {
            console.error("deleteProductById", err);
            return false;
        }
    };

    atualizarItem = async (produtoAtualizado: Produto): Promise<boolean> => {
        try {
            const raw = await AsyncStorage.getItem(this.PRODUCTS_STORAGE_KEY);
            if (!raw) return false;

            const arr: Produto[] = JSON.parse(raw);
            const index = arr.findIndex((p) => p.cod === produtoAtualizado.cod);

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