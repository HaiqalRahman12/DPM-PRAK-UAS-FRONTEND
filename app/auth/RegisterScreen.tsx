import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import axios from "axios";
import {ThemedView} from "@/components/ThemedView";
import {Button, Dialog, PaperProvider, Portal} from "react-native-paper";
import API_URL from "../../config/config";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/register`, {username, password, email});
            router.replace("/auth/LoginScreen");
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <Text style={styles.title}>Buat Akun Baru</Text>
                <Text style={styles.subtitle}>Bergabung</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/LoginScreen")}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Registration Failed</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#1A202C", // Latar belakang gelap
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 16,
        color: "#F6E05E", // Warna kuning mencolok untuk judul
    },
    subtitle: {
        fontSize: 16,
        color: "#CBD5E0", // Warna abu-abu terang untuk subtitle
        marginBottom: 24,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#4A5568", // Border abu-abu gelap
        borderWidth: 1,
        borderRadius: 12, // Tepi melengkung untuk modernitas
        paddingHorizontal: 14,
        marginBottom: 16,
        backgroundColor: "#2D3748", // Latar belakang input gelap
        color: "#E2E8F0", // Teks putih
    },
    registerButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#F6E05E", // Tombol kuning terang
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    registerButtonText: {
        color: "#1A202C", // Teks gelap pada tombol kuning
        fontSize: 16,
        fontWeight: "700",
    },
    loginButton: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#F6E05E", // Border kuning
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2D3748", // Tombol dengan latar belakang gelap
    },
    loginButtonText: {
        color: "#F6E05E", // Teks kuning pada tombol gelap
        fontSize: 16,
        fontWeight: "700",
    },
});
