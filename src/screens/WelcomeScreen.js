import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />

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
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>
              Registrarme como conductor
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
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
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 35,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoSubtitle: {
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 39,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: -1,
  },
  description: {
    color: '#BDBDBD',
    fontSize: 16,
    lineHeight: 25,
    marginTop: 22,
  },
  actions: {
    gap: 14,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#333333',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    color: '#777777',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 28,
  },
});

