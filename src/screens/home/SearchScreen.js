import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProductCard from '../../components/ProductCard';
import SkeletonCard from '../../components/SkeletonCard';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme/theme';
import useDebounce from '../../hooks/useDebounce';
import { searchProducts } from '../../api/dummyjson';
import { getItem, setItem, removeItem, KEYS } from '../../utils/storage';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  // Debounce 350ms agar tidak fetch tiap ketikan.
  const debounced = useDebounce(query, 350);

  // Muat riwayat pencarian + fokus input saat masuk.
  useEffect(() => {
    (async () => setHistory(await getItem(KEYS.SEARCH_HISTORY, [])))();
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  // Jalankan pencarian saat nilai debounce berubah.
  useEffect(() => {
    const q = debounced.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    searchProducts(q, { limit: 20, skip: 0 })
      .then((data) => {
        if (active) setResults(data.products || []);
      })
      .catch(() => active && setResults([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debounced]);

  // Simpan kata ke riwayat (maks 8, tanpa duplikat).
  const saveHistory = async (word) => {
    const w = word.trim();
    if (!w) return;
    const next = [w, ...history.filter((h) => h.toLowerCase() !== w.toLowerCase())].slice(0, 8);
    setHistory(next);
    await setItem(KEYS.SEARCH_HISTORY, next);
  };

  const clearHistory = async () => {
    setHistory([]);
    await removeItem(KEYS.SEARCH_HISTORY);
  };

  const goDetail = (product) => {
    saveHistory(query);
    navigation.navigate('ProductDetail', { id: product.id, product });
  };

  const showHistory = !query.trim();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Search bar dengan tombol kembali & clear */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Cari produk..."
            placeholderTextColor={colors.textTertiary}
            returnKeyType="search"
            onSubmitEditing={() => saveHistory(query)}
            autoCapitalize="none"
          />
          {!!query && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      {showHistory ? (
        // Riwayat pencarian
        <View style={styles.historyWrap}>
          {history.length > 0 ? (
            <>
              <View style={styles.historyHead}>
                <Text style={styles.historyTitle}>Riwayat Pencarian</Text>
                <Pressable onPress={clearHistory} hitSlop={8}>
                  <Text style={styles.clearText}>Hapus semua</Text>
                </Pressable>
              </View>
              <View style={styles.chips}>
                {history.map((h) => (
                  <Pressable key={h} style={styles.chip} onPress={() => setQuery(h)}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.chipText}>{h}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <EmptyState
              icon="search-outline"
              title="Mulai mencari"
              subtitle="Ketik nama produk yang kamu cari di atas."
            />
          )}
        </View>
      ) : loading ? (
        <View style={styles.grid}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.gridCell}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          icon="sad-outline"
          title="Tidak ditemukan"
          subtitle={`Tidak ada hasil untuk "${query}". Coba kata kunci lain.`}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={styles.resultCount}>{results.length} hasil ditemukan</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.gridCell}>
              <ProductCard product={item} onPress={() => goDetail(item)} />
            </View>
          )}
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
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  back: { width: 36, height: 44, alignItems: 'center', justifyContent: 'center' },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, fontSize: 15, fontFamily: 'Jakarta_500Medium', color: colors.textPrimary, paddingVertical: 0 },
  historyWrap: { padding: spacing.base },
  historyHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  historyTitle: { fontSize: 15, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  clearText: { fontSize: 13, fontFamily: 'Jakarta_600SemiBold', color: colors.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  chipText: { fontSize: 13, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.base, gap: spacing.md },
  gridCell: { flex: 1, marginBottom: spacing.md },
  column: { paddingHorizontal: spacing.base, gap: spacing.md },
  listContent: { paddingBottom: spacing.xxl },
  resultCount: {
    fontSize: 13,
    fontFamily: 'Jakarta_500Medium',
    color: colors.textSecondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
});
