import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';

export default function RegistrationSuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>

      <Text style={styles.title}>¡Registro enviado!</Text>

      <Text style={styles.description}>
        Tus datos fueron guardados correctamente. Tu cuenta está pendiente
        de revisión y aprobación.
      </Text>

      <Text style={styles.status}>Pendiente de aprobación</Text>

      <Button
        title="Volver al inicio"
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  icon: {
    fontSize: 64,
    color: '#16A34A',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  status: {
    fontWeight: '700',
    color: '#D97706',
    marginBottom: spacing.xl,
  },
});
