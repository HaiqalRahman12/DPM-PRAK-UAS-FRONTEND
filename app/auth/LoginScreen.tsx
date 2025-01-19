import React, {useState} from "react";
import {Image, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ThemedView} from "@/components/ThemedView";
import {Button, Dialog, PaperProvider, Portal} from "react-native-paper";
import API_URL from "../../config/config";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            const { token } = response.data.data;
            await AsyncStorage.setItem("token", token);
            setDialogMessage("Login successful!");
            setIsSuccess(true);
            setDialogVisible(true);
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setIsSuccess(false);
            setDialogVisible(true);
        }
    };

    const handleDialogDismiss = () => {
        setDialogVisible(false);
        if (isSuccess) {
            router.replace("/(tabs)");
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
                <Text style={styles.title}>Selamat Datang Kemabli</Text>
                <Text style={styles.subtitle}>Silakan Masuk</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/auth/RegisterScreen")}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss}>
                        <Dialog.Title>{isSuccess ? "Success" : "Login Failed"}</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleDialogDismiss}>OK</Button>
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
    logo: {
        width: 150,
        height: 150,
        marginBottom: 24,
        resizeMode: "contain",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 8,
        color: "#F6E05E", // Warna kuning untuk teks utama
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        color: "#CBD5E0", // Warna abu-abu terang untuk subtitle
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#4A5568",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
        backgroundColor: "#2D3748", // Latar belakang input gelap
        color: "#E2E8F0", // Teks input putih
    },
    loginButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#F6E05E", // Tombol kuning
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
    loginButtonText: {
        color: "#1A202C", // Teks gelap pada tombol kuning
        fontSize: 16,
        fontWeight: "700",
    },
    registerButton: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#F6E05E", // Border kuning
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2D3748", // Latar belakang tombol gelap
    },
    registerButtonText: {
        color: "#F6E05E", // Teks kuning pada tombol gelap
        fontSize: 16,
        fontWeight: "700",
    },
});

