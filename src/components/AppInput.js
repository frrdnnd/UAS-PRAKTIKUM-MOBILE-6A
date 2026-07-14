import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

// Input reusable: label + ikon kiri + toggle password + pesan error inline.
export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon = null,
  error = null,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onBlur,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.field,
          focused && styles.focused,
          !!error && styles.errored,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? colors.danger : focused ? colors.primary : colors.textTertiary}
          />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          {...rest}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textTertiary}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.base },
  label: {
    fontSize: 12,
    fontFamily: 'Jakarta_600SemiBold',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    height: 54,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  focused: { borderColor: colors.primary, backgroundColor: colors.surface },
  errored: { borderColor: colors.danger, backgroundColor: colors.surface },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Jakarta_500Medium',
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Jakarta_500Medium',
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
