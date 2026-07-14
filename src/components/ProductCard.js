import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, shadow } from '../theme/theme';
import { formatRupiah, priceIDR, originalPriceIDR, discountLabel } from '../utils/format';
import { useWishlist } from '../context/WishlistContext';
import RatingStars from './RatingStars';

const BLUR_HASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

// Kartu produk reusable: gambar, judul, harga, rating, badge diskon, tombol wishlist.
// Dipakai di Home, Kategori, Search, Wishlist (grid).
export default function ProductCard({ product, onPress, style }) {
  const { isWished, toggleWishlist } = useWishlist();
  const wished = isWished(product.id);

  const pressScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true, friction: 7 }).start();
  const pressOut = () =>
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 7 }).start();

  // Animasi "pop" saat toggle wishlist + haptic.
  const onHeart = () => {
    const added = toggleWishlist(product);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    heartScale.setValue(0.6);
    Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
    return added;
  };

  const discount = discountLabel(product);

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale: pressScale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={styles.card}>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            contentFit="cover"
            transition={300}
            placeholder={BLUR_HASH}
          />
          {discount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HEMAT {discount}</Text>
            </View>
          )}
          <Pressable onPress={onHeart} hitSlop={8} style={styles.heart}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={wished ? 'heart' : 'heart-outline'}
                size={18}
                color={wished ? colors.accent : colors.textSecondary}
              />
            </Animated.View>
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <RatingStars rating={product.rating} size={12} />
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatRupiah(priceIDR(product))}</Text>
          </View>
          {discount && (
            <Text style={styles.original}>{formatRupiah(originalPriceIDR(product))}</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.soft,
  },
  imageWrap: { position: 'relative' },
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
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  price: { fontSize: 15, fontFamily: 'Jakarta_800ExtraBold', color: colors.primary },
  original: {
    fontSize: 12,
    fontFamily: 'Jakarta_500Medium',
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
});
