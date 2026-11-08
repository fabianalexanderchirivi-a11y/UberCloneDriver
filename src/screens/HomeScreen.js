
import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, onSnapshot } from 'firebase/firestore';

import useAuth from '../hooks/useAuth';
import { auth, db } from '../config/firebase';
import { colors, spacing, radius, typography } from '../theme';
import { LanguageContext } from '../context/LanguageContext';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { t } = useContext(LanguageContext);

  const [isAvailable, setIsAvailable] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const user = auth.currentUser;

    if (!user) {
      setIsAvailable(false);
      setAccountStatus(null);
      setIsLoading(false);
      return;
    }

    const registrationRef = doc(
      db,
      'driverRegistrations',
      user.uid
    );

    const unsubscribe = onSnapshot(
      registrationRef,
      (snapshot) => {
        if (!active) return;

        const status = snapshot.exists()
          ? snapshot.data().status
          : null;

        setAccountStatus(status);

        if (status !== 'approved') {
          setIsAvailable(false);
        }

        setIsLoading(false);
      },
      (error) => {
        if (!active) return;

        console.error(
          'Error al escuchar el estado del conductor:',
          error.code || error.message
        );

        setAccountStatus(null);
        setIsAvailable(false);
        setIsLoading(false);

        Alert.alert(
          t('login.errorTitle'),
          t('login.permissionError')
        );
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [t]);

  const isPending = accountStatus === 'pending';
  const isApproved = accountStatus === 'approved';
  const isRejected = accountStatus === 'rejected';

  const statusText = isPending
    ? t('home.pending')
    : isApproved
      ? t('home.approved')
      : isRejected
        ? t('login.rejectedTitle')
        : t('login.invalidStatusTitle');

  const handleAvailabilityChange = (value) => {
    if (!isApproved) {
      setIsAvailable(false);
      return;
    }

    setIsAvailable(value);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('home.welcome')}
        </Text>

        <Text style={styles.description}>
          {t('home.description')}
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            {t('home.accountStatus')}
          </Text>

          <Text
            style={[
              styles.status,
              isPending
                ? styles.pending
                : isApproved
                  ? styles.approved
                  : styles.rejected,
            ]}
          >
            {statusText}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            {t('home.availability')}
          </Text>

          <View style={styles.switchRow}>
            <Text style={styles.availabilityText}>
              {isAvailable
                ? t('home.available')
                : t('home.unavailable')}
            </Text>

            <Switch
              value={isAvailable && isApproved}
              onValueChange={handleAvailabilityChange}
              disabled={!isApproved}
              trackColor={{
                false: colors.disabled,
                true: colors.primary,
              }}
              thumbColor={
                isAvailable && isApproved
                  ? colors.onPrimary
                  : colors.textSecondary
              }
              accessibilityRole="switch"
              accessibilityLabel={t('home.availability')}
              accessibilityState={{
                disabled: !isApproved,
              }}
            />
          </View>

          {!isApproved && (
            <Text style={styles.warning}>
              {isPending
                ? t('home.pendingMessage')
                : t('login.invalidStatusMessage')}
            </Text>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutPressed,
          ]}
          onPress={signOut}
          accessibilityRole="button"
        >
          <Text style={styles.logoutText}>
            {t('home.logOut')}
          </Text>
        </Pressable>
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
    padding: spacing.xl,
    gap: spacing.lg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  status: {
    ...typography.body,
    fontWeight: '700',
  },
  pending: {
    color: colors.warning,
  },
  approved: {
    color: colors.success,
  },
  rejected: {
    color: colors.error,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityText: {
    ...typography.body,
    color: colors.text,
  },
  warning: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    minHeight: 56,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutPressed: {
    opacity: 0.7,
  },
  logoutText: {
    color: colors.onPrimary,
    ...typography.label,
  },
});
