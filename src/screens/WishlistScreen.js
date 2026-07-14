import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import EmptyState from '../components/EmptyState';
import RatingStars from '../components/RatingStars';
import { colors, radius, spacing, shadow } from '../theme/theme';
import { formatRupiah, priceIDR, discountLabel } from '../utils/format';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const BLUR = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function WishlistScreen({ navigation }) {
  const { items, removeWishlist } = useWishlist();
  const { addToCart } = useCart();
  const toast = useToast();

  const goDetail = (product) => navigation.navigate('ProductDetail', { id: product.id, product });

  // Pindahkan ke keranjang lalu hapus dari wishlist.
  const moveToCart = (product) => {
    addToCart(product, 1);
    removeWishlist(product.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.success('Dipindahkan ke keranjang');
  };

  const renderItem = ({ item }) => {
    const discount = discountLabel(item);
    return (
      <View style={styles.card}>
        <Pressable onPress={() => goDetail(item)}>
          <View>
            <Image source={{ uri: item.thumbnail }} style={styles.image} contentFit="cover" placeholder={BLUR} transition={250} />
            {discount && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>HEMAT {discount}</Text>
              </View>
            )}
            <Pressable
              onPress={() => {
                removeWishlist(item.id);
                toast.info('Dihapus dari wishlist');
              }}
              hitSlop={8}
              style={styles.heart}
            >
              <Ionicons name="heart" size={18} color={colors.accent} />
            </Pressable>
          </View>
          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <RatingStars rating={item.rating} size={12} />
            <Text style={styles.price}>{formatRupiah(priceIDR(item))}</Text>
          </View>
        </Pressable>
        <Pressable style={styles.cartBtn} onPress={() => moveToCart(item)}>
          <Ionicons name="bag-add" size={16} color={colors.white} />
          <Text style={styles.cartText}>Ke Keranjang</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist</Text>
        {items.length > 0 && <Text style={styles.count}>{items.length} produk</Text>}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Wishlist masih kosong"
          subtitle="Ketuk ikon hati pada produk untuk menyimpannya di sini."
          actionLabel="Jelajahi produk"
          onAction={() => navigation.getParent()?.navigate('HomeTab')}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
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
  count: { fontSize: 13, fontFamily: 'Jakarta_600SemiBold', color: colors.textSecondary },
  list: { padding: spacing.base, paddingBottom: spacing.xxl, gap: spacing.md },
  column: { gap: spacing.md },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.soft,
  },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.surfaceAlt },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: { color: colors.white, fontSize: 10, fontFamily: 'Jakarta_700Bold' },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: spacing.md, gap: 6 },
  title: { fontSize: 13, fontFamily: 'Jakarta_600SemiBold', color: colors.textPrimary, lineHeight: 18 },
  price: { fontSize: 15, fontFamily: 'Jakarta_800ExtraBold', color: colors.primary },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  cartText: { color: colors.white, fontSize: 12, fontFamily: 'Jakarta_700Bold' },
});
