import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  ActivityIndicator,
  Card,
  Text,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTodos } from "@/context/TodoContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "@/config/config";

const TweetSemua = () => {
  const [profile, setProfile] = useState(null);
  const { todos, fetchTodos } = useTodos();
  const [loading, setLoading] = useState(true);
  const [dialogMessage, setDialogMessage] = useState("");
  const [likes, setLikes] = useState({});
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTodos();
      await fetchProfile();

      const initialLikes = {};
      todos.forEach((todo) => {
        initialLikes[todo._id] = todo.likedBy.includes(profile?.id); // Tentukan apakah user sudah like
      });
      setLikes(initialLikes);

      setLoading(false);
    };
    loadData();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error("Gagal memuat profil:", error);
      setDialogMessage("Gagal memuat profil. Silakan coba lagi.");
    }
  };

  const toggleLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

      const isLiked = likes[postId];
      const endpoint = isLiked ? `/api/posts/${postId}/unlike` : `/api/posts/${postId}/like`;

      await axios.post(`${API_URL}${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state locally
      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: !isLiked,
      }));
    } catch (error) {
      console.error("Gagal mengubah status like:", error);
      setDialogMessage("Gagal mengubah status like. Silakan coba lagi.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Tweet
      </ThemedText>
      {loading ? (
        <ActivityIndicator style={styles.loading} animating={true} />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card} elevation={3}>
              <Card.Content>
                <View style={styles.profileContainer}>
                  <Image source={require("../../assets/images/profile.png")} style={styles.profileImage} />
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>
                      {profile?.username || "Nama tidak tersedia"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{ borderBottomWidth: 1, marginBottom: 2, marginTop: 15 }}
                />
                <Text variant="titleMedium">{item.title}</Text>
                <Text variant="bodyMedium" style={styles.description}>
                  {item.description}
                </Text>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => toggleLike(item._id)}
                >
                  <Text style={styles.likeText}>
                    {likes[item._id] ? "❤️ Liked" : "🤍 Like"}
                  </Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1A202C",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F6E05E",
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
    backgroundColor: "#2D3748",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  description: {
    color: "#E2E8F0",
    marginTop: 4,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#F6E05E",
  },
  textContainer: {
    flexDirection: "column",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F6E05E",
  },
  likeButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  likeText: {
    fontSize: 16,
    color: "#F6E05E",
    fontWeight: "600",
  },
});

export default TweetSemua;
