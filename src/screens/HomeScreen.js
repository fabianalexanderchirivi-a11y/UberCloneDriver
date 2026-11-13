
// AI-assisted: see docs/AI_LOG.md #10, #143

import { useContext, useEffect, useRef, useState } from 'react';
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
import useTripRequests from '../hooks/useTripRequests';

import TripRequestsPanel from '../components/TripRequestsPanel';
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
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTestPickup, setShowTestPickup] = useState(false);

  const lastOpenedTrip = useRef(null);

  const isApproved = accountStatus === 'approved';
  const isPending = accountStatus === 'pending';

  const {
    location,
    error: locationError,
    isLocating,
    stopSharing,
  } = useDriverLocation(isAvailable && isApproved);

  const enabled =
    isAvailable &&
    isApproved &&
    Boolean(location);

  const {
    pendingTrip,
    activeTrip,
    busy,
    error: tripError,
    now,
    acceptTrip,
    rejectTrip,
  } = useTripRequests(enabled, category);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setAccountStatus(null);
      setCategory(null);
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
        const data = snapshot.exists()
          ? snapshot.data()
          : null;

        setAccountStatus(data?.status ?? null);
        setCategory(data?.vehicleData?.category ?? null);
        setIsLoading(false);

        if (data?.status !== 'approved') {
          setIsAvailable(false);
          setShowTestPickup(false);
        }
      },
      (error) => {
        console.error(
          'Registro:',
          error.code || error.message
        );

        setAccountStatus(null);
        setCategory(null);
        setIsAvailable(false);
        setIsLoading(false);

        Alert.alert(t('profile.loadError'));
      }
    );

    return unsubscribe;
  }, [t]);

  useEffect(() => {
    if (!locationError || !isAvailable) return;

    setIsAvailable(false);
    setShowTestPickup(false);

    Alert.alert(t('requests.locationError'));
  }, [locationError, isAvailable, t]);

  useEffect(() => {
    if (
      !activeTrip ||
      lastOpenedTrip.current === activeTrip.id
    ) {
      return;
    }

    lastOpenedTrip.current = activeTrip.id;

    navigation.navigate('ActiveTrip', {
      tripId: activeTrip.id,
    });
  }, [activeTrip?.id, navigation]);

  const handleDirections = async () => {
    if (!enabled) return;

    const destination = encodeURIComponent(
      `${TEST_PICKUP.lat},${TEST_PICKUP.lng}`
    );

    const url =
      'https://www.google.com/maps/dir/?api=1' +
      `&destination=${destination}` +
      '&travelmode=driving&dir_action=navigate';

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('requests.directionsError'));
    }
  };

  const handleSignOut = async () => {
    setIsAvailable(false);
    setShowTestPickup(false);

    try {
      await stopSharing();
      await signOut();
    } catch {
      Alert.alert(t('requests.logoutError'));
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
      <View
        style={styles.mapLayer}
        collapsable={false}
      >
        <DriverMap
          location={
            isApproved && isAvailable
              ? location
              : null
          }
          pickup={
            showTestPickup && enabled
              ? TEST_PICKUP
              : null
          }
          language={language}
        />
      </View>

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
                  {enabled
                    ? t('home.available')
                    : t('home.unavailable')}
                </Text>
              </View>

              <Switch
                value={isAvailable && isApproved}
                onValueChange={(value) => {
                  if (
                    !isApproved ||
                    (activeTrip && !value)
                  ) {
                    return;
                  }

                  setIsAvailable(value);

                  if (!value) {
                    setShowTestPickup(false);
                  }
                }}
                disabled={
                  !isApproved ||
                  Boolean(activeTrip)
                }
                trackColor={{
                  false: colors.disabled,
                  true: colors.primary,
                }}
                thumbColor={
                  isAvailable
                    ? colors.onPrimary
                    : colors.textSecondary
                }
              />
            </View>

            {!isApproved && (
              <Text style={styles.hint}>
                {isPending
                  ? t('home.pendingMessage')
                  : t('login.invalidStatusMessage')}
              </Text>
            )}

            {isApproved &&
              isAvailable &&
              isLocating && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator
                    color={colors.primary}
                    size="small"
                  />

                  <Text style={styles.hint}>
                    {t('requests.gettingLocation')}
                  </Text>
                </View>
              )}

            {enabled && (
              <Text style={styles.gpsText}>
                {t('requests.gpsActive')}
              </Text>
            )}

            {enabled && !activeTrip && (
              <Pressable
                style={styles.secondaryButton}
                onPress={() =>
                  setShowTestPickup(!showTestPickup)
                }
              >
                <Text style={styles.secondaryButtonText}>
                  {showTestPickup
                    ? t('requests.hidePickup')
                    : t('requests.showPickup')}
                </Text>
              </Pressable>
            )}

            {enabled &&
              showTestPickup &&
              !activeTrip && (
                <View style={styles.testSection}>
                  <Text style={styles.testAddress}>
                    {TEST_PICKUP.address}
                  </Text>

                  <Pressable
                    style={styles.primaryButton}
                    onPress={handleDirections}
                  >
                    <Text style={styles.primaryButtonText}>
                      {t('requests.directions')}
                    </Text>
                  </Pressable>
                </View>
              )}

            {activeTrip && (
              <Pressable
                style={styles.primaryButton}
                onPress={() =>
                  navigation.navigate('ActiveTrip', {
                    tripId: activeTrip.id,
                  })
                }
              >
                <Text style={styles.primaryButtonText}>
                  {t('requests.continueTrip')}
                </Text>
              </Pressable>
            )}

            {!!tripError && !pendingTrip && (
              <Text style={styles.error}>
                {t(`requests.${tripError}`)}
              </Text>
            )}

            <Pressable
              style={styles.profileButton}
              onPress={() =>
                navigation.navigate('DriverProfile')
              }
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

      <TripRequestsPanel
        trip={pendingTrip}
        now={now}
        busy={busy}
        error={tripError}
        onAccept={acceptTrip}
        onReject={rejectTrip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapLayer: {
    flex: 1,
    minHeight: 1,
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
    width: 9,
    height: 9,
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
    gap: spacing.sm,
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
    color: colors.textSecondary,
    fontSize: 13,
  },
  loadingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  gpsText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  testSection: {
    gap: spacing.sm,
  },
  testAddress: {
    color: colors.text,
  },
  profileButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  profileButtonText: {
    color: colors.text,
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
  error: {
    color: colors.error,
  },
});
