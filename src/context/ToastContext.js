import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadow } from '../theme/theme';

const ToastContext = createContext(null);

const ICONS = {
  success: { name: 'checkmark-circle', color: colors.success },
  error: { name: 'alert-circle', color: colors.danger },
  info: { name: 'information-circle', color: colors.primary },
};

// Toast global dengan animasi slide + auto-dismiss.
export function ToastProvider({ children }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState(null); // { message, type }
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -120, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [translateY, opacity]);

  const show = useCallback(
    (message, type = 'info', duration = 2200) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setToast({ message, type });
      translateY.setValue(-120);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
      hideTimer.current = setTimeout(hide, duration);
    },
    [translateY, opacity, hide]
  );

  const value = {
    show,
    success: (m, d) => show(m, 'success', d),
    error: (m, d) => show(m, 'error', d),
    info: (m, d) => show(m, 'info', d),
  };

  const icon = toast ? ICONS[toast.type] || ICONS.info : ICONS.info;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wrap,
            { top: insets.top + spacing.sm, transform: [{ translateY }], opacity },
          ]}
        >
          <View style={styles.toast}>
            <Ionicons name={icon.name} size={22} color={icon.color} />
            <Text style={styles.text} numberOfLines={2}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast harus dipakai di dalam ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.strong,
  },
  text: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Jakarta_600SemiBold',
  },
});
