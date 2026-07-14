import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import AppButton from './AppButton';

// Error state: ilustrasi + judul + subjudul + tombol "Coba lagi".
export default function ErrorState({
  title = 'Gagal memuat',
  subtitle = 'Terjadi kesalahan. Periksa koneksi internetmu.',
  onRetry = null,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="cloud-offline-outline" size={40} color={colors.danger} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {onRetry && (
        <AppButton
          title="Coba lagi"
          icon="refresh"
          onPress={onRetry}
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
    backgroundColor: '#FDECEC',
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
