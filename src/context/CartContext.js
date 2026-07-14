import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { getItem, setItem, KEYS } from '../utils/storage';

const CartContext = createContext(null);

// State cart dikelola useReducer agar mutasi eksplisit & mudah diuji.
const initialState = { items: [], hydrated: false };

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.items || [], hydrated: true };
    case 'ADD': {
      const { product, qty = 1 } = action;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        // Tambah qty bila item sudah ada, hormati batas stok
        const max = existing.stock || 99;
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, max) } : i
          ),
        };
      }
      const item = {
        id: product.id,
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        thumbnail: product.thumbnail,
        stock: product.stock,
        qty: Math.min(qty, product.stock || 99),
      };
      return { ...state, items: [...state.items, item] };
    }
    case 'SET_QTY': {
      const qty = Math.max(1, action.qty);
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: Math.min(qty, i.stock || 99) } : i
        ),
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const first = useRef(true);

  // Muat cart dari storage saat start
  useEffect(() => {
    (async () => {
      const items = await getItem(KEYS.CART, []);
      dispatch({ type: 'HYDRATE', items });
    })();
  }, []);

  // Persist tiap kali items berubah (setelah hydrate pertama)
  useEffect(() => {
    if (!state.hydrated) return;
    if (first.current) {
      first.current = false;
      return;
    }
    setItem(KEYS.CART, state.items);
  }, [state.items, state.hydrated]);

  const addToCart = (product, qty = 1) => dispatch({ type: 'ADD', product, qty });
  const setQty = (id, qty) => dispatch({ type: 'SET_QTY', id, qty });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  // Turunan: total item & subtotal (USD; diformat ke IDR di layar)
  const { count, subtotal } = useMemo(() => {
    let c = 0;
    let s = 0;
    for (const i of state.items) {
      c += i.qty;
      s += i.price * i.qty;
    }
    return { count: c, subtotal: s };
  }, [state.items]);

  const isInCart = (id) => state.items.some((i) => i.id === id);

  const value = {
    items: state.items,
    count,
    subtotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    isInCart,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart harus dipakai di dalam CartProvider');
  return ctx;
}
