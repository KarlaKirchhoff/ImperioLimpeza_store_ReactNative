// AuthScreens.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { useNavigation } from "@react-navigation/native";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Simples gerador de UUID4 (sem dependências).
 * Bom para exemplo — pode trocar por 'uuid' em produção.
 */
const generateId = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

/* ---------- Validações utilitárias ---------- */

/** Conta corretamente caracteres Unicode (emoji, acentos, etc.) */
const getUnicodeLength = (s: string) => Array.from(s).length;

/**
 * Nome: apenas letras (qualquer idioma) e espaços.
 * Regex Unicode: \p{L} = qualquer letra; usamos flag 'u'.
 * Aceitamos espaços; máximo 50 (verificado separadamente).
 */
const nameRegex = /^[\p{L}\s'-]+$/u;
const validateName = (name: string) => {
    if (!name || name.trim().length === 0) return { ok: false, reason: "Nome obrigatório" };
    if (!nameRegex.test(name)) return { ok: false, reason: "Apenas letras e espaços" };
    const len = getUnicodeLength(name.trim());
    if (len > 50) return { ok: false, reason: `Máximo 50 caracteres (${len})` };
    return { ok: true } as const;
};

/** Email simples: verifica formato e tamanho máximo 50 */
const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateEmail = (email: string) => {
    if (!email || email.trim().length === 0) return { ok: false, reason: "Email obrigatório" };
    if (getUnicodeLength(email) > 50) return { ok: false, reason: "Máximo 50 caracteres" };
    if (!emailRegex.test(email)) return { ok: false, reason: "Email inválido" };
    return { ok: true } as const;
};

/* ---------- Chaves SecureStore ---------- */
const STORAGE_KEY = "user_auth_v1";

/* ---------- Storage helpers (Secure) ---------- */
const saveUserSecurely = async (payload: { id_usuario: string; nome: string }) => {
    try {
        const json = JSON.stringify(payload);
        // SecureStore já armazena de forma segura na plataforma
        await SecureStore.setItemAsync(STORAGE_KEY, json, {
            keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
        });
        return true;
    } catch (err) {
        console.error("saveUserSecurely error:", err);
        return false;
    }
};

const getUserSecurely = async (): Promise<{ id_usuario: string; nome: string } | null> => {
    try {
        const raw = await SecureStore.getItemAsync(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (err) {
        console.error("getUserSecurely error:", err);
        return null;
    }
};

const removeUserSecurely = async () => {
    try {
        await SecureStore.deleteItemAsync(STORAGE_KEY);
        return true;
    } catch (err) {
        console.error("removeUserSecurely error:", err);
        return false;
    }
};

/* ---------- Component principal com fluxo simples ---------- */
export default function AuthScreens() {
    const navigation = useNavigation<NavProp>();

    const [screen, setScreen] =
        useState<"login" | "signup" | "home">("login");
    const [loadingUser, setLoadingUser] = useState(true);
    const [currentUser, setCurrentUser] =
        useState<{ id_usuario: string; nome: string } | null>(null);

    // Verificar usuário logado
    useEffect(() => {
        (async () => {
            const u = await getUserSecurely();
            if (u) {
                setCurrentUser(u);
                setScreen("home");
            }
            setLoadingUser(false);
        })();
    }, []);

    // 🟢 NAVEGAÇÃO PARA HOME
    useEffect(() => {
        if (screen === "home" && currentUser) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });
        }
    }, [screen, currentUser, navigation]);

    if (loadingUser) {
        return (
            <View style={styles.center}>
                <Text>Carregando…</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.select({ ios: "padding", android: undefined })}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>

                    {screen === "login" && (
                        <LoginScreen
                            onGoToSignUp={() => setScreen("signup")}
                            onSignedIn={(u) => {
                                setCurrentUser(u);
                                setScreen("home");
                            }}
                        />
                    )}

                    {screen === "signup" && (
                        <SignUpScreen
                            onGoToLogin={() => setScreen("login")}
                            onSignedUp={(u) => {
                                setCurrentUser(u);
                                setScreen("home");
                            }}
                        />
                    )}

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


/* ---------- Login Screen ---------- */
function LoginScreen({
    onGoToSignUp,
    onSignedIn,
}: {
    onGoToSignUp: () => void;
    onSignedIn: (user: { id_usuario: string; nome: string }) => void;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState < string | null > (null);
    const [passwordError, setPasswordError] = useState < string | null > (null);

    useEffect(() => {
        const v = validateEmail(email);
        setEmailError(v.ok ? null : v.reason);
    }, [email]);

    useEffect(() => {
        setPasswordError(password.length >= 6 || password.length === 0 ? null : "Senha muito curta (min 6)");
    }, [password]);

    const handleLogin = async () => {
        // Aqui implementar chamado real ao backend.
        // Para exemplo, validamos localmente:
        if (emailError || passwordError) {
            Alert.alert("Erro", "Corrija os campos antes de continuar.");
            return;
        }
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        // Simula autenticação bem-sucedida — cria id e nome fictício a partir do email
        const user = { id_usuario: generateId(), nome: email.split("@")[0] || "Usuário" };

        const ok = await saveUserSecurely(user);
        if (!ok) {
            Alert.alert("Erro", "Não foi possível salvar a autenticação.");
            return;
        }

        onSignedIn(user);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Entrar</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="seu@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <Text style={styles.label}>Senha</Text>
            <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity
                style={[styles.button, (!!emailError || !!passwordError || !email || !password) && styles.buttonDisabled]}
                disabled={!!emailError || !!passwordError || !email || !password}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.row}>
                <Text>Não tem conta?</Text>
                <TouchableOpacity onPress={onGoToSignUp}>
                    <Text style={styles.link}> Criar conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ---------- SignUp Screen ---------- */
function SignUpScreen({
    onGoToLogin,
    onSignedUp,
}: {
    onGoToLogin: () => void;
    onSignedUp: (user: { id_usuario: string; nome: string }) => void;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [nameError, setNameError] = useState < string | null > (null);
    const [emailError, setEmailError] = useState < string | null > (null);
    const [passwordError, setPasswordError] = useState < string | null > (null);
    const [confirmError, setConfirmError] = useState < string | null > (null);

    useEffect(() => {
        const v = validateName(name);
        setNameError(v.ok ? null : v.reason);
    }, [name]);

    useEffect(() => {
        const v = validateEmail(email);
        setEmailError(v.ok ? null : v.reason);
    }, [email]);

    useEffect(() => {
        setPasswordError(password.length >= 6 || password.length === 0 ? null : "Senha muito curta (min 6)");
    }, [password]);

    useEffect(() => {
        setConfirmError(confirm === password || confirm.length === 0 ? null : "Senhas não batem");
    }, [confirm, password]);

    const handleSignUp = async () => {
        if (nameError || emailError || passwordError || confirmError) {
            Alert.alert("Erro", "Corrija os campos antes de continuar.");
            return;
        }
        if (!name || !email || !password || !confirm) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        // Aqui iria a criação real no backend. Para demo, apenas criamos e salvamos localmente.
        const user = { id_usuario: generateId(), nome: name.trim() };

        const ok = await saveUserSecurely(user);
        if (!ok) {
            Alert.alert("Erro", "Não foi possível salvar os dados de autenticação.");
            return;
        }

        Alert.alert("Sucesso", "Conta criada com sucesso!");
        onSignedUp(user);
    };

    const nameLen = getUnicodeLength(name);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Criar conta</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                placeholder="Seu nome completo"
                value={name}
                onChangeText={(t) => {
                    // Evita ultrapassar 50 caracteres visíveis (Unicode-aware)
                    if (getUnicodeLength(t) <= 60) setName(t); // allow typing a bit beyond for UX; validation will block >50
                    else setName(Array.from(t).slice(0, 60).join(""));
                }}
            />
            <View style={styles.rowBetween}>
                <Text style={styles.counter}>{nameLen}/50</Text>
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : <View />}
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="seu@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(t) => {
                    // bloqueia mais de 50 chars
                    if (getUnicodeLength(t) <= 50) setEmail(t);
                }}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={styles.label}>Senha</Text>
            <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder="Senha (min 6)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
                style={[styles.input, confirmError ? styles.inputError : null]}
                placeholder="Repita a senha"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
            />
            {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}

            <TouchableOpacity
                style={[
                    styles.button,
                    (!!nameError || !!emailError || !!passwordError || !!confirmError || !name || !email || !password || !confirm) &&
                    styles.buttonDisabled,
                ]}
                disabled={!!nameError || !!emailError || !!passwordError || !!confirmError || !name || !email || !password || !confirm}
                onPress={handleSignUp}
            >
                <Text style={styles.buttonText}>Criar conta</Text>
            </TouchableOpacity>

            <View style={styles.row}>
                <Text>Já tem conta?</Text>
                <TouchableOpacity onPress={onGoToLogin}>
                    <Text style={styles.link}> Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ---------- HomeScreen simples ---------- */
function HomeScreen({ user, onLogout }: { user: { id_usuario: string; nome: string }; onLogout: () => void }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Bem-vindo(a), {user.nome}!</Text>
            <Text style={{ marginTop: 8 }}>ID: {user.id_usuario}</Text>

            <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={onLogout}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

/* ---------- Estilos ---------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: "#f6f7fb",
        minHeight: 600,
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        marginVertical: 8,
    },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
    label: { marginTop: 8, marginBottom: 4, color: "#333" },
    input: {
        borderWidth: 1,
        borderColor: "#e0e3eb",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#fafbff",
    },
    inputError: {
        borderColor: "#f05b5b",
    },
    button: {
        backgroundColor: "#2a7cff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 14,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: { color: "#fff", fontWeight: "600" },
    row: { flexDirection: "row", marginTop: 12, alignItems: "center" },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    link: { color: "#2a7cff", fontWeight: "600" },
    errorText: { color: "#d64545", marginTop: 6 },
    counter: { color: "#666", fontSize: 12 },
});
