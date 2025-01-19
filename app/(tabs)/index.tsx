import React, {useEffect, useState} from 'react';
import {FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import {useRouter} from 'expo-router';
import {ThemedView} from '@/components/ThemedView';
import {ThemedText} from '@/components/ThemedText';
import {useTodos} from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';

const TodosScreen = () => {
    const {todos, fetchTodos} = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, {headers: {Authorization: `Bearer ${token}`}});
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, {headers: {Authorization: `Bearer ${token}`}});
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title} type="title">ToDo List</ThemedText>
                {loading ? (
                    <ActivityIndicator style={styles.loading} animating={true}/>
                ) : (
                    <FlatList
                        data={todos}
                        keyExtractor={(item) => item._id}
                        renderItem={({item}) => (
                            <Card style={styles.card} elevation={3} onPress={() => router.push(`../todo/${item._id}`)}>
                                <Card.Content>
                                    <Text variant="titleMedium">{item.title}</Text>
                                    <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
                                </Card.Content>
                                <Card.Actions>
                                    <Button onPress={() => handleDeleteTodo(item._id)}>Delete</Button>
                                </Card.Actions>
                            </Card>
                        )}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
                {isAdding && (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                          style={styles.inputContainer}>
                        <TextInput
                            label="Title"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                            mode="outlined"
                            multiline
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
                            <Text style={styles.addButtonText}>Tweet</Text>
                        </TouchableOpacity>
                        <Button onPress={() => setIsAdding(false)} style={styles.cancelButton}>
                            Cancel
                        </Button>
                    </KeyboardAvoidingView>
                )}
                {!isAdding && (
                    <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} label="Tweet"/>
                )}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Alert</Dialog.Title>
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#1A202C", // Latar belakang gelap
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#F6E05E", // Warna kuning mencolok
        marginBottom: 16,
        textAlign: "center",
    },
    loading: {
        marginTop: 20,
    },
    listContainer: {
        paddingBottom: 80,
    },
    card: {
        backgroundColor: "#2D3748", // Kartu gelap
        marginBottom: 12,
        borderRadius: 8,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    description: {
        color: "#E2E8F0", // Teks terang
        marginTop: 4,
    },
    inputContainer: {
        backgroundColor: "#2D3748",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        marginBottom: 12,
        backgroundColor: "#1A202C",
        color: "#E2E8F0",
    },
    addButton: {
        backgroundColor: "#FFD700", // Tombol kuning lebih terang
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FFC107",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10,
    },
    addButtonText: {
        color: "#1A202C",
        fontSize: 18,
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "#4A5568",
        marginTop: 8,
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: "#F6E05E", // FAB kuning
    },
});

export default TodosScreen;
