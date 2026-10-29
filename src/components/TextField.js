import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { t } from '../i18n';

export default function TextField({ label, error, isPassword = false, style, ...rest }) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.row, error ? styles.rowError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && isHidden}
          autoCorrect={false}
          {...rest}
        />
        {isPassword && (
          <Pressable
            onPress={() => setIsHidden((hidden) => !hidden)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? t.common.showPassword : t.common.hidePassword}
          >
            <Ionicons
              name={isHidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {/* AI-assisted: see docs/AI_LOG.md #13 */}
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
           {t.errors[error] ?? error}  
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  rowError: { borderColor: colors.error },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  error: { ...typography.error, color: colors.error, marginTop: spacing.xs },
});