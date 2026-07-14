import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme/theme';
import AppButton from './AppButton';

// Opsi sort yang tersedia (dipakai di Home & Kategori).
export const SORT_OPTIONS = [
  { key: 'default', label: 'Paling Sesuai', icon: 'sparkles-outline' },
  { key: 'price-asc', label: 'Harga Termurah', icon: 'arrow-up-outline' },
  { key: 'price-desc', label: 'Harga Termahal', icon: 'arrow-down-outline' },
  { key: 'rating-desc', label: 'Rating Tertinggi', icon: 'star-outline' },
];

// Terapkan sort pada array produk (client-side).
export function applySort(products, sortKey) {
  const arr = [...products];
  switch (sortKey) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return arr.sort((a, b) => b.rating - a.rating);
    default:
      return arr;
  }
}

// Bottom-sheet modal untuk memilih urutan produk.
export default function SortSheet({ visible, current, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Urutkan Produk</Text>
        {SORT_OPTIONS.map((opt) => {
          const active = current === opt.key;
          return (
            <Pressable
              key={opt.key}
              style={[styles.row, active && styles.rowActive]}
              onPress={() => onSelect(opt.key)}
            >
              <Ionicons
                name={opt.icon}
                size={20}
                color={active ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.rowText, active && styles.rowTextActive]}>{opt.label}</Text>
              {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            </Pressable>
          );
        })}
        <AppButton title="Tutup" variant="ghost" onPress={onClose} style={{ marginTop: spacing.sm }} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(20,20,43,0.35)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    ...shadow.strong,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: spacing.base,
  },
  title: { fontSize: 18, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary, marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  rowActive: { backgroundColor: colors.primaryLight },
  rowText: { flex: 1, fontSize: 15, fontFamily: 'Jakarta_600SemiBold', color: colors.textSecondary },
  rowTextActive: { color: colors.primary },
});
