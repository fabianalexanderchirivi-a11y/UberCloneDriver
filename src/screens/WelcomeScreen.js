
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />

      <View style={styles.content}>
        <View>
          <Text style={styles.logo}>UBER</Text>
          <Text style={styles.logoSubtitle}>DRIVER</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>
            Conduce cuando quieras.
            {'\n'}
            Gana a tu manera.
          </Text>

          <Text style={styles.description}>
            Únete a nuestra comunidad de conductores y comienza
            a generar ingresos con tu vehículo.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>
              Registrarme como conductor
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>
              Iniciar sesión
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Tu camino comienza aquí.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 35,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  logo: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoSubtitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 5,
    marginTop: 2,
  },
  hero: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 39,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: -1,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 22,
  },
  actions: {
    gap: 14,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  footer: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 28,
  },
});
