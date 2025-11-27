export type Categoria = { id: string; nome: string } // placeholder

export interface Produto {
    cod: string;
    nome: string;
    marca: string;
    preco: number;
    termos_pesquisa: string; // exemplo: "#limpeza_azul#multiuso"
    favorito: boolean;
    descricao?: string;
    dt_criacao: string; // ISO string
    categorias: Categoria[];
    imagem?: string; // uri local do arquivo redimensionado
}