import { useState, useContext } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Pressable, StyleSheet, Alert, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import TextField from '../components/TextField';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import { LanguageContext } from '../context/LanguageContext';
import { validateEmail, validatePassword } from '../utils/validations';
import { colors, spacing, typography } from '../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const languageContext = useContext(LanguageContext);

  if (!languageContext) {
    throw new Error('LoginScreen debe estar dentro de LanguageProvider');
  }

  const { t, setLanguage } = languageContext;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const translateError = (error) => {
    if (!error) return '';

    const translated = t('errors.' + error);

    return translated === 'errors.' + error
      ? error
      : translated;
  };

  const handleEmailChange = (text) => {
    setEmail(text);

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: '',
      }));
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);

    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: '',
      }));
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    const normalizedEmail = email.trim().toLowerCase();

    const newErrors = {
      email: translateError(validateEmail(normalizedEmail)),
      password: translateError(validatePassword(password)),
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

      const registrationRef = doc(
        db,
        'driverRegistrations',
        user.uid
      );

      const registrationSnapshot = await getDoc(registrationRef);

      if (!registrationSnapshot.exists()) {
        await signOut(auth);

        Alert.alert(
          t('login.registrationNotFoundTitle'),
          t('login.registrationNotFoundMessage')
        );

        return;
      }

      const registration = registrationSnapshot.data();

      if (registration.status === 'pending') {
        await signOut(auth);

        Alert.alert(
          t('login.pendingTitle'),
          t('login.pendingMessage')
        );

        return;
      }

      if (registration.status === 'rejected') {
        await signOut(auth);

        Alert.alert(
          t('login.rejectedTitle'),
          t('login.rejectedMessage')
        );

        return;
      }

      if (registration.status !== 'approved') {
        await signOut(auth);

        Alert.alert(
          t('login.invalidStatusTitle'),
          t('login.invalidStatusMessage')
        );

        return;
      }

      const accountLanguage =
        registration.personalData?.language ??
        registration.language;

      if (accountLanguage === 'es' || accountLanguage === 'en') {
        await setLanguage(accountLanguage);
      }

      signIn();
    } catch (error) {
      console.error(
        'Error al iniciar sesión:',
        error.code || error.message
      );

      let message = t('login.genericError');

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        message = t('login.invalidCredentials');
      } else if (error.code === 'auth/invalid-email') {
        message = t('login.invalidEmail');
      } else if (error.code === 'auth/user-disabled') {
        message = t('login.userDisabled');
      } else if (error.code === 'auth/too-many-requests') {
        message = t('login.tooManyRequests');
      } else if (error.code === 'auth/network-request-failed') {
        message = t('login.networkError');
      } else if (
        error.code === 'permission-denied' ||
        error.code === 'firestore/permission-denied'
      ) {
        message = t('login.permissionError');
      }

      Alert.alert(t('login.errorTitle'), message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.title}>
            {t('login.title')}
          </Text>

          <TextField
            label={t('login.email')}
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChangeText={handleEmailChange}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                email: translateError(
                  validateEmail(email.trim().toLowerCase())
                ),
              }))
            }
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextField
            label={t('login.password')}
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                password: translateError(
                  validatePassword(password)
                ),
              }))
            }
            error={errors.password}
            isPassword
            autoCapitalize="none"
            autoComplete="password"
          />

          <Button
            title={
              isLoading
                ? t('login.submitting')
                : t('login.submit')
            }
            onPress={handleSubmit}
            disabled={isLoading}
          />

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>
              {t('login.noAccount')}{' '}
            </Text>

            <Pressable
              onPress={() => navigation.navigate('Register')}
              hitSlop={8}
            >
              <Text style={styles.link}>
                {t('login.signUpLink')}
              </Text>
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
