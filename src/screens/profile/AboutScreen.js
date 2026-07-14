import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadow } from '../../theme/theme';

const FEATURES = [
  { icon: 'search-outline', title: 'Pencarian Real-time', desc: 'Cari produk dengan debounce & riwayat.' },
  { icon: 'flash-outline', title: 'Flash Sale', desc: 'Produk diskon tertinggi tiap hari.' },
  { icon: 'heart-outline', title: 'Wishlist', desc: 'Simpan produk favorit dan beli nanti.' },
  { icon: 'bag-handle-outline', title: 'Keranjang & Checkout', desc: 'Kelola pesanan hingga bayar.' },
];

const TECH = ['Expo SDK 54', 'React Native 0.81', 'React Navigation v7', 'Context + useReducer', 'DummyJSON API'];

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
        <View style={styles.back} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="bag-handle" size={38} color={colors.white} />
          </View>
          <Text style={styles.brand}>KampusMarket</Text>
          <Text style={styles.version}>Versi 1.0.0</Text>
          <Text style={styles.tagline}>Marketplace jual-beli barang bekas mahasiswa</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Fitur Utama</Text>
        <View style={styles.card}>
          {FEATURES.map((f, i) => (
            <View key={f.title} style={[styles.featureRow, i < FEATURES.length - 1 && styles.border]}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Teknologi</Text>
        <View style={styles.chips}>
          {TECH.map((t) => (
            <View key={t} style={styles.chip}>
              <Text style={styles.chipText}>{t}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Tentang</Text>
        <View style={styles.card}>
          <Text style={styles.about}>
            KampusMarket dibuat sebagai proyek UAS Praktikum Pemrograman Mobile. Aplikasi ini
            mendemonstrasikan layout & flexbox, komponen reusable, list dengan infinite scroll,
            manajemen state via Context API, form dengan validasi, navigasi bertingkat, serta
            integrasi API. Dibangun dengan tema visual "Aurora" yang bersih dan modern.
          </Text>
        </View>

        <Text style={styles.copyright}>© 2025 KampusMarket · Dibuat dengan 💜</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  scroll: { padding: spacing.base, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', borderRadius: radius.xl, padding: spacing.xl, ...shadow.card },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: { color: colors.white, fontSize: 22, fontFamily: 'Jakarta_800ExtraBold' },
  version: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: 'Jakarta_600SemiBold', marginTop: 2 },
  tagline: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: 'Jakarta_500Medium', marginTop: spacing.sm, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.base, ...shadow.soft },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.base },
  border: { borderBottomWidth: 1, borderBottomColor: colors.border },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { fontSize: 14, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  featureDesc: { fontSize: 13, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full },
  chipText: { fontSize: 13, fontFamily: 'Jakarta_600SemiBold', color: colors.primary },
  about: { fontSize: 14, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary, lineHeight: 22, padding: spacing.base, paddingHorizontal: 0 },
  copyright: { textAlign: 'center', fontSize: 12, fontFamily: 'Jakarta_500Medium', color: colors.textTertiary, marginTop: spacing.xl },
});
