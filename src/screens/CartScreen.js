import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import AppButton from '../components/AppButton';
import QuantityStepper from '../components/QuantityStepper';
import EmptyState from '../components/EmptyState';
import { colors, radius, spacing, shadow } from '../theme/theme';
import { formatRupiah, toIDR } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const BLUR = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function CartScreen({ navigation }) {
  const { items, setQty, removeFromCart, subtotal, count, clearCart } = useCart();
  const toast = useToast();

  // Ongkir gratis (promo) -> total = subtotal.
  const subtotalIDR = toIDR(subtotal);
  const shipping = 0;
  const total = subtotalIDR + shipping;

  const onCheckout = () => {
    if (items.length === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const summary = { count, total };
    clearCart(); // kosongkan keranjang setelah checkout
    navigation.navigate('CheckoutSuccess', summary);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumb} contentFit="cover" placeholder={BLUR} transition={200} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>{formatRupiah(toIDR(item.price))}</Text>
        <View style={styles.bottomRow}>
          <QuantityStepper
            value={item.qty}
            onChange={(q) => setQty(item.id, q)}
            min={1}
            max={Math.max(1, item.stock || 99)}
            size="sm"
          />
          <Pressable
            onPress={() => {
              removeFromCart(item.id);
              toast.info('Item dihapus dari keranjang');
            }}
            hitSlop={8}
            style={styles.trash}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keranjang</Text>
        {items.length > 0 && (
          <Pressable
            onPress={() => {
              clearCart();
              toast.info('Keranjang dikosongkan');
            }}
            hitSlop={8}
          >
            <Text style={styles.clear}>Kosongkan</Text>
          </Pressable>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="bag-outline"
          title="Keranjang kosong"
          subtitle="Yuk, tambahkan produk favoritmu ke keranjang."
          actionLabel="Mulai belanja"
          onAction={() => navigation.getParent()?.navigate('HomeTab')}
        />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />

          {/* Ringkasan pesanan */}
          <View style={styles.summary}>
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Subtotal ({count} item)</Text>
              <Text style={styles.sumValue}>{formatRupiah(subtotalIDR)}</Text>
            </View>
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Ongkos kirim</Text>
              <Text style={styles.free}>GRATIS</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.sumRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatRupiah(total)}</Text>
            </View>
            <AppButton
              title="Checkout Sekarang"
              icon="card-outline"
              onPress={onCheckout}
              style={{ marginTop: spacing.md }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Jakarta_800ExtraBold', color: colors.textPrimary },
  clear: { fontSize: 13, fontFamily: 'Jakarta_600SemiBold', color: colors.danger },
  list: { padding: spacing.base, gap: spacing.md },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.soft,
  },
  thumb: { width: 88, height: 88, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  info: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 14, fontFamily: 'Jakarta_600SemiBold', color: colors.textPrimary, lineHeight: 19 },
  price: { fontSize: 15, fontFamily: 'Jakarta_800ExtraBold', color: colors.primary, marginTop: 2 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  trash: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    ...shadow.strong,
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sumLabel: { fontSize: 14, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary },
  sumValue: { fontSize: 14, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  free: { fontSize: 14, fontFamily: 'Jakarta_700Bold', color: colors.success },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  totalLabel: { fontSize: 16, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  totalValue: { fontSize: 20, fontFamily: 'Jakarta_800ExtraBold', color: colors.primary },
});
