import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

// Menampilkan bintang rating (penuh/setengah/kosong) + angka opsional.
export default function RatingStars({ rating = 0, size = 14, showValue = true, reviews = null }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let name = 'star-outline';
    if (rating >= i) name = 'star';
    else if (rating >= i - 0.5) name = 'star-half';
    stars.push(<Ionicons key={i} name={name} size={size} color={colors.rating} />);
  }
  return (
    <View style={styles.row}>
      <View style={styles.stars}>{stars}</View>
      {showValue && <Text style={[styles.value, { fontSize: size - 1 }]}>{Number(rating).toFixed(1)}</Text>}
      {reviews != null && <Text style={styles.reviews}>({reviews} ulasan)</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stars: { flexDirection: 'row', gap: 1 },
  value: { fontFamily: 'Jakarta_700Bold', color: colors.textPrimary },
  reviews: { fontSize: 12, fontFamily: 'Jakarta_500Medium', color: colors.textTertiary },
});
