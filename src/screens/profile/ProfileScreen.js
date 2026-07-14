import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { colors, radius, spacing, shadow } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

// Ambil inisial dari nama untuk avatar.
function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const MENU = [
  { key: 'about', icon: 'information-circle-outline', label: 'Tentang Aplikasi', screen: 'About' },
  { key: 'help', icon: 'help-buoy-outline', label: 'Bantuan', soon: true },
  { key: 'address', icon: 'location-outline', label: 'Alamat', soon: true },
  { key: 'payment', icon: 'card-outline', label: 'Metode Pembayaran', soon: true },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const toast = useToast();

  const onLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout(); // hapus sesi -> RootNavigator otomatis balik ke Login
  };

  const onMenu = (item) => {
    if (item.screen) navigation.navigate(item.screen);
    else if (item.soon) toast.info('Segera hadir 🚧');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Profil</Text>

        {/* Kartu profil */}
        <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user?.name) || 'KM'}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.name}>{user?.name || 'Pengguna'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.badge}>
              <Ionicons name="school" size={12} color={colors.white} />
              <Text style={styles.badgeText}>Mahasiswa UIR</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Statistik */}
        <View style={styles.stats}>
          <Stat icon="heart" label="Wishlist" value={wishCount} />
          <View style={styles.statDivider} />
          <Stat icon="bag" label="Keranjang" value={count} />
          <View style={styles.statDivider} />
          <Stat icon="cube" label="Pesanan" value={12} />
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU.map((item, i) => (
            <Pressable
              key={item.key}
              style={[styles.menuItem, i < MENU.length - 1 && styles.menuBorder]}
              onPress={() => onMenu(item)}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.soon && <Text style={styles.soonTag}>Segera</Text>}
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Pressable style={styles.logout} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Keluar</Text>
        </Pressable>

        <Text style={styles.version}>KampusMarket v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, label, value }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.base, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: 22, fontFamily: 'Jakarta_800ExtraBold', color: colors.textPrimary, marginBottom: spacing.base },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow.card,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontSize: 24, fontFamily: 'Jakarta_800ExtraBold' },
  name: { color: colors.white, fontSize: 18, fontFamily: 'Jakarta_800ExtraBold' },
  email: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: 'Jakarta_500Medium', marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  badgeText: { color: colors.white, fontSize: 11, fontFamily: 'Jakarta_600SemiBold' },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginTop: spacing.base,
    ...shadow.soft,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontFamily: 'Jakarta_800ExtraBold', color: colors.textPrimary },
  statLabel: { fontSize: 12, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginTop: spacing.base,
    paddingHorizontal: spacing.base,
    ...shadow.soft,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.base },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Jakarta_600SemiBold', color: colors.textPrimary },
  soonTag: { fontSize: 11, fontFamily: 'Jakarta_600SemiBold', color: colors.textTertiary, marginRight: spacing.sm },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#FDECEC',
    borderRadius: radius.lg,
    paddingVertical: spacing.base,
    marginTop: spacing.base,
  },
  logoutText: { fontSize: 15, fontFamily: 'Jakarta_700Bold', color: colors.danger },
  version: { textAlign: 'center', fontSize: 12, fontFamily: 'Jakarta_500Medium', color: colors.textTertiary, marginTop: spacing.lg },
});
