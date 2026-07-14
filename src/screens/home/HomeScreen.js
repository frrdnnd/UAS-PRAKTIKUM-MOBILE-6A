import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProductCard from '../../components/ProductCard';
import CategoryChip from '../../components/CategoryChip';
import SkeletonCard from '../../components/SkeletonCard';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import SortSheet, { applySort, SORT_OPTIONS } from '../../components/SortSheet';
import { colors, radius, spacing, shadow } from '../../theme/theme';
import { titleCase } from '../../utils/format';
import { getCategories, getProducts } from '../../api/dummyjson';
import useProducts from '../../hooks/useProducts';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [sort, setSort] = useState('default');
  const [sortVisible, setSortVisible] = useState(false);

  const [categories, setCategories] = useState([]);
  const [flash, setFlash] = useState([]);
  const [flashLoading, setFlashLoading] = useState(true);

  const {
    products,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
    reload,
  } = useProducts();

  // Muat kategori & flash sale sekali di awal.
  const loadExtras = useCallback(async () => {
    setFlashLoading(true);
    try {
      const [cats, prodData] = await Promise.all([
        getCategories().catch(() => []),
        getProducts({ limit: 40, skip: 0 }).catch(() => ({ products: [] })),
      ]);
      setCategories(cats.slice(0, 12));
      // Flash sale = diskon tertinggi
      const sorted = [...(prodData.products || [])]
        .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
        .slice(0, 8);
      setFlash(sorted);
    } finally {
      setFlashLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExtras();
  }, [loadExtras]);

  // Terapkan sort client-side pada daftar utama.
  const sortedProducts = useMemo(() => applySort(products, sort), [products, sort]);
  const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label;

  const goDetail = (product) => navigation.navigate('ProductDetail', { id: product.id, product });

  const renderHeader = () => (
    <View>
      {/* Hero banner promo */}
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroLeft}>
          <Text style={styles.heroTag}>PROMO KAMPUS</Text>
          <Text style={styles.heroTitle}>Diskon s.d. 70%{'\n'}barang bekas berkualitas</Text>
          <View style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Belanja sekarang</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </View>
        </View>
        <View style={styles.heroIcon}>
          <Ionicons name="pricetags" size={54} color="rgba(255,255,255,0.9)" />
        </View>
      </LinearGradient>

      {/* Kategori */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Kategori</Text>
      </View>
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.slug}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => (
            <CategoryChip
              label={item.name}
              onPress={() =>
                navigation.navigate('Category', { slug: item.slug, name: titleCase(item.name) })
              }
            />
          )}
        />
      ) : (
        <View style={styles.catList}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {/* Flash Sale */}
      <View style={styles.sectionHead}>
        <View style={styles.flashTitle}>
          <Ionicons name="flash" size={18} color={colors.accent} />
          <Text style={styles.sectionTitle}>Flash Sale</Text>
        </View>
      </View>
      {flashLoading ? (
        <View style={styles.flashRow}>
          {[0, 1].map((i) => (
            <View key={i} style={styles.flashCard}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={flash}
          keyExtractor={(item) => `flash-${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flashList}
          renderItem={({ item }) => (
            <View style={styles.flashCard}>
              <ProductCard product={item} onPress={() => goDetail(item)} />
            </View>
          )}
        />
      )}

      {/* Untuk Kamu + tombol sort */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Untuk Kamu</Text>
        <Pressable style={styles.sortBtn} onPress={() => setSortVisible(true)}>
          <Ionicons name="swap-vertical" size={16} color={colors.primary} />
          <Text style={styles.sortText}>{activeSortLabel}</Text>
        </Pressable>
      </View>
    </View>
  );

  // Skeleton grid saat load pertama.
  const renderSkeletons = () => (
    <View style={styles.grid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.gridCell}>
          <SkeletonCard />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Top bar: sapaan + search + wishlist */}
      <View style={styles.topBar}>
        <View style={styles.flex}>
          <Text style={styles.greeting}>Halo, {user?.name?.split(' ')[0] || 'Sobat'} 👋</Text>
          <Text style={styles.greetSub}>Temukan barang bekas terbaik</Text>
        </View>
      </View>
      <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
        <Ionicons name="search" size={20} color={colors.textTertiary} />
        <Text style={styles.searchPlaceholder}>Cari produk, kategori...</Text>
      </Pressable>

      {error && !loading ? (
        <ErrorState onRetry={reload} />
      ) : (
        <FlatList
          data={loading ? [] : sortedProducts}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          initialNumToRender={6}
          renderItem={({ item }) => (
            <View style={styles.gridCell}>
              <ProductCard product={item} onPress={() => goDetail(item)} />
            </View>
          )}
          ListEmptyComponent={
            loading ? (
              renderSkeletons()
            ) : (
              <EmptyState
                icon="cube-outline"
                title="Belum ada produk"
                subtitle="Coba tarik untuk menyegarkan."
                actionLabel="Muat ulang"
                onAction={reload}
              />
            )
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />
            ) : !hasMore && sortedProducts.length > 0 ? (
              <Text style={styles.endText}>— Sudah semua produk —</Text>
            ) : (
              <View style={{ height: spacing.lg }} />
            )
          }
        />
      )}

      <SortSheet
        visible={sortVisible}
        current={sort}
        onSelect={(key) => {
          setSort(key);
          setSortVisible(false);
        }}
        onClose={() => setSortVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  greeting: { fontSize: 20, fontFamily: 'Jakarta_800ExtraBold', color: colors.textPrimary },
  greetSub: { fontSize: 13, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary, marginTop: 2 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  searchPlaceholder: { fontSize: 14, fontFamily: 'Jakarta_500Medium', color: colors.textTertiary },
  listContent: { paddingBottom: spacing.xxl },
  column: { paddingHorizontal: spacing.base, gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.base, gap: spacing.md },
  gridCell: { flex: 1, marginBottom: spacing.md },
  hero: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  heroLeft: { flex: 1, justifyContent: 'center' },
  heroTag: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: 'Jakarta_700Bold', letterSpacing: 1 },
  heroTitle: { color: colors.white, fontSize: 18, fontFamily: 'Jakarta_800ExtraBold', marginTop: 6, lineHeight: 24 },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.md,
  },
  heroBtnText: { color: colors.primary, fontSize: 13, fontFamily: 'Jakarta_700Bold' },
  heroIcon: { justifyContent: 'center', paddingLeft: spacing.sm },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 18, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  flashTitle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catList: { paddingHorizontal: spacing.base, gap: spacing.sm },
  flashList: { paddingHorizontal: spacing.base, gap: spacing.md },
  flashRow: { flexDirection: 'row', paddingHorizontal: spacing.base, gap: spacing.md },
  flashCard: { width: 150 },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  sortText: { fontSize: 12, fontFamily: 'Jakarta_600SemiBold', color: colors.primary },
  endText: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: 12,
    fontFamily: 'Jakarta_500Medium',
    marginVertical: spacing.lg,
  },
});
