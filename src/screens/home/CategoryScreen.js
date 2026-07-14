import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProductCard from '../../components/ProductCard';
import SkeletonCard from '../../components/SkeletonCard';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import SortSheet, { applySort, SORT_OPTIONS } from '../../components/SortSheet';
import { colors, radius, spacing } from '../../theme/theme';
import useProducts from '../../hooks/useProducts';

export default function CategoryScreen({ route, navigation }) {
  const { slug, name } = route.params;
  const [sort, setSort] = useState('default');
  const [sortVisible, setSortVisible] = useState(false);

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
  } = useProducts({ category: slug });

  const sorted = useMemo(() => applySort(products, sort), [products, sort]);
  const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label;
  const goDetail = (product) => navigation.navigate('ProductDetail', { id: product.id, product });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {name}
        </Text>
        <Pressable style={styles.back} onPress={() => setSortVisible(true)}>
          <Ionicons name="swap-vertical" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {error && !loading ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <View style={styles.grid}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.gridCell}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          ListHeaderComponent={
            <View style={styles.subHead}>
              <Text style={styles.count}>{products.length} produk</Text>
              <Pressable style={styles.sortBtn} onPress={() => setSortVisible(true)}>
                <Ionicons name="swap-vertical" size={14} color={colors.primary} />
                <Text style={styles.sortText}>{activeSortLabel}</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.gridCell}>
              <ProductCard product={item} onPress={() => goDetail(item)} />
            </View>
          )}
          ListEmptyComponent={
            <EmptyState icon="cube-outline" title="Kategori kosong" subtitle="Belum ada produk di sini." />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />
            ) : !hasMore && sorted.length > 0 ? (
              <Text style={styles.endText}>— Sudah semua produk —</Text>
            ) : null
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  subHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  count: { fontSize: 13, fontFamily: 'Jakarta_600SemiBold', color: colors.textSecondary },
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.base, gap: spacing.md },
  gridCell: { flex: 1, marginBottom: spacing.md },
  column: { paddingHorizontal: spacing.base, gap: spacing.md },
  listContent: { paddingBottom: spacing.xxl },
  endText: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: 12,
    fontFamily: 'Jakarta_500Medium',
    marginVertical: spacing.lg,
  },
});
