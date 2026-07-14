import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getItem, setItem, KEYS } from '../utils/storage';

const WishlistContext = createContext(null);

// Wishlist: daftar produk favorit, toggle hati, persist ke AsyncStorage.
export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    (async () => {
      const saved = await getItem(KEYS.WISHLIST, []);
      setItems(saved);
      setHydrated(true);
    })();
  }, []);

  // Persist setelah hydrate
  useEffect(() => {
    if (!hydrated) return;
    if (first.current) {
      first.current = false;
      return;
    }
    setItem(KEYS.WISHLIST, items);
  }, [items, hydrated]);

  const isWished = (id) => items.some((i) => i.id === id);

  // Toggle: kembalikan true bila hasilnya ditambahkan (untuk feedback/haptic)
  const toggleWishlist = (product) => {
    let added = false;
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) {
        return prev.filter((i) => i.id !== product.id);
      }
      added = true;
      return [
        {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
          rating: product.rating,
          stock: product.stock,
          category: product.category,
        },
        ...prev,
      ];
    });
    return added;
  };

  const removeWishlist = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const value = { items, count: items.length, isWished, toggleWishlist, removeWishlist };
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist harus dipakai di dalam WishlistProvider');
  return ctx;
}
