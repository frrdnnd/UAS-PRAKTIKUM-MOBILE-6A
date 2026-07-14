import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import AppButton from '../components/AppButton';
import { colors, radius, spacing } from '../theme/theme';
import { formatRupiah } from '../utils/format';

export default function CheckoutSuccessScreen({ route, navigation }) {
  const { count = 0, total = 0 } = route.params || {};
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  // Animasi ceklis "pop" + haptic sukses saat layar muncul.
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }),
      Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [scale, fade]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Animated.View style={[styles.checkWrap, { transform: [{ scale }] }]}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={56} color={colors.white} />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
          <Text style={styles.title}>Pesanan Berhasil! 🎉</Text>
          <Text style={styles.subtitle}>
            Terima kasih sudah berbelanja di KampusMarket. Pesananmu sedang diproses.
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Jumlah item</Text>
              <Text style={styles.value}>{count} item</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Total bayar</Text>
              <Text style={styles.total}>{formatRupiah(total)}</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Lanjut Belanja"
          icon="storefront-outline"
          onPress={() => navigation.getParent()?.navigate('HomeTab')}
        />
        <AppButton
          title="Kembali ke Keranjang"
          variant="ghost"
          onPress={() => navigation.navigate('Cart')}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  checkWrap: { marginBottom: spacing.xl },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: { fontSize: 24, fontFamily: 'Jakarta_800ExtraBold', color: colors.textPrimary, textAlign: 'center' },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Jakarta_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 21,
    paddingHorizontal: spacing.base,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 14, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary },
  value: { fontSize: 14, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  total: { fontSize: 20, fontFamily: 'Jakarta_800ExtraBold', color: colors.primary },
  footer: { padding: spacing.lg },
});
