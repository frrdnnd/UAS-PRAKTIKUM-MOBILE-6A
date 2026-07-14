import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

// Stepper jumlah (+/-) dengan batas min & max (stok).
export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const dec = () => value > min && onChange(value - 1);
  const inc = () => value < max && onChange(value + 1);
  const btn = size === 'sm' ? 30 : 38;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={dec}
        disabled={value <= min}
        style={[styles.btn, { width: btn, height: btn }, value <= min && styles.disabled]}
      >
        <Ionicons name="remove" size={18} color={colors.primary} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        onPress={inc}
        disabled={value >= max}
        style={[styles.btn, { width: btn, height: btn }, value >= max && styles.disabled]}
      >
        <Ionicons name="add" size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    padding: 4,
  },
  btn: {
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: { opacity: 0.4 },
  value: {
    minWidth: 22,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Jakarta_700Bold',
    color: colors.textPrimary,
  },
});
