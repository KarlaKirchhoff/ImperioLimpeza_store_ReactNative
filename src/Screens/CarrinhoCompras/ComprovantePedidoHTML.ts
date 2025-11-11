import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";

export default class ComprovantePedidoHTML {

    itens: any[];
    usuario: { id: string | number; nome: string };
    total: { preco: number; items: number };

    constructor(itens: any[], usuario: { id: string | number; nome: string }, total:{ preco: number; items: number }) {
        this.itens = itens;
        this.usuario = usuario;
        this.total = total;
    }

    gerarTabela = (orderId: string) => {
        const date = new Date().toISOString();
        const formattedItems = this.itens
            .map(
                (it, idx) =>
                    `<tr>
            <td style="padding:8px;border:1px solid #ddd;">${idx + 1}</td>
            <td style="padding:8px;border:1px solid #ddd;">${it.product.nome} (${it.product.marca})</td>
            <td style="padding:8px;border:1px solid #ddd;">R$ ${it.product.preco.toFixed(2)}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${it.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;">R$ ${(it.quantity * it.product.preco).toFixed(2)}</td>
          </tr>`
            )
            .join("");

        return `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Pedido ${orderId}</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; padding:20px;">
        <h2>Pedido ${orderId}</h2>
        <p><strong>Data:</strong> ${date}</p>
        <p><strong>Cliente:</strong> ${this.usuario.nome ?? "—"} (ID: ${this.usuario.id ?? "—"})</p>

        <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #ddd;">#</th>
              <th style="padding:8px;border:1px solid #ddd;">Produto</th>
              <th style="padding:8px;border:1px solid #ddd;">Valor unit.</th>
              <th style="padding:8px;border:1px solid #ddd;">Qtd</th>
              <th style="padding:8px;border:1px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${formattedItems}
          </tbody>
        </table>

        <p style="margin-top:16px;"><strong>Quantidade total de itens:</strong> ${this.total.items}</p>
        <p><strong>Valor total da compra:</strong> R$ ${this.total.preco.toFixed(2)}</p>
      </body>
      </html>
    `;
    };

    async gerarPedido() {
        const orderId = `PED-${Date.now()}`;
        const html = this.gerarTabela(orderId);
        // write to file
        const filename = `${FileSystem.cacheDirectory}${orderId}.html`;
        await FileSystem.writeAsStringAsync(filename, html, { encoding: FileSystem.EncodingType.UTF8 });

        // share via expo-sharing (will open share sheet where user can pick WhatsApp)
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filename, {
                mimeType: "text/html",
                dialogTitle: `Pedido ${orderId}`,
            });
            // opcional: abrir whatsapp com resumo (texto). Note: não é possível forçar anexo via URL scheme.
            const summary = `Nome do Cliente: ${this.usuario.nome ?? "—"}, Valor Total: R$ ${this.total.preco.toFixed(
                2
            )}\nPedido: ${orderId}`;
            const encoded = encodeURIComponent(summary);
            const whatsappUrl = `whatsapp://send?text=${encoded}`;
            // tenta abrir whatsapp (se instalado)
            const supported = await Linking.canOpenURL(whatsappUrl);
            if (supported) {
                // abrimos o whatsapp com o texto — o arquivo pode ser enviado separadamente pelo app se o usuário escolher compartilhar para ele
                await Linking.openURL(whatsappUrl);
            } else {
                // fallback: abrir web.whatsapp
                const webUrl = `https://api.whatsapp.com/send?text=${encoded}`;
                await Linking.openURL(webUrl);
            }
        } else {
            // caso sharing não disponível (rare), abrir whatsapp com texto e instruir a localizar o arquivo
            const summary = `Nome do Cliente: ${this.usuario.nome ?? "—"}, Valor Total: R$ ${this.total.preco.toFixed(
                2
            )}\nPedido: ${orderId}\n(Arquivo HTML salvo em: ${filename})`;
            const encoded = encodeURIComponent(summary);
            const webUrl = `https://api.whatsapp.com/send?text=${encoded}`;
            await Linking.openURL(webUrl);
            return filename
        }
    }

}