import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import AppButton from '../../components/AppButton';
import RatingStars from '../../components/RatingStars';
import QuantityStepper from '../../components/QuantityStepper';
import ProductCard from '../../components/ProductCard';
import ErrorState from '../../components/ErrorState';
import { colors, radius, spacing, shadow } from '../../theme/theme';
import {
  formatRupiah,
  priceIDR,
  originalPriceIDR,
  discountLabel,
  titleCase,
} from '../../utils/format';
import { getProductById, getProductsByCategory } from '../../api/dummyjson';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

const { width } = Dimensions.get('window');
const BLUR = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function ProductDetailScreen({ route, navigation }) {
  const { id, product: initial } = route.params;
  const { addToCart } = useCart();
  const { isWished, toggleWishlist } = useWishlist();
  const toast = useToast();

  const [product, setProduct] = useState(initial || null);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [similar, setSimilar] = useState([]);

  // Ambil detail lengkap + produk serupa (kategori sama).
  const load = async () => {
    setLoading(!product);
    setError(false);
    try {
      const data = await getProductById(id);
      setProduct(data);
      // Produk serupa: kategori sama, kecuali dirinya
      getProductsByCategory(data.category, { limit: 10 })
        .then((res) => setSimilar((res.products || []).filter((p) => p.id !== data.id).slice(0, 6)))
        .catch(() => setSimilar([]));
    } catch (e) {
      if (!product) setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onAddCart = () => {
    addToCart(product, qty);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.success(`${qty} item ditambahkan ke keranjang`);
  };

  const onBuyNow = () => {
    addToCart(product, qty);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.getParent()?.navigate('CartTab');
  };

  const onWish = () => {
    const added = toggleWishlist(product);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toast.info(added ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist');
  };

  const goDetail = (p) => navigation.push('ProductDetail', { id: p.id, product: p });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.root}>
        <ErrorState onRetry={load} />
      </SafeAreaView>
    );
  }

  const images = product.images && product.images.length ? product.images : [product.thumbnail];
  const discount = discountLabel(product);
  const wished = isWished(product.id);
  const outOfStock = product.stock <= 0;

  return (
    <View style={styles.root}>
      {/* Header mengambang */}
      <SafeAreaView edges={['top']} style={styles.floatHeader} pointerEvents="box-none">
        <Pressable style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Pressable style={styles.circleBtn} onPress={onWish}>
          <Ionicons
            name={wished ? 'heart' : 'heart-outline'}
            size={22}
            color={wished ? colors.accent : colors.textPrimary}
          />
        </Pressable>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Carousel gambar */}
        <View>
          <FlatList
            data={images}
            keyExtractor={(item, i) => `img-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) =>
              setActiveImg(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.carouselImg}
                contentFit="contain"
                transition={250}
                placeholder={BLUR}
              />
            )}
          />
          {/* Dot indicator */}
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeImg && styles.dotActive]} />
              ))}
            </View>
          )}
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>HEMAT {discount}</Text>
            </View>
          )}
        </View>

        {/* Info utama */}
        <View style={styles.body}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.brand || titleCase(product.category)}</Text>
            <View style={styles.stockPill}>
              <Ionicons
                name={outOfStock ? 'close-circle' : 'checkmark-circle'}
                size={13}
                color={outOfStock ? colors.danger : colors.success}
              />
              <Text style={[styles.stockText, { color: outOfStock ? colors.danger : colors.success }]}>
                {outOfStock ? 'Habis' : `Stok ${product.stock}`}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <RatingStars rating={product.rating} size={16} reviews={product.reviews?.length ?? undefined} />
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatRupiah(priceIDR(product))}</Text>
            {discount && <Text style={styles.original}>{formatRupiah(originalPriceIDR(product))}</Text>}
          </View>

          {/* Deskripsi */}
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.desc}>{product.description}</Text>

          {/* Info tambahan */}
          <View style={styles.infoGrid}>
            <InfoItem icon="cube-outline" label="Kategori" value={titleCase(product.category)} />
            <InfoItem icon="ribbon-outline" label="Brand" value={product.brand || '-'} />
          </View>

          {/* Jumlah */}
          <View style={styles.qtyRow}>
            <Text style={styles.sectionTitle}>Jumlah</Text>
            <QuantityStepper value={qty} onChange={setQty} min={1} max={Math.max(1, product.stock)} />
          </View>

          {/* Produk serupa */}
          {similar.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Produk Serupa</Text>
              <FlatList
                data={similar}
                keyExtractor={(item) => `sim-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing.md, paddingVertical: spacing.sm }}
                renderItem={({ item }) => (
                  <View style={{ width: 150 }}>
                    <ProductCard product={item} onPress={() => goDetail(item)} />
                  </View>
                )}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* Bar aksi bawah */}
      <SafeAreaView edges={['bottom']} style={styles.actionBar}>
        <AppButton
          title="+ Keranjang"
          variant="outline"
          icon="bag-add-outline"
          onPress={onAddCart}
          disabled={outOfStock}
          fullWidth={false}
          style={styles.actionBtn}
        />
        <AppButton
          title="Beli Sekarang"
          onPress={onBuyNow}
          disabled={outOfStock}
          fullWidth={false}
          style={styles.actionBtn}
        />
      </SafeAreaView>
    </View>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  floatHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  scroll: { paddingBottom: 120 },
  carouselImg: { width, height: width, backgroundColor: colors.surface },
  dots: {
    position: 'absolute',
    bottom: spacing.base,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  discountBadge: {
    position: 'absolute',
    top: 80,
    left: spacing.base,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  discountText: { color: colors.white, fontSize: 12, fontFamily: 'Jakarta_700Bold' },
  body: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -spacing.xl,
    padding: spacing.lg,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontSize: 13, fontFamily: 'Jakarta_700Bold', color: colors.primary, textTransform: 'uppercase' },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stockText: { fontSize: 12, fontFamily: 'Jakarta_600SemiBold' },
  title: { fontSize: 22, fontFamily: 'Jakarta_800ExtraBold', color: colors.textPrimary, marginTop: spacing.sm, lineHeight: 28 },
  ratingRow: { marginTop: spacing.sm },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md, marginTop: spacing.md },
  price: { fontSize: 26, fontFamily: 'Jakarta_800ExtraBold', color: colors.primary },
  original: { fontSize: 15, fontFamily: 'Jakarta_500Medium', color: colors.textTertiary, textDecorationLine: 'line-through' },
  sectionTitle: { fontSize: 16, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm },
  desc: { fontSize: 14, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary, lineHeight: 22 },
  infoGrid: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.base },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: 11, fontFamily: 'Jakarta_500Medium', color: colors.textTertiary },
  infoValue: { fontSize: 13, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.card,
  },
  actionBtn: { flex: 1 },
});
