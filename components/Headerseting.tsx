import axios from "axios";
import React, { useState, useEffect } from "react";
import API_URL from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";

type UserProfile = {
  username: string;
  email: string;
};

const HeaderEdit = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");
      const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error("Gagal memuat profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = () => {
    setModalVisible(true);
    setNewName(profile?.username || "");
  };

  const handleSaveName = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");
      await axios.put(
        `${API_URL}/api/profile`,
        { username: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile((prev) => (prev ? { ...prev, username: newName } : prev));
      setModalVisible(false);
    } catch (error) {
      console.error("Gagal memperbarui nama:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.profileContainer}>
        <Image source={require("../assets/images/profile.png")} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile?.username || "Nama tidak tersedia"}</Text>
            <TouchableOpacity onPress={handleEditName}>
              <Image
                source={require("../assets/images/edit.png")}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.rank}>{profile?.email || "Email tidak tersedia"}</Text>
        </View>
      </View>

      {/* Modal untuk edit nama */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Nama</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Masukkan nama baru"
            />
            <View style={styles.modalButtons}>
              <Button title="Batal" onPress={() => setModalVisible(false)} />
              <Button title="Simpan" onPress={handleSaveName} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 30,
      backgroundColor: "#1A202C", // Latar belakang gelap
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
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
      borderColor: "#F6E05E", // Bingkai kuning
    },
    textContainer: {
      flexDirection: "column",
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#F6E05E", // Teks kuning mencolok
    },
    editIcon: {
      width: 16,
      height: 16,
      marginLeft: 8,
      tintColor: "#F6E05E", // Ikon edit kuning
    },
    rank: {
      fontSize: 14,
      color: "#E2E8F0", // Teks abu terang untuk email
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)", // Latar belakang modal gelap transparan
    },
    modalContainer: {
      backgroundColor: "#2D3748", // Modal dengan latar gelap
      padding: 20,
      borderRadius: 10,
      width: 300,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#F6E05E", // Teks kuning untuk judul modal
      marginBottom: 12,
    },
    input: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#4A5568", // Border abu-abu gelap
      padding: 10,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: "#1A202C", // Latar belakang input gelap
      color: "#E2E8F0", // Teks putih
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  

export default HeaderEdit;
