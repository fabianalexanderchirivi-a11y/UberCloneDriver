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

  const toggleExpanded = () => {
    onTouch?.();
    setExpanded((previous) => !previous);
  };

  const selectOption = (optionValue) => {
    onChange(optionValue);
    onTouch?.();
    setExpanded(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={toggleExpanded}
        style={[styles.select, error && styles.invalid]}
      >
        <Text style={styles.inputText}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.arrow}>
          {expanded ? '▴' : '▾'}
        </Text>
      </Pressable>

      {expanded && (
        <View style={styles.options}>
          {options.map((option, index) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              onPress={() => selectOption(option.value)}
              style={[
                styles.option,
                index === options.length - 1 && styles.lastOption,
                option.value === value && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  option.value === value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>

              {option.value === value && (
                <Text style={styles.check}>✓</Text>
              )}
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
    width: '100%',
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  select: {
    minHeight: 52,
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
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  options: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  option: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#303034',
  },
  optionText: {
    ...typography.body,
    color: colors.text,
  },
  selectedOptionText: {
    fontWeight: '700',
  },
  check: {
    color: colors.success,
    fontSize: 18,
    fontWeight: '700',
  },
  error: {
    ...typography.error,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
