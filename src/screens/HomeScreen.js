
import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { doc, onSnapshot } from 'firebase/firestore';

import useAuth from '../hooks/useAuth';
import useDriverLocation from '../hooks/useDriverLocation';
import TripRequestsPanel from '../components/TripRequestsPanel';
import { auth, db } from '../config/firebase';
import { colors, spacing, radius, typography } from '../theme';
import { LanguageContext } from '../context/LanguageContext';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { t, language } = useContext(LanguageContext);

  const [isAvailable, setIsAvailable] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [vehicleCategory, setVehicleCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPending = accountStatus === 'pending';
  const isApproved = accountStatus === 'approved';
  const isRejected = accountStatus === 'rejected';

  const {
    location,
    error: locationError,
    isLocating,
    stopSharing,
  } = useDriverLocation(isAvailable && isApproved);

  const en = language === 'en';

  useEffect(() => {
    let active = true;
    const user = auth.currentUser;

    if (!user) {
      setIsAvailable(false);
      setAccountStatus(null);
      setVehicleCategory(null);
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

        const registration = snapshot.exists()
          ? snapshot.data()
          : null;

        const status = registration?.status ?? null;

        setAccountStatus(status);

        setVehicleCategory(
          registration?.vehicleData?.category ?? null
        );

        if (status !== 'approved') {
          setIsAvailable(false);
        }

        setIsLoading(false);
      },
      (error) => {
        if (!active) return;

        console.error(
          'Error al escuchar el estado:',
          error.code || error.message
        );

        setAccountStatus(null);
        setVehicleCategory(null);
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

  useEffect(() => {
    if (locationError && isAvailable) {
      setIsAvailable(false);

      const messages = {
        permissionDenied: en
          ? 'Allow location access to become available.'
          : 'Debes permitir el acceso a la ubicación para estar disponible.',
        locationDisabled: en
          ? 'Turn on your device location services.'
          : 'Activa la ubicación GPS de tu celular.',
        locationError: en
          ? 'Could not get your location. Please try again.'
          : 'No se pudo obtener tu ubicación. Inténtalo nuevamente.',
        syncError: en
          ? 'Could not synchronize your location with Firebase.'
          : 'No se pudo sincronizar tu ubicación con Firebase.',
      };

      Alert.alert(
        en ? 'Location' : 'Ubicación',
        messages[locationError] || messages.locationError
      );
    }
  }, [locationError, isAvailable, en]);

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

  const handleSignOut = async () => {
    setIsAvailable(false);

    try {
      await stopSharing();
      await signOut();
    } catch (error) {
      console.error(
        'Error al cerrar sesión:',
        error.code || error.message
      );

      Alert.alert(
        t('login.errorTitle'),
        en
          ? 'Could not finish disconnecting. Please try again.'
          : 'No se pudo completar la desconexión. Inténtalo nuevamente.'
      );
    }
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
              {isAvailable && isApproved
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

        {isApproved && (
          <TripRequestsPanel
            enabled={
              isAvailable &&
              !!location
            }
            category={vehicleCategory}
            language={language}
          />
        )}

        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>
            {en ? 'My location' : 'Mi ubicación'}
          </Text>

          {location && isAvailable && isApproved ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              showsMyLocationButton
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={
                  en ? 'My vehicle' : 'Mi vehículo'
                }
                description={
                  en
                    ? 'Current driver location'
                    : 'Ubicación actual del conductor'
                }
              />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              {isLocating && isAvailable ? (
                <>
                  <ActivityIndicator
                    size="large"
                    color={colors.primary}
                  />
                  <Text style={styles.mapMessage}>
                    {en
                      ? 'Getting your location...'
                      : 'Obteniendo tu ubicación...'}
                  </Text>
                </>
              ) : (
                <Text style={styles.mapMessage}>
                  {isApproved
                    ? en
                      ? 'Turn on availability to see your location on the map.'
                      : 'Activa Disponible para ver tu ubicación en el mapa.'
                    : en
                      ? 'Your account must be approved to enable GPS.'
                      : 'Tu cuenta debe estar aprobada para activar el GPS.'}
                </Text>
              )}
            </View>
          )}

          {location && isAvailable && (
            <Text style={styles.locationStatus}>
              {en
                ? 'GPS location active'
                : 'Ubicación GPS activa'}
            </Text>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutPressed,
          ]}
          onPress={handleSignOut}
          accessibilityRole="button"
        >
          <Text style={styles.logoutText}>
            {t('home.logOut')}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: spacing.md,
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
  mapCard: {
    height: 260,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  mapTitle: {
    ...typography.label,
    color: colors.text,
    paddingHorizontal: spacing.sm,
  },
  map: {
    flex: 1,
    borderRadius: radius.md,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  mapMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  locationStatus: {
    ...typography.body,
    color: colors.success,
    fontSize: 12,
    paddingHorizontal: spacing.sm,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    minHeight: 52,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  logoutPressed: {
    opacity: 0.7,
  },
  logoutText: {
    color: colors.onPrimary,
    ...typography.label,
  },
});
