
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import TextField from '../components/TextField';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validations';
import { colors, spacing, typography } from '../theme';
import { t } from '../i18n';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    const normalizedEmail = email.trim().toLowerCase();

    const newErrors = {
      email: validateEmail(normalizedEmail),
      password: validatePassword(password),
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      const user = credential.user;
      const registrationRef = doc(db, 'driverRegistrations', user.uid);
      const registrationSnapshot = await getDoc(registrationRef);

      if (!registrationSnapshot.exists()) {
        await signOut(auth);
        Alert.alert(
          'Registro no encontrado',
          'No encontramos un registro de conductor asociado a esta cuenta. Contacta con soporte.'
        );
        return;
      }

      const registration = registrationSnapshot.data();

      if (registration.status === 'pending') {
        await signOut(auth);
        Alert.alert(
          'Registro pendiente',
          'Tu solicitud todavía está en revisión. Podrás ingresar cuando sea aprobada.'
        );
        return;
      }

      if (registration.status === 'rejected') {
        await signOut(auth);
        Alert.alert(
          'Registro no aprobado',
          'Tu solicitud no fue aprobada. Contacta con soporte para obtener más información.'
        );
        return;
      }

      if (registration.status !== 'approved') {
        await signOut(auth);
        Alert.alert(
          'Estado no válido',
          'No podemos verificar el estado de tu cuenta. Contacta con soporte.'
        );
        return;
      }

      signIn();
    } catch (error) {
      console.error('Error al iniciar sesión:', error.code || error.message);

      let message = 'No fue posible iniciar sesión. Inténtalo nuevamente.';

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        message = 'El correo o la contraseña son incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'El correo electrónico no es válido.';
      } else if (error.code === 'auth/user-disabled') {
        message = 'Esta cuenta está deshabilitada.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Demasiados intentos. Espera un momento e inténtalo nuevamente.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'No hay conexión. Revisa tu internet e inténtalo nuevamente.';
      } else if (
        error.code === 'permission-denied' ||
        error.code === 'firestore/permission-denied'
      ) {
        message = 'No se pudo consultar tu registro. Revisa los permisos de Firebase.';
      }

      Alert.alert('Error al iniciar sesión', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t.login.title}</Text>

          <TextField
            label={t.login.email}
            placeholder={t.login.emailPlaceholder}
            value={email}
            onChangeText={handleEmailChange}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                email: validateEmail(email.trim().toLowerCase()),
              }))
            }
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextField
            label={t.login.password}
            placeholder={t.login.passwordPlaceholder}
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                password: validatePassword(password),
              }))
            }
            error={errors.password}
            isPassword
            autoCapitalize="none"
            autoComplete="password"
          />

          <Button
            title={isLoading ? t.login.submitting : t.login.submit}
            onPress={handleSubmit}
            disabled={isLoading}
          />

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>{t.login.noAccount} </Text>
            <Pressable
              onPress={() => navigation.navigate('Register')}
              hitSlop={8}
            >
              <Text style={styles.link}>{t.login.signUpLink}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  linkText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  link: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
});
