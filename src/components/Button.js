import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) {
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
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    ...typography.body,
    fontWeight: '700',
    color: colors.onPrimary,
    textAlign: 'center',
  },
  textSecondary: {
    color: colors.text,
  },
  textDisabled: {
    color: colors.textSecondary,
  },
});
