import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import { colors, spacing, radius, typography } from '../theme';
import { t } from '../i18n';

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  onTouch,
  error,
  placeholder = 'Seleccionar',
}) {
  const [expanded, setExpanded] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          onTouch?.();
          setExpanded((previous) => !previous);
        }}
        style={[styles.select, error && styles.invalid]}
      >
        <Text style={styles.inputText}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.arrow}>{expanded ? '▴' : '▾'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.options}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={styles.option}
              onPress={() => {
                onChange(option.value);
                onTouch?.();
                setExpanded(false);
              }}
            >
              <Text style={styles.inputText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {!!error && (
        <Text style={styles.error}>
          {t.errors[error] ?? error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  select: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  invalid: {
    borderColor: colors.error,
  },
  inputText: {
    ...typography.body,
    color: colors.text,
  },
  arrow: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  options: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  option: {
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  error: {
    ...typography.error,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
