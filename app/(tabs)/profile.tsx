import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderEdit from '@/components/Headerseting';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageSourcePropType } from 'react-native';


interface SettingItem {
  id: number;
  title: string;
  description: string;
  icon: ImageSourcePropType;
  color?: string;
}

const Pengaturan: React.FC = () => {
  const router = useRouter();

  const handlePress = (id: number): void => {
    if (id === 4) {
      AsyncStorage.removeItem('token');
      router.replace('/auth/LoginScreen');
    } else {
      console.log(`Navigasi ke halaman dengan id: ${id}`);
    }
  };

  const settings: SettingItem[] = [
    {
      id: 1,
      title: 'Akun',
      description: 'Privasi, sekuriti, dan ganti email atau password',
      icon: require('../../assets/images/user.png'),
    },
    {
      id: 2,
      title: 'Notifikasi',
      description: 'Notifikasi chat, tugas, dan materi',
      icon: require('../../assets/images/bellpengaturan.png'),
    },
    {
      id: 3,
      title: 'Bantuan',
      description: 'Kostumer servis, bantuan, dan lainnya',
      icon: require('../../assets/images/help.png'),
    },
    {
      id: 4,
      title: 'Keluar',
      description: '',
      icon: require('../../assets/images/log-out.png'),
      color: 'red',
    },
  ];

  return (
    <View style={styles.container}>
      <HeaderEdit />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bawa}>
          <Text style={styles.headerText}>Pengaturan</Text>
          <View style={styles.separator} />

          {settings.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingRow}
              onPress={() => handlePress(item.id)}
            >
              <Image style={styles.icon} source={item.icon} />
              <View style={styles.textContainer}>
                <Text style={[styles.title, item.color && { color: item.color }]}>{item.title}</Text>
                {item.description ? (
                  <Text style={styles.description}>{item.description}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Pengaturan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingBottom: 100, 
  },
  bawa: {
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1,
    marginBottom: 10,
    marginTop: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 2,
  },
  icon: {
    marginRight: 10,
    width: 24,
    height: 24, 
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 10,
    fontWeight: '300',
    color: '#666',
  },
});
