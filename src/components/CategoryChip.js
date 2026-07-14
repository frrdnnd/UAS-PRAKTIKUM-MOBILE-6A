import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import { titleCase } from '../utils/format';

// Chip kategori horizontal. Aktif -> latar primaryLight + teks primary.
export default function CategoryChip({ label, active = false, onPress, icon = null }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.active : styles.inactive]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={15}
          color={active ? colors.primary : colors.textSecondary}
        />
      )}
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>
        {titleCase(label)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  active: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  inactive: { backgroundColor: colors.surface, borderColor: colors.border },
  text: { fontSize: 13, fontFamily: 'Jakarta_600SemiBold' },
  activeText: { color: colors.primary },
  inactiveText: { color: colors.textSecondary },
});
