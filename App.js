import React, { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { ToastProvider } from './src/context/ToastContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/theme';

// Tahan splash sampai font siap (fallback ke system font bila gagal).
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  // Muat Plus Jakarta Sans dan petakan ke nama family yang dipakai di theme.
  const [fontsLoaded, fontError] = useFonts({
    Jakarta_500Medium: PlusJakartaSans_500Medium,
    Jakarta_600SemiBold: PlusJakartaSans_600SemiBold,
    Jakarta_700Bold: PlusJakartaSans_700Bold,
    Jakarta_800ExtraBold: PlusJakartaSans_800ExtraBold,
  });

  // Sembunyikan splash setelah font selesai / gagal (agar app tak nyangkut).
  const onLayout = useCallback(async () => {
    if (fontsLoaded || fontError) await SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayout}>
        <StatusBar style="dark" />
        {/* Susunan provider: Auth -> Cart -> Wishlist -> Toast -> Navigasi */}
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <RootNavigator />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}
