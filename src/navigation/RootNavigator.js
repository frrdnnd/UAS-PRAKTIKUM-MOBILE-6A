import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { colors } from '../theme/theme';

// Splash sementara AuthContext mengecek sesi tersimpan.
function BootSplash() {
  return (
    <LinearGradient colors={colors.gradient} style={styles.splash}>
      <View style={styles.logo}>
        <Ionicons name="bag-handle" size={44} color={colors.white} />
      </View>
      <Text style={styles.brand}>KampusMarket</Text>
      <ActivityIndicator color={colors.white} style={{ marginTop: 24 }} />
    </LinearGradient>
  );
}

// Gerbang navigasi: Auth vs Main berdasarkan status login.
export default function RootNavigator() {
  const { isAuthed, booting } = useAuth();

  if (booting) return <BootSplash />;

  return (
    <NavigationContainer>
      {isAuthed ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  brand: { color: colors.white, fontSize: 26, fontFamily: 'Jakarta_800ExtraBold', letterSpacing: 0.5 },
});
