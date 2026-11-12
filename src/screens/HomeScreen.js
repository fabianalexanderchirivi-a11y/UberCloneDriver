
// AI-assisted: see docs/AI_LOG.md #10

import { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, onSnapshot } from 'firebase/firestore';

import useAuth from '../hooks/useAuth';
import useDriverLocation from '../hooks/useDriverLocation';
import DriverMap from '../components/DriverMap';
import { auth, db } from '../config/firebase';
import { colors, spacing, radius, typography } from '../theme';
import { LanguageContext } from '../context/LanguageContext';

const TEST_PICKUP = {
  lat: 6.33492,
  lng: -75.55829,
  address: 'Parque Principal de Bello, Antioquia',
};

export default function HomeScreen({ navigation }) {
  const { signOut } = useAuth();
  const { t, language } = useContext(LanguageContext);

  const [isAvailable, setIsAvailable] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTestPickup, setShowTestPickup] = useState(false);

  const en = language === 'en';
  const isApproved = accountStatus === 'approved';
  const isPending = accountStatus === 'pending';

  const {
    location,
    error: locationError,
    isLocating,
    stopSharing,
  } = useDriverLocation(isAvailable && isApproved);

  useEffect(() => {
    let active = true;
    const user = auth.currentUser;

    if (!user) {
      setAccountStatus(null);
      setIsAvailable(false);
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
        setIsLoading(false);

        if (status !== 'approved') {
          setIsAvailable(false);
          setShowTestPickup(false);
        }
      },
      (error) => {
        if (!active) return;

        console.error(
          'Error al consultar conductor:',
          error.code || error.message
        );

        setAccountStatus(null);
        setIsAvailable(false);
        setShowTestPickup(false);
        setIsLoading(false);

        Alert.alert(
          en ? 'Error' : 'Error',
          en
            ? 'Could not verify your account.'
            : 'No se pudo verificar tu cuenta.'
        );
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [en]);

  useEffect(() => {
    if (!locationError || !isAvailable) return;

    setIsAvailable(false);
    setShowTestPickup(false);

    const messages = {
      permissionDenied: en
        ? 'Allow location access to become available.'
        : 'Permite el acceso a la ubicación.',
      locationDisabled: en
        ? 'Enable GPS on your phone.'
        : 'Activa el GPS del celular.',
      locationError: en
        ? 'Could not get your location.'
        : 'No se pudo obtener tu ubicación.',
      syncError: en
        ? 'Could not synchronize with Firebase.'
        : 'No se pudo sincronizar con Firebase.',
    };

    Alert.alert(
      en ? 'Location' : 'Ubicación',
      messages[locationError] ||
      messages.locationError
    );
  }, [locationError, isAvailable, en]);

  const handleAvailabilityChange = (value) => {
    if (!isApproved) return;

    setIsAvailable(value);

    if (!value) {
      setShowTestPickup(false);
    }
  };

  const handleOpenDirections = async () => {
    if (!location || !isAvailable || !isApproved) {
      return;
    }

    const destination = encodeURIComponent(
      `${TEST_PICKUP.lat},${TEST_PICKUP.lng}`
    );

    const url =
      'https://www.google.com/maps/dir/?api=1' +
      `&destination=${destination}` +
      '&travelmode=driving' +
      '&dir_action=navigate';

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(
        'Error al abrir Google Maps:',
        error.message
      );

      Alert.alert(
        en ? 'Navigation error' : 'Error de navegación',
        en
          ? 'Could not open Google Maps.'
          : 'No se pudo abrir Google Maps.'
      );
    }
  };

  const handleSignOut = async () => {
    setIsAvailable(false);
    setShowTestPickup(false);

    try {
      await stopSharing();
      await signOut();
    } catch (error) {
      console.error(
        'Error al cerrar sesión:',
        error.code || error.message
      );

      Alert.alert(
        en ? 'Error' : 'Error',
        en
          ? 'Could not finish signing out.'
          : 'No se pudo completar el cierre de sesión.'
      );
    }
  };

  const statusText = isApproved
    ? t('home.approved')
    : isPending
      ? t('home.pending')
      : accountStatus === 'rejected'
        ? t('login.rejectedTitle')
        : t('login.invalidStatusTitle');

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
    <View style={styles.screen}>
      <DriverMap
        location={isAvailable && isApproved ? location : null}
        pickup={
          showTestPickup && isAvailable && isApproved
            ? TEST_PICKUP
            : null
        }
        language={language}

      />

      <SafeAreaView
        style={styles.overlay}
        pointerEvents="box-none"
      >
        <View style={styles.header}>
          <View style={styles.topCard}>
            <Text style={styles.title}>
              UberCloneDriver
            </Text>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isApproved
                      ? colors.success
                      : isPending
                        ? colors.warning
                        : colors.error,
                  },
                ]}
              />

              <Text style={styles.statusText}>
                {statusText}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <View style={styles.panel}>
            <View style={styles.availabilityRow}>
              <View style={styles.availabilityInfo}>
                <Text style={styles.sectionTitle}>
                  {t('home.availability')}
                </Text>

                <Text style={styles.description}>
                  {isAvailable && isApproved
                    ? t('home.available')
                    : t('home.unavailable')}
                </Text>
              </View>

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
              />
            </View>

            {!isApproved && (
              <Text style={styles.hint}>
                {isPending
                  ? t('home.pendingMessage')
                  : t('login.invalidStatusMessage')}
              </Text>
            )}

            {isApproved && isAvailable && isLocating && (
              <View style={styles.loadingRow}>
                <ActivityIndicator
                  color={colors.primary}
                  size="small"
                />
                <Text style={styles.hint}>
                  {en
                    ? 'Getting GPS location...'
                    : 'Obteniendo ubicación GPS...'}
                </Text>
              </View>
            )}

            {isApproved && isAvailable && location && (
              <>
                <Text style={styles.gpsText}>
                  {en
                    ? 'GPS active'
                    : 'GPS activo'}
                </Text>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={() =>
                    setShowTestPickup((previous) => !previous)
                  }
                  accessibilityRole="button"
                >
                  <Text style={styles.secondaryButtonText}>
                    {showTestPickup
                      ? en
                        ? 'Hide test pickup'
                        : 'Ocultar recogida de prueba'
                      : en
                        ? 'Show test pickup'
                        : 'Mostrar recogida de prueba'}
                  </Text>
                </Pressable>

                {showTestPickup && (
                  <View style={styles.testSection}>
                    <Text style={styles.testLabel}>
                      {en
                        ? 'Test pickup location'
                        : 'Punto de recogida de prueba'}
                    </Text>

                    <Text style={styles.testAddress}>
                      {TEST_PICKUP.address}
                    </Text>

                    <Pressable
                      style={styles.primaryButton}
                      onPress={handleOpenDirections}
                      accessibilityRole="button"
                    >
                      <Text style={styles.primaryButtonText}>
                        {en
                          ? 'Get directions'
                          : 'Cómo llegar'}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}

            <Pressable
              style={styles.profileButton}
              onPress={() => navigation.navigate('DriverProfile')}
              accessibilityRole="button"
            >
              <Text style={styles.profileButtonText}>
                {t('profile.open')}
              </Text>
            </Pressable>


            <Pressable
              style={styles.logoutButton}
              onPress={handleSignOut}
              accessibilityRole="button"
            >
              <Text style={styles.logoutText}>
                {t('home.logOut')}
              </Text>
            </Pressable>

          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  topCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    elevation: 4,
  },
  title: {
    ...typography.title,
    fontSize: 21,
    color: colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    height: 9,
    width: 9,
    borderRadius: 5,
  },
  statusText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
  },
  bottomArea: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    elevation: 6,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  availabilityInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  hint: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  gpsText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  testSection: {
    gap: spacing.sm,
  },
  testLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  testAddress: {
    ...typography.body,
    color: colors.text,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  logoutText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  mapLayer: {
    flex: 1,
    minHeight: 1,
  },

  profileButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  profileButtonText: {
    color: colors.text,
    fontWeight: '700',
  },

});
