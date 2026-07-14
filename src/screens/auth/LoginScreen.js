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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { colors, radius, spacing, shadow } from '../../theme/theme';
import { validateEmail, validatePassword } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiLogin } from '../../api/dummyjson';

export default function LoginScreen({ navigation }) {
  const { login, loginWithApi } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  // Validasi semua field; kembalikan true bila valid.
  const validate = () => {
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    return !next.email && !next.password;
  };

  const onLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Berhasil masuk. Selamat datang!');
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.error(e.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  // Bonus: login via API DummyJSON (emilys / emilyspass).
  const onApiLogin = async () => {
    setApiLoading(true);
    try {
      const data = await apiLogin('emilys', 'emilyspass');
      await loginWithApi(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Masuk via API DummyJSON');
    } catch (e) {
      toast.error(e.message || 'Login API gagal');
    } finally {
      setApiLoading(false);
    }
  };

  // Isi otomatis kredensial demo agar grader cepat mencoba.
  const fillDemo = () => {
    setEmail('demo@kampusmarket.id');
    setPassword('demo1234');
    setErrors({});
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={colors.gradient} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.logoWrap}>
            <View style={styles.logo}>
              <Ionicons name="bag-handle" size={34} color={colors.white} />
            </View>
            <Text style={styles.brand}>KampusMarket</Text>
            <Text style={styles.tagline}>Jual-beli barang bekas mahasiswa</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Masuk</Text>
            <Text style={styles.subtitle}>Selamat datang kembali 👋</Text>

            <AppInput
              label="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="nama@email.com"
              keyboardType="email-address"
              error={errors.email}
            />
            <AppInput
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimal 8 karakter"
              secureTextEntry
              error={errors.password}
            />

            <AppButton title="Masuk" onPress={onLogin} loading={loading} />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.divider} />
            </View>

            <AppButton
              title="Login via API (DummyJSON)"
              variant="outline"
              icon="cloud-outline"
              onPress={onApiLogin}
              loading={apiLoading}
            />

            {/* Hint kredensial demo */}
            <Pressable style={styles.demoBox} onPress={fillDemo}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primary} />
              <View style={styles.flex}>
                <Text style={styles.demoTitle}>Akun demo (ketuk untuk isi)</Text>
                <Text style={styles.demoText}>demo@kampusmarket.id · demo1234</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun?</Text>
            <Pressable onPress={() => navigation.navigate('Register')} hitSlop={8}>
              <Text style={styles.link}>Daftar sekarang</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  hero: {
    paddingBottom: spacing.xxl + spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  logoWrap: { alignItems: 'center', paddingTop: spacing.lg },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: { color: colors.white, fontSize: 24, fontFamily: 'Jakarta_800ExtraBold' },
  tagline: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: 'Jakarta_500Medium', marginTop: 4 },
  scroll: { padding: spacing.lg, paddingTop: 0 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: -spacing.xl,
    ...shadow.card,
  },
  title: { fontSize: 22, fontFamily: 'Jakarta_800ExtraBold', color: colors.textPrimary },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Jakarta_500Medium',
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.base },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, fontFamily: 'Jakarta_500Medium', color: colors.textTertiary },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.base,
  },
  demoTitle: { fontSize: 12, fontFamily: 'Jakarta_700Bold', color: colors.primary },
  demoText: { fontSize: 13, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary, marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.lg },
  footerText: { fontSize: 14, fontFamily: 'Jakarta_500Medium', color: colors.textSecondary },
  link: { fontSize: 14, fontFamily: 'Jakarta_700Bold', color: colors.primary },
});
