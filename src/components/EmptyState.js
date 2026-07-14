import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import AppButton from './AppButton';

// Empty state: ikon + judul + subjudul + tombol aksi (bukan teks telanjang).
export default function EmptyState({
  icon = 'file-tray-outline',
  title = 'Belum ada data',
  subtitle = '',
  actionLabel = null,
  onAction = null,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          variant="ghost"
          fullWidth={false}
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 18, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary, textAlign: 'center' },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Jakarta_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  action: { marginTop: spacing.sm },
});
