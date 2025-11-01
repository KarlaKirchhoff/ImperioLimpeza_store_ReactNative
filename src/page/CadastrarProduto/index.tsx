import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ------------------- Configs ------------------- */
const PRODUCTS_STORAGE_KEY = "products_v1";
const IMAGE_MAX_MB = 5; // limite em MB (ajuste conforme desejar)
const ALLOWED_IMAGE_EXT = ["png", "jpg", "jpeg"];
const MAX_IMG_WIDTH = 1024; // largura alvo para redimensionamento
const IMAGE_QUALITY = 0.85; // 0..1

/* ------------------- Tipos ------------------- */
export type Categoria = { id: string; nome: string } // placeholder

export interface Product {
    cod: string;
    nome: string;
    marca: string;
    preco: number;
    termos_pesquisa: string; // exemplo: "#limpeza_azul#multiuso"
    descricao?: string;
    dt_criacao: string; // ISO string
    categorias: Categoria[];
    imagem?: string; // uri local do arquivo redimensionado
}

/* ---------- util: uuid simples ---------- */
const genId = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

/* ---------- util Unicode-aware length ---------- */
const unicodeLen = (s: string) => Array.from(s).length;

/* ---------- Regex ---------- */
// Nome: apenas letras (qualquer idioma), espaços, acentuações, hifens e apóstrofes
const nameRegex = /^[\p{L}\s'-]+$/u;
// Termo: sem espaços (underscore permitido), letras e underline (acentos permitidos)
const termRegex = /^[\p{L}_]+$/u;
// Marca: mesmas regras que nome, mas sem espaços opcionais? vamos permitir espaços
const marcaRegex = /^[\p{L}\s'-]+$/u;

/* ---------- storage helpers ---------- */
const saveProductToStorage = async (p: Product) => {
    try {
        const raw = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        const arr: Product[] = raw ? JSON.parse(raw) : [];
        arr.unshift(p); // adiciona no começo
        await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(arr));
        return true;
    } catch (err) {
        console.error("saveProductToStorage", err);
        return false;
    }
};

/* ---------- Image helpers ---------- */
const getFileExtension = (uri: string) => {
    const split = uri.split(".");
    return split.length > 1 ? split.pop()!.toLowerCase() : "";
};

const bytesToMb = (b: number) => b / (1024 * 1024);

/* Redimensiona e salva imagem (retorna nova uri) */
const resizeAndSaveImage = async (uri: string) => {
    // ler informações (tamanho)
    const info = await FileSystem.getInfoAsync(uri, { size: true });
    // imagem já pequena? ainda assim vamos redimensionar para largura segura
    const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: MAX_IMG_WIDTH } }],
        { compress: IMAGE_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
    );

    // salvamos um novo arquivo dentro do cache:
    const dest = `${FileSystem.cacheDirectory}prod_${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: manipResult.uri, to: dest });
    const finalInfo = await FileSystem.getInfoAsync(dest, { size: true });
    if (!finalInfo.exists) {
        console.log("Arquivo não encontrado");
        return;
    }
    return { uri: dest, size: finalInfo.size ?? 0 };
};

/* ---------- Termos processing ---------- */
const processTermsInput = (raw: string) => {
    // separar por , ou ; ou # ou espaço, porém o requisito diz sem espaços: vamos substituir espaços por _
    // permitir entrada livre, processamos assim:
    const cleaned = raw.trim().toLowerCase();
    if (!cleaned) return [];
    // split por vírgula, ponto e vírgula, #, espaços múltiplos
    const parts = cleaned
        .split(/[,;#\s]+/)
        .map((p) => p.replace(/\s+/g, "_").trim())
        .filter(Boolean);
    // remover duplicatas
    const uniq = Array.from(new Set(parts));
    return uniq;
};

/* ---------- Preço input helper ---------- */
/**
 * O usuário digita apenas dígitos (0-9). A função retorna string formatada com vírgula antes dos 2 últimos dígitos:
 * Ex: inputDigits = "1" -> "0,01"; "12" -> "0,12"; "123" -> "1,23"; "12345" -> "123,45"
 * Internamente armazenamos como string de dígitos; na submissão convertemos para number: replace(',', '.') e parseFloat
 */
const formatPriceFromDigits = (digits: string) => {
    const clean = digits.replace(/\D/g, "");
    const padded = clean.padStart(3, "0"); // garantir pelo menos 3 pra simplificar: '001' -> 0,01
    const len = padded.length;
    const intPart = padded.slice(0, len - 2).replace(/^0+/, "") || "0";
    const cents = padded.slice(len - 2);
    // Exibir com separador de milhares fácil? Por simplicidade não adicionamos '.' milhares.
    return `${intPart},${cents}`;
};

const priceDigitsToNumber = (digits: string) => {
    const clean = digits.replace(/\D/g, "");
    if (!clean) return 0;
    const len = clean.length;
    const intPart = clean.slice(0, len - 2) || "0";
    const cents = clean.slice(len - 2).padStart(2, "0");
    const join = `${intPart}.${cents}`;
    return Number(join);
};

/* ------------------- Componente ------------------- */
export default function ProductFormScreen() {
    // form states
    const [imagemUri, setImagemUri] = useState<string | undefined>(undefined);
    const [imagemError, setImagemError] = useState<string | null>(null);

    const [nome, setNome] = useState("");
    const [nomeError, setNomeError] = useState<string | null>(null);

    const [descricao, setDescricao] = useState("");
    const [descricaoError, setDescricaoError] = useState<string | null>(null);

    const [marca, setMarca] = useState("");
    const [marcaError, setMarcaError] = useState<string | null>(null);

    const [termosRaw, setTermosRaw] = useState("");
    const [termosProcessed, setTermosProcessed] = useState<string[]>([]);
    const [termosError, setTermosError] = useState<string | null>(null);

    // price digits state (user types digits only)
    const [priceDigits, setPriceDigits] = useState(""); // ex: "123" -> 1,23
    const [priceError, setPriceError] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);

    /* ---------- Validations in real-time ---------- */
    useEffect(() => {
        // nome validations
        const len = unicodeLen(nome.trim());
        if (!nome.trim()) {
            setNomeError("Nome obrigatório");
        } else if (!nameRegex.test(nome.trim())) {
            setNomeError("Apenas letras, espaços, hífen e apóstrofo");
        } else if (len > 30) {
            setNomeError(`Máximo 30 caracteres (${len})`);
        } else {
            setNomeError(null);
        }
    }, [nome]);

    useEffect(() => {
        const len = unicodeLen(descricao.trim());
        if (descricao && len > 250) setDescricaoError(`Máximo 250 caracteres (${len})`);
        else setDescricaoError(null);
    }, [descricao]);

    useEffect(() => {
        const len = unicodeLen(marca.trim());
        if (!marca.trim()) {
            setMarcaError("Marca obrigatória");
        } else if (!marcaRegex.test(marca.trim())) {
            setMarcaError("Caract. inválidos na marca");
        } else if (len > 20) {
            setMarcaError(`Máximo 20 caracteres (${len})`);
        } else {
            setMarcaError(null);
        }
    }, [marca]);

    useEffect(() => {
        // process terms
        const arr = processTermsInput(termosRaw);
        // validar cada termo
        if (arr.length === 0) {
            setTermosProcessed([]);
            setTermosError(null);
            return;
        }
        for (const t of arr) {
            if (!termRegex.test(t)) {
                setTermosError("Termos só: letras e underscore (_)");
                setTermosProcessed(arr);
                return;
            }
        }
        // verificar duplicatas já removidas na processTermsInput; apenas checar se houve duplicatas no raw
        // aqui, se parts length > uniq length: era duplicado
        const parts = termosRaw
            .trim()
            .toLowerCase()
            .split(/[,;#\s]+/)
            .map((p) => p.replace(/\s+/g, "_").trim())
            .filter(Boolean);
        if (parts.length !== arr.length) {
            setTermosError("Existem termos repetidos (removidos automaticamente)");
        } else {
            setTermosError(null);
        }
        setTermosProcessed(arr);
    }, [termosRaw]);

    useEffect(() => {
        // price validation: allow digits only; if empty -> error
        if (!priceDigits) {
            setPriceError("Preço obrigatório");
            return;
        }
        const clean = priceDigits.replace(/\D/g, "");
        if (clean.length > 12) {
            setPriceError("Preço muito grande");
        } else {
            setPriceError(null);
        }
    }, [priceDigits]);

    /* ---------- Image picking ---------- */
    const pickImage = async (fromCamera = false) => {
        try {
            setImagemError(null);
            // pedir permissão
            if (fromCamera) {
                const cam = await ImagePicker.requestCameraPermissionsAsync();
                if (cam.status !== "granted") {
                    setImagemError("Permissão de câmera negada");
                    return;
                }
            } else {
                const gal = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (gal.status !== "granted") {
                    setImagemError("Permissão para acessar arquivos negada");
                    return;
                }
            }

            const res = fromCamera
                ? await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1 })
                : await ImagePicker.launchImageLibraryAsync({ allowsEditing: false, quality: 1 });

            if (res.cancelled) return;

            const uri = (res as any).uri as string;
            const ext = getFileExtension(uri);
            if (!ALLOWED_IMAGE_EXT.includes(ext)) {
                setImagemError("Formato inválido (apenas png, jpg, jpeg)");
                return;
            }

            // verificar tamanho real (antes do resize)
            const info = await FileSystem.getInfoAsync(uri, { size: true });
            if (!info.exists) {
                console.log("Arquivo não encontrado");
                return;
            }
            const size = info.size ?? 0;
            if (bytesToMb(size) > IMAGE_MAX_MB) {
                // tentamos redimensionar; se ainda maior, erro
                
                const { uri: resizedUri, size: newSize } = await resizeAndSaveImage(uri);
                if (bytesToMb(newSize) > IMAGE_MAX_MB) {
                    setImagemError(`Imagem muito grande (> ${IMAGE_MAX_MB}MB) mesmo após redimensionar`);
                    return;
                } else {
                    setImagemUri(resizedUri);
                    return;
                }
            } else {
                // já está abaixo do limite -> ainda assim criamos uma versão otimizada para padronizar
                const { uri: resizedUri } = await resizeAndSaveImage(uri);
                setImagemUri(resizedUri);
            }
        } catch (err) {
            console.error("pickImage err", err);
            setImagemError("Erro ao processar imagem");
        }
    };

    /* ---------- Submissão ---------- */
    const canSubmit =
        !nomeError &&
        !descricaoError &&
        !marcaError &&
        !termosError &&
        !priceError &&
        !imagemError &&
        !!imagemUri &&
        !!nome &&
        !!marca &&
        !!priceDigits;

    const handleSubmit = async () => {
        if (!canSubmit) {
            Alert.alert("Erro", "Corrija os campos antes de enviar.");
            return;
        }
        setSubmitting(true);
        try {
            // montar objeto
            const precoNum = priceDigitsToNumber(priceDigits); // número com ponto
            const termosHashTags =
                termosProcessed.length > 0 ? termosProcessed.map((t) => `#${t}`).join("") : "";

            const product: Product = {
                cod: genId(),
                nome: nome.trim(),
                marca: marca.trim(),
                preco: precoNum,
                termos_pesquisa: termosHashTags,
                descricao: descricao.trim(),
                dt_criacao: new Date().toISOString(),
                categorias: [],
                imagem: imagemUri,
            };

            const ok = await saveProductToStorage(product);
            if (!ok) {
                Alert.alert("Erro", "Não foi possível salvar o produto localmente.");
                setSubmitting(false);
                return;
            }

            Alert.alert("Sucesso", "Produto cadastrado!");
            // limpa formulário
            setImagemUri(undefined);
            setNome("");
            setDescricao("");
            setMarca("");
            setTermosRaw("");
            setPriceDigits("");
        } catch (err) {
            console.error("handleSubmit err", err);
            Alert.alert("Erro", "Falha ao cadastrar produto.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------- UI ---------- */
    return (
        <ScrollView contentContainerStyle={s.container}>
            <View style={s.card}>
                <Text style={s.title}>Cadastrar Produto</Text>

                <Text style={s.label}>Imagem</Text>
                {imagemUri ? (
                    <Image source={{ uri: imagemUri }} style={s.imagePreview} />
                ) : (
                    <View style={s.imagePlaceholder}>
                        <Text style={{ color: "#666" }}>Nenhuma imagem</Text>
                    </View>
                )}
                {imagemError ? <Text style={s.error}>{imagemError}</Text> : null}
                <View style={s.row}>
                    <TouchableOpacity style={s.smallButton} onPress={() => pickImage(true)}>
                        <Text style={s.smallButtonText}>Tirar foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.smallButton} onPress={() => pickImage(false)}>
                        <Text style={s.smallButtonText}>Escolher da galeria</Text>
                    </TouchableOpacity>
                </View>

                <Text style={s.label}>Nome</Text>
                <TextInput
                    style={[s.input, nomeError ? s.inputError : null]}
                    placeholder="Nome do produto"
                    value={nome}
                    onChangeText={(t) => {
                        // prevent extreme overflow while typing
                        if (unicodeLen(t) <= 40) setNome(t);
                        else setNome(Array.from(t).slice(0, 40).join(""));
                    }}
                />
                <View style={s.rowBetween}>
                    <Text style={s.counter}>{unicodeLen(nome)}/30</Text>
                    {nomeError ? <Text style={s.error}>{nomeError}</Text> : <View />}
                </View>

                <Text style={s.label}>Descrição (opcional)</Text>
                <TextInput
                    style={[s.input, descricaoError ? s.inputError : null, { minHeight: 80 }]}
                    multiline
                    value={descricao}
                    onChangeText={(t) => {
                        if (unicodeLen(t) <= 260) setDescricao(t);
                        else setDescricao(Array.from(t).slice(0, 260).join(""));
                    }}
                />
                <View style={s.rowBetween}>
                    <Text style={s.counter}>{unicodeLen(descricao)}/250</Text>
                    {descricaoError ? <Text style={s.error}>{descricaoError}</Text> : <View />}
                </View>

                <Text style={s.label}>Marca</Text>
                <TextInput
                    style={[s.input, marcaError ? s.inputError : null]}
                    value={marca}
                    onChangeText={(t) => {
                        if (unicodeLen(t) <= 25) setMarca(t);
                        else setMarca(Array.from(t).slice(0, 25).join(""));
                    }}
                />
                <View style={s.rowBetween}>
                    <Text style={s.counter}>{unicodeLen(marca)}/20</Text>
                    {marcaError ? <Text style={s.error}>{marcaError}</Text> : <View />}
                </View>

                <Text style={s.label}>Termos de Pesquisa (separar por vírgula)</Text>
                <TextInput
                    style={[s.input, termosError ? s.inputError : null]}
                    value={termosRaw}
                    placeholder="ex: limpeza, multiuso, cozinha"
                    onChangeText={(t) => {
                        setTermosRaw(t);
                    }}
                />
                <View style={s.rowBetween}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                        {termosProcessed.map((t) => (
                            <View key={t} style={s.tag}>
                                <Text style={s.tagText}>#{t}</Text>
                            </View>
                        ))}
                    </View>
                    {termosError ? <Text style={s.error}>{termosError}</Text> : <View />}
                </View>

                <Text style={s.label}>Preço</Text>
                <TextInput
                    style={[s.input, priceError ? s.inputError : null]}
                    value={formatPriceFromDigits(priceDigits)}
                    keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                    onChangeText={(t) => {
                        // aceitar apenas dígitos
                        const digits = t.replace(/\D/g, "");
                        // limitar tamanho
                        if (digits.length <= 12) setPriceDigits(digits);
                    }}
                />
                {priceError ? <Text style={s.error}>{priceError}</Text> : null}

                <TouchableOpacity
                    style={[s.button, (!canSubmit || submitting) && s.buttonDisabled]}
                    disabled={!canSubmit || submitting}
                    onPress={handleSubmit}
                >
                    <Text style={s.buttonText}>{submitting ? "Salvando..." : "Cadastrar Produto"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ------------------- Estilos ------------------- */
const s = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 60,
        backgroundColor: "#f6f7fb",
        flexGrow: 1,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
    label: { marginTop: 10, marginBottom: 6, color: "#333" },
    input: {
        borderWidth: 1,
        borderColor: "#e0e3eb",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#fafbff",
    },
    inputError: { borderColor: "#d64545" },
    row: { flexDirection: "row", gap: 8, marginTop: 8 },
    smallButton: {
        backgroundColor: "#2a7cff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    smallButtonText: { color: "#fff", fontWeight: "600" },
    imagePreview: { width: "100%", height: 200, borderRadius: 8, marginTop: 8 },
    imagePlaceholder: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#e0e3eb",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fafbff",
    },
    counter: { color: "#666", fontSize: 12 },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    tag: {
        backgroundColor: "#eef5ff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginTop: 6,
    },
    tagText: { color: "#2a7cff", fontWeight: "600" },
    error: { color: "#d64545", fontSize: 12 },
    button: {
        backgroundColor: "#2a7cff",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { color: "#fff", fontWeight: "700" },
});
