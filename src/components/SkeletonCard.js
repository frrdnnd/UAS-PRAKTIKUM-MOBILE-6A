import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius, spacing, shadow } from '../theme/theme';

// Skeleton shimmer saat memuat produk (bukan spinner polos).
export default function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.image, { opacity }]} />
      <View style={styles.body}>
        <Animated.View style={[styles.line, { width: '85%', opacity }]} />
        <Animated.View style={[styles.line, { width: '55%', opacity }]} />
        <Animated.View style={[styles.line, { width: '40%', height: 16, opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.soft,
  },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.surfaceAlt },
  body: { padding: spacing.md, gap: spacing.sm },
  line: { height: 10, borderRadius: 6, backgroundColor: colors.surfaceAlt },
});
