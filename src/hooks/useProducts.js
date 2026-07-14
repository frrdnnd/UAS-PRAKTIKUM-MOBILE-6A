import { useCallback, useEffect, useState } from 'react';
import { getProducts, getProductsByCategory, searchProducts } from '../api/dummyjson';

const PAGE_SIZE = 10;

// Hook pengelola daftar produk: fetch + pagination + state (loading/error/refresh).
// Mendukung mode: default (semua), kategori, dan pencarian.
export default function useProducts({ category = null, query = '' } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // load pertama
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [loadingMore, setLoadingMore] = useState(false); // infinite scroll
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  // Pilih endpoint sesuai mode aktif
  const fetchPage = useCallback(
    async (pageSkip) => {
      const q = query.trim();
      if (q) return searchProducts(q, { limit: PAGE_SIZE, skip: pageSkip });
      if (category) return getProductsByCategory(category, { limit: PAGE_SIZE, skip: pageSkip });
      return getProducts({ limit: PAGE_SIZE, skip: pageSkip });
    },
    [category, query]
  );

  // Muat halaman pertama (atau reset saat filter berubah)
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPage(0);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setSkip(PAGE_SIZE);
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  // Reload tiap kategori/query berubah
  useEffect(() => {
    load();
  }, [load]);

  // Pull-to-refresh
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await fetchPage(0);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setSkip(PAGE_SIZE);
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage]);

  // Muat halaman berikutnya untuk infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || loading || refreshing) return;
    if (products.length >= total) return; // sudah habis
    setLoadingMore(true);
    try {
      const data = await fetchPage(skip);
      setProducts((prev) => {
        // Cegah duplikat id saat menggabung halaman
        const ids = new Set(prev.map((p) => p.id));
        const next = (data.products || []).filter((p) => !ids.has(p.id));
        return [...prev, ...next];
      });
      setSkip((s) => s + PAGE_SIZE);
    } catch (e) {
      // Diamkan error load-more agar UX tetap mulus; user bisa scroll lagi
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, loading, loadingMore, refreshing, products.length, total, skip]);

  const hasMore = products.length < total;

  return {
    products,
    loading,
    refreshing,
    loadingMore,
    error,
    total,
    hasMore,
    refresh,
    loadMore,
    reload: load,
  };
}
