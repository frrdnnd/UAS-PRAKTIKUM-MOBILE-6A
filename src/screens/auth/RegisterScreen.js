import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { colors, radius, spacing } from '../../theme/theme';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirm,
} from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  // Validasi seluruh field register.
  const validate = () => {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
    };
    setErrors(next);
    return !next.name && !next.email && !next.password && !next.confirm;
  };

  const onRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Akun dibuat! Selamat datang 🎉');
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.error(e.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Daftar Akun</Text>
        <View style={styles.back} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Buat akun baru</Text>
          <Text style={styles.subtitle}>Gabung dan mulai jual-beli di kampus 🎓</Text>

          <AppInput
            label="Nama Lengkap"
            icon="person-outline"
            value={form.name}
            onChangeText={setField('name')}
            placeholder="Nama kamu"
            autoCapitalize="words"
            error={errors.name}
          />
          <AppInput
            label="Email"
            icon="mail-outline"
            value={form.email}
            onChangeText={setField('email')}
            placeholder="nama@email.com"
            keyboardType="email-address"
            error={errors.email}
          />
          <AppInput
            label="Password"
            icon="lock-closed-outline"
            value={form.password}
            onChangeText={setField('password')}
            placeholder="Minimal 8 karakter"
            secureTextEntry
            error={errors.password}
          />
          <AppInput
            label="Konfirmasi Password"
            icon="lock-closed-outline"
            value={form.confirm}
            onChangeText={setField('confirm')}
            placeholder="Ulangi password"
            secureTextEntry
            error={errors.confirm}
          />

          <AppButton title="Daftar" onPress={onRegister} loading={loading} style={{ marginTop: spacing.sm }} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
              <Text style={styles.link}>Masuk</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  scroll: { padding: spacing.lg },
  title: { fontSize: 24, fontFamily: 'Jakarta_800ExtraBold', color: colors.textPrimary },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Jakarta_500Medium',
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.lg },
  footerText: { fontSize: 14, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary },
  link: { fontSize: 14, fontFamily: 'Jakarta_700Bold', color: colors.primary },
});
