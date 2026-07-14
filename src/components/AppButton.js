import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme/theme';

// Tombol serbaguna: varian primary (gradient) / outline / ghost.
// Mendukung state loading & disabled, ikon opsional, dan micro-interaction press scale 0.97.
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon = null,
  style,
  fullWidth = true,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 7 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }).start();

  const textColor =
    variant === 'primary' ? colors.white : variant === 'outline' ? colors.primary : colors.primary;

  const Inner = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={textColor} />}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[{ transform: [{ scale }] }, fullWidth && styles.full, style]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={isDisabled}
        style={[isDisabled && styles.disabled]}
      >
        {variant === 'primary' ? (
          <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.base, styles.primary]}
          >
            {Inner}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.base,
              variant === 'outline' ? styles.outline : styles.ghost,
            ]}
          >
            {Inner}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  full: { alignSelf: 'stretch' },
  base: {
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: { ...shadow.soft },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: { backgroundColor: colors.primaryLight },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  text: { fontSize: 15, fontFamily: 'Jakarta_700Bold' },
  disabled: { opacity: 0.5 },
});
