/**
 * O usuário digita apenas dígitos (0-9). A função retorna string formatada com vírgula antes dos 2 últimos dígitos:
 * Ex: inputDigits = "1" -> "0,01"; "12" -> "0,12"; "123" -> "1,23"; "12345" -> "123,45"
 * Internamente armazenamos como string de dígitos; na submissão convertemos para number: replace(',', '.') e parseFloat
 */
const FormatarPrecoParaNumero = (digits: string) => {
    const clean = digits.replace(/\D/g, "");
    const padded = clean.padStart(3, "0"); // garantir pelo menos 3 pra simplificar: '001' -> 0,01
    const len = padded.length;
    const intPart = padded.slice(0, len - 2).replace(/^0+/, "") || "0";
    const cents = padded.slice(len - 2);
    // Exibir com separador de milhares fácil? Por simplicidade não adicionamos '.' milhares.
    return `${intPart},${cents}`;
};

export default FormatarPrecoParaNumero;