import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import API_URL from '@/config/config';
import {ThemedView} from '@/components/ThemedView';
import {useTodos} from '@/context/TodoContext';

type Todo = {
    _id: string;
    title: string;
    description: string;
};

const TodoDetailScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { updateTodo } = useTodos();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchTodo();
    }, [id]);

    const fetchTodo = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: Todo }>(`${API_URL}/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fetchedTodo = response.data.data;
            setTodo(fetchedTodo);
            setTitle(fetchedTodo.title);
            setDescription(fetchedTodo.description);
        } catch (error) {
            console.error('Failed to fetch todo', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTodo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put<{ data: Todo }>(
                `${API_URL}/api/todos/${id}`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedTodo = response.data.data;
            setTodo(updatedTodo);
            updateTodo(updatedTodo);
            setVisible(true);
        } catch (error) {
            console.error('Failed to update todo', error);
        }
    };

    const hideDialog = () => {
        setVisible(false);
        router.back();
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.container}>
                    <ActivityIndicator style={styles.loading} animating={true} />
                </ThemedView>
            </PaperProvider>
        );
    }

    if (!todo) {
        return null;
    }

    return (
        <PaperProvider>
            <Stack.Screen options={{ 
                title: 'Edit', 
                headerStyle: { backgroundColor: '#1A202C' }, // Latar belakang header gelap
                headerTintColor: '#F6E05E', // Warna teks header kuning mencolok
            }} />
            <ThemedView style={styles.container}>
                <Card style={styles.card} elevation={3}>
                    <Card.Content>
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
                        <Button 
                            mode="contained" 
                            onPress={handleUpdateTodo} 
                            style={[styles.updateButton, {backgroundColor: '#FFD700'}]}> {/* Warna tombol diperbarui */}
                            Update
                        </Button>
                    </Card.Content>
                </Card>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Success</Dialog.Title>
                        <Dialog.Content>
                            <Text>Updated successfully</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>OK</Button>
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
        backgroundColor: '#1A202C', // Latar belakang gelap
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: '#2D3748', // Kartu gelap
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#828282', // Input gelap
        color: '#E2E8F0',
        borderColor: '#4A5568',
    },
    updateButton: {
        marginTop: 12,
        backgroundColor: '#FFD700', // Tombol kuning terang
        borderRadius: 16,
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A202C', // Latar loading gelap
    },
});

export default TodoDetailScreen;
