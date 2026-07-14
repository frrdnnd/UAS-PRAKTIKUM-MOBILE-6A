// Wrapper tipis di atas AsyncStorage agar JSON get/set konsisten & aman error.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  SESSION: '@km/session',
  USERS: '@km/users',
  CART: '@km/cart',
  WISHLIST: '@km/wishlist',
  SEARCH_HISTORY: '@km/search_history',
  SEEDED: '@km/seeded',
};

export async function getItem(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}
