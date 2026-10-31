import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function Button({ title, onPress, variant = 'primary', disabled = false }) {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          isSecondary && styles.textSecondary,
          disabled && styles.textDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: { backgroundColor: colors.disabled, borderColor: colors.disabled },
  pressed: { opacity: 0.85 },
  text: { ...typography.body, fontWeight: '700', color: colors.onPrimary },
  textSecondary: { color: colors.primary },
  textDisabled: {
    color: colors.textSecondary,
  },
});