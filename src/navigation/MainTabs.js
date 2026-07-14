import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/home/SearchScreen';
import CategoryScreen from '../screens/home/CategoryScreen';
import ProductDetailScreen from '../screens/home/ProductDetailScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutSuccessScreen from '../screens/CheckoutSuccessScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AboutScreen from '../screens/profile/AboutScreen';

import { colors, spacing, shadow } from '../theme/theme';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();
const HomeStackNav = createNativeStackNavigator();
const CartStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

// Stack di dalam tab Home: katalog -> detail -> search -> kategori.
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="Home" component={HomeScreen} />
      <HomeStackNav.Screen name="ProductDetail" component={ProductDetailScreen} />
      <HomeStackNav.Screen name="Search" component={SearchScreen} />
      <HomeStackNav.Screen name="Category" component={CategoryScreen} />
    </HomeStackNav.Navigator>
  );
}

// Stack tab Cart: keranjang -> sukses checkout.
function CartStack() {
  return (
    <CartStackNav.Navigator screenOptions={{ headerShown: false }}>
      <CartStackNav.Screen name="Cart" component={CartScreen} />
      <CartStackNav.Screen name="CheckoutSuccess" component={CheckoutSuccessScreen} />
    </CartStackNav.Navigator>
  );
}

// Stack tab Profil: profil -> tentang, + detail produk (dari wishlist di tab lain juga bisa).
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="Profile" component={ProfileScreen} />
      <ProfileStackNav.Screen name="About" component={AboutScreen} />
    </ProfileStackNav.Navigator>
  );
}

// Wishlist perlu akses ke ProductDetail juga -> bungkus dalam stack.
function WishlistStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="Wishlist" component={WishlistScreen} />
      <HomeStackNav.Screen name="ProductDetail" component={ProductDetailScreen} />
      <HomeStackNav.Screen name="Category" component={CategoryScreen} />
    </HomeStackNav.Navigator>
  );
}

// Badge angka di tab Cart (update realtime dari CartContext).
function CartBadge({ count }) {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

// Sembunyikan tab bar di layar dalam (detail, search, dst.) agar fokus.
function hideOnNested(route, defaultRoute) {
  const name = getFocusedRouteName(route) ?? defaultRoute;
  const hidden = ['ProductDetail', 'Search', 'Category', 'CheckoutSuccess', 'About'];
  return hidden.includes(name) ? { display: 'none' } : undefined;
}

// Ambil nama route aktif di dalam nested navigator.
function getFocusedRouteName(route) {
  const state = route.state;
  if (!state || !state.routes) return route.params?.screen;
  return state.routes[state.index]?.name;
}

export default function MainTabs() {
  const { count } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: [styles.tabBar, hideOnNested(route, route.name)],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused, size }) => {
          const icons = {
            HomeTab: focused ? 'home' : 'home-outline',
            WishlistTab: focused ? 'heart' : 'heart-outline',
            CartTab: focused ? 'bag' : 'bag-outline',
            ProfileTab: focused ? 'person' : 'person-outline',
          };
          return (
            <View>
              <Ionicons name={icons[route.name]} size={24} color={color} />
              {route.name === 'CartTab' && <CartBadge count={count} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Beranda' }} />
      <Tab.Screen name="WishlistTab" component={WishlistStack} options={{ title: 'Wishlist' }} />
      <Tab.Screen name="CartTab" component={CartStack} options={{ title: 'Keranjang' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : spacing.md,
    ...shadow.card,
  },
  tabLabel: { fontSize: 11, fontFamily: 'Jakarta_600SemiBold', marginTop: 2 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.white, fontSize: 10, fontFamily: 'Jakarta_700Bold' },
});
