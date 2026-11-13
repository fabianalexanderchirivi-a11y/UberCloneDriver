
// AI-assisted: see docs/AI_LOG.md #120, #143, #164, #171, #175, #179, #186

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import DriverMap from '../components/DriverMap';
import { getDrivingRoute } from '../services/routingService';
import { resolveTripLocation } from '../services/geocodingService';
import { LanguageContext } from '../context/LanguageContext';
import { colors, spacing, radius, typography } from '../theme';

const NEXT_STEP = {
  accepted: {
    next: 'driver_arriving',
    timestamp: 'arrivingAt',
  },
  driver_arriving: {
    next: 'in_progress',
    timestamp: 'startedAt',
  },
  in_progress: {
    next: 'completed',
    timestamp: 'completedAt',
  },
};

const WORDS = {
  es: {
    trip: 'Recorrido',
    passenger: 'Pasajero',
    pickup: 'Recoger pasajero',
    destination: 'Destino',
    ready: 'Listo para iniciar',
    driving: 'En camino',
    arrived: 'Has llegado',
    completed: 'Viaje finalizado',
    start: 'Iniciar recorrido',
    onboard: 'Pasajero a bordo',
    finish: 'Finalizar viaje',
    loadingPlaces: 'Buscando ubicaciones...',
    loadingRoute: 'Calculando recorrido...',
    placeError: 'No se encontraron las ubicaciones. Revisa los nombres.',
    routeError: 'No fue posible calcular la ruta.',
    gpsError: 'Se necesita el GPS para iniciar.',
    retry: 'Reintentar',
    waiting: 'Preparando recorrido...',
    distance: 'Distancia',
    duration: 'Tiempo estimado',
    confirmTitle: 'Finalizar viaje',
    confirmMessage: '¿Confirmas que llegaste al destino?',
    cancel: 'Cancelar',
    confirm: 'Finalizar',
    success: 'Viaje finalizado correctamente.',
    updateError: 'No se pudo actualizar el viaje.',
    unavailable: 'El viaje cambió de estado.',
  },
  en: {
    trip: 'Route',
    passenger: 'Passenger',
    pickup: 'Passenger pickup',
    destination: 'Destination',
    ready: 'Ready to start',
    driving: 'On the way',
    arrived: 'You have arrived',
    completed: 'Trip completed',
    start: 'Start route',
    onboard: 'Passenger onboard',
    finish: 'Finish trip',
    loadingPlaces: 'Finding locations...',
    loadingRoute: 'Calculating route...',
    placeError: 'Locations not found. Check their names.',
    routeError: 'Unable to calculate the route.',
    gpsError: 'GPS is required to start.',
    retry: 'Retry',
    waiting: 'Preparing route...',
    distance: 'Distance',
    duration: 'Estimated time',
    confirmTitle: 'Finish trip',
    confirmMessage: 'Do you confirm arrival?',
    cancel: 'Cancel',
    confirm: 'Finish',
    success: 'Trip completed successfully.',
    updateError: 'Unable to update the trip.',
    unavailable: 'The trip status changed.',
  },
};

const toCoordinate = (point) => {
  const latitude = point?.latitude ?? point?.lat;
  const longitude = point?.longitude ?? point?.lng;

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return null;
  }

  return { latitude, longitude };
};

const distanceMeters = (a, b) => {
  const radians = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * radians;
  const dLng = (b.longitude - a.longitude) * radians;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * radians) *
      Math.cos(b.latitude * radians) *
      Math.sin(dLng / 2) ** 2;

  return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
};

const getHeading = (a, b) => {
  const radians = Math.PI / 180;

  const lat1 = a.latitude * radians;
  const lat2 = b.latitude * radians;
  const delta = (b.longitude - a.longitude) * radians;

  const y = Math.sin(delta) * Math.cos(lat2);

  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) *
      Math.cos(lat2) *
      Math.cos(delta);

  return (
    Math.atan2(y, x) * 180 / Math.PI + 360
  ) % 360;
};

const buildSegments = (coordinates) => {
  const segments = [];
  let total = 0;

  for (let i = 1; i < coordinates.length; i += 1) {
    const start = coordinates[i - 1];
    const end = coordinates[i];

    const length = distanceMeters(start, end);

    if (length < 0.01) continue;

    segments.push({
      start,
      end,
      from: total,
      to: total + length,
      length,
      heading: getHeading(start, end),
    });

    total += length;
  }

  return { segments, total };
};

const pointAtDistance = (route, distance) => {
  const { segments, total } = route;

  if (!segments.length) return null;

  const traveled = Math.max(
    0,
    Math.min(distance, total)
  );

  let left = 0;
  let right = segments.length - 1;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);

    if (segments[middle].to < traveled) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  const segment = segments[left];

  const fraction =
    (traveled - segment.from) / segment.length;

  return {
    latitude:
      segment.start.latitude +
      (segment.end.latitude - segment.start.latitude) *
        fraction,
    longitude:
      segment.start.longitude +
      (segment.end.longitude - segment.start.longitude) *
        fraction,
    heading: segment.heading,
  };
};

export default function ActiveTripScreen({ route }) {
  const { language } = useContext(LanguageContext);
  const labels = WORDS[language] ?? WORDS.es;
  const tripId = route.params?.tripId;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const [location, setLocation] = useState(null);

  const [resolvedLocations, setResolvedLocations] =
    useState(null);

  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState('');

  const [routeData, setRouteData] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');

  const [retryCount, setRetryCount] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [moving, setMoving] = useState(false);

  // Escuchar el viaje en Firestore.
  useEffect(() => {
    if (!tripId || !auth.currentUser) {
      setError(true);
      setLoading(false);
      return;
    }

    return onSnapshot(
      doc(db, 'trip', tripId),
      (snapshot) => {
        const data = snapshot.exists()
          ? snapshot.data()
          : null;

        const owned =
          data?.driverId === auth.currentUser?.uid;

        setTrip(owned ? data : null);
        setError(!owned);
        setLoading(false);
      },
      (snapshotError) => {
        console.error(
          'Active trip:',
          snapshotError.code || snapshotError.message
        );

        setError(true);
        setLoading(false);
      }
    );
  }, [tripId]);

  // GPS real del conductor.
  useEffect(() => {
    let mounted = true;
    let watcher;

    const startGPS = async () => {
      try {
        const permission =
          await Location.getForegroundPermissionsAsync();

        let granted = permission.granted;

        if (!granted) {
          const requested =
            await Location.requestForegroundPermissionsAsync();

          granted = requested.granted;
        }

        if (!granted) return;

        const current =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        if (!mounted) return;

        setLocation(current.coords);

        const subscription =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              distanceInterval: 10,
              timeInterval: 5000,
            },
            (position) => {
              if (mounted) {
                setLocation(position.coords);
              }
            }
          );

        if (mounted) {
          watcher = subscription;
        } else {
          subscription.remove();
        }
      } catch (gpsError) {
        console.error('Trip GPS:', gpsError.message);
      }
    };

    startGPS();

    return () => {
      mounted = false;
      watcher?.remove();
    };
  }, []);

  const status = trip?.status;

  const phase =
    status === 'accepted' ||
    status === 'driver_arriving'
      ? 'pickup'
      : status === 'in_progress'
        ? 'destination'
        : null;

  const gpsReady =
    Number.isFinite(location?.latitude) &&
    Number.isFinite(location?.longitude);

  const originAddress = trip?.origin?.address;
  const originLat = trip?.origin?.lat ?? trip?.origin?.latitude;
  const originLng = trip?.origin?.lng ?? trip?.origin?.longitude;

  const destinationAddress = trip?.destination?.address;
  const destinationLat =
    trip?.destination?.lat ?? trip?.destination?.latitude;
  const destinationLng =
    trip?.destination?.lng ?? trip?.destination?.longitude;

  // Convertir nombres de lugares a coordenadas.
  useEffect(() => {
    let cancelled = false;

    setResolvedLocations(null);
    setGeoError('');

    if (
      !tripId ||
      !phase ||
      !trip?.origin ||
      !trip?.destination
    ) {
      setGeocoding(false);
      return;
    }

    setGeocoding(true);

    const resolvePlaces = async () => {
      try {
        const origin = await resolveTripLocation(trip.origin);
        const destination = await resolveTripLocation(
          trip.destination
        );

        if (!cancelled) {
          setResolvedLocations({ origin, destination });
        }
      } catch (resolveError) {
        if (!cancelled) {
          console.error(
            'Trip geocoding:',
            resolveError.message
          );

          setGeoError('place');
        }
      } finally {
        if (!cancelled) {
          setGeocoding(false);
        }
      }
    };

    resolvePlaces();

    return () => {
      cancelled = true;
    };
  }, [
    tripId,
    phase,
    originAddress,
    originLat,
    originLng,
    destinationAddress,
    destinationLat,
    destinationLng,
    retryCount,
  ]);

  // Obtener la ruta real por las calles mediante OSRM.
  useEffect(() => {
    setRouteData(null);
    setRouteError('');
    setRouteLoading(false);
    setDistanceTraveled(0);
    setMoving(false);

    if (!trip || !phase || !resolvedLocations) {
      return;
    }

    const pickup = resolvedLocations.origin;
    const destination = resolvedLocations.destination;
    const gps = toCoordinate(location);

    const start =
      phase === 'pickup' ? gps : pickup;

    const end =
      phase === 'pickup' ? pickup : destination;

    if (!start || !end) {
      if (!gps && phase === 'pickup') {
        setRouteError('gps');
      } else {
        setRouteError('route');
      }

      return;
    }

    const controller = new AbortController();

    const loadRoute = async () => {
      setRouteLoading(true);

      try {
        const result = await getDrivingRoute(
          start,
          end,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setRouteData(result);
          setRouteError('');

          // Recorrido automático en las etapas activas.
          if (
            status === 'driver_arriving' ||
            status === 'in_progress'
          ) {
            setMoving(true);
          }
        }
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          console.error(
            'Trip routing:',
            fetchError.message
          );

          setRouteError('route');
        }
      } finally {
        if (!controller.signal.aborted) {
          setRouteLoading(false);
        }
      }
    };

    loadRoute();

    return () => controller.abort();
  }, [
    tripId,
    phase,
    status,
    resolvedLocations,
    gpsReady,
    retryCount,
  ]);

  const routeCoordinates = routeData?.coordinates ?? [];

  const routeGeometry = useMemo(
    () => buildSegments(routeCoordinates),
    [routeCoordinates]
  );

  const totalDistance = routeGeometry.total;

  // Simulación acelerada: entre 25 y 90 segundos.
  const simulationSeconds = Math.max(
    25,
    Math.min(
      90,
      (routeData?.distanceKm ?? 1) * 8
    )
  );

  const distancePerTick =
    totalDistance / (simulationSeconds * 10);

  useEffect(() => {
    if (!moving || totalDistance <= 0) return;

    const interval = setInterval(() => {
      setDistanceTraveled((previous) =>
        Math.min(
          previous + distancePerTick,
          totalDistance
        )
      );
    }, 100);

    return () => clearInterval(interval);
  }, [
    moving,
    totalDistance,
    distancePerTick,
  ]);

  const arrived =
    totalDistance > 0 &&
    distanceTraveled >= totalDistance;

  useEffect(() => {
    if (moving && arrived) {
      setMoving(false);
    }
  }, [moving, arrived]);

  const vehiclePosition = useMemo(
    () => pointAtDistance(
      routeGeometry,
      distanceTraveled
    ),
    [routeGeometry, distanceTraveled]
  );

  const journeyStarted =
    status === 'driver_arriving' ||
    status === 'in_progress';

  const followVehicle =
    journeyStarted && !!vehiclePosition;

  const nextStep = NEXT_STEP[status];

  // Actualizar el estado del viaje en Firestore.
  const updateTripStatus = async () => {
    const step = NEXT_STEP[status];
    const uid = auth.currentUser?.uid;

    if (!step || !uid || !tripId || busy) {
      return;
    }

    setBusy(true);

    try {
      await runTransaction(db, async (transaction) => {
        const tripRef = doc(db, 'trip', tripId);
        const snapshot = await transaction.get(tripRef);

        if (!snapshot.exists()) {
          throw new Error('unavailable');
        }

        const current = snapshot.data();

        if (
          current.driverId !== uid ||
          current.status !== status
        ) {
          throw new Error('unavailable');
        }

        transaction.update(tripRef, {
          status: step.next,
          [step.timestamp]: serverTimestamp(),
        });
      });

      if (step.next === 'completed') {
        Alert.alert(
          labels.confirmTitle,
          labels.success
        );
      }
    } catch (updateError) {
      console.error(
        'Trip progress:',
        updateError.code || updateError.message
      );

      Alert.alert(
        'UberCloneDriver',
        updateError.message === 'unavailable'
          ? labels.unavailable
          : labels.updateError
      );
    } finally {
      setBusy(false);
    }
  };

  const handleNext = () => {
    if (status !== 'in_progress') {
      updateTripStatus();
      return;
    }

    Alert.alert(
      labels.confirmTitle,
      labels.confirmMessage,
      [
        {
          text: labels.cancel,
          style: 'cancel',
        },
        {
          text: labels.confirm,
          onPress: updateTripStatus,
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.screen}
        edges={['bottom']}
      >
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !trip) {
    return (
      <SafeAreaView
        style={styles.screen}
        edges={['bottom']}
      >
        <View style={styles.center}>
          <Text style={styles.error}>
            {labels.unavailable}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const stopAddress =
    phase === 'pickup'
      ? trip.origin?.address
      : trip.destination?.address;

  const statusLabel =
    status === 'completed'
      ? labels.completed
      : arrived
        ? labels.arrived
        : moving
          ? labels.driving
          : labels.ready;

  const actionLabel = {
    accepted: labels.start,
    driver_arriving: labels.onboard,
    in_progress: labels.finish,
  }[status];

  const actionEnabled =
    !busy &&
    !geocoding &&
    !routeLoading &&
    !!routeData &&
    (
      status === 'accepted' ||
      (
        (
          status === 'driver_arriving' ||
          status === 'in_progress'
        ) &&
        arrived
      )
    );

  const mapPickup = resolvedLocations
    ? {
        ...resolvedLocations.origin,
        address: trip.origin?.address,
      }
    : trip.origin;

  const mapDestination = resolvedLocations
    ? {
        ...resolvedLocations.destination,
        address: trip.destination?.address,
      }
    : trip.destination;

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['bottom']}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {labels.trip}
        </Text>

        <Text style={styles.status}>
          {statusLabel}
        </Text>
      </View>

      <View
        style={styles.mapContainer}
        collapsable={false}
      >
        <DriverMap
          location={location}
          pickup={mapPickup}
          destination={mapDestination}
          routeCoordinates={routeCoordinates}
          simulatedLocation={
            followVehicle ? vehiclePosition : null
          }
          vehicleHeading={
            vehiclePosition?.heading ?? 0
          }
          followVehicle={followVehicle}
          language={language}
        />
      </View>

      <View style={styles.bottomPanel}>
        {status === 'completed' ? (
          <Text style={styles.completed}>
            {labels.completed}
          </Text>
        ) : (
          <>
            <Text style={styles.caption}>
              {phase === 'pickup'
                ? labels.pickup
                : labels.destination}
            </Text>

            <Text
              style={styles.address}
              numberOfLines={2}
            >
              {stopAddress ?? '-'}
            </Text>

            <Text style={styles.passenger}>
              {labels.passenger}: {trip.passengerName ?? '-'}
            </Text>

            {geocoding ? (
              <View style={styles.infoRow}>
                <ActivityIndicator
                  color={colors.primary}
                />
                <Text style={styles.info}>
                  {labels.loadingPlaces}
                </Text>
              </View>
            ) : geoError ? (
              <Text style={styles.warning}>
                {labels.placeError}
              </Text>
            ) : routeLoading ? (
              <View style={styles.infoRow}>
                <ActivityIndicator
                  color={colors.primary}
                />
                <Text style={styles.info}>
                  {labels.loadingRoute}
                </Text>
              </View>
            ) : routeError ? (
              <Text style={styles.warning}>
                {routeError === 'gps'
                  ? labels.gpsError
                  : labels.routeError}
              </Text>
            ) : routeData ? (
              <Text style={styles.info}>
                {labels.distance}:{' '}
                {routeData.distanceKm.toFixed(1)} km
                {'  ·  '}
                {labels.duration}:{' '}
                {Math.round(routeData.durationMin)} min
              </Text>
            ) : (
              <Text style={styles.info}>
                {labels.waiting}
              </Text>
            )}

            {!!(geoError || routeError) && (
              <Pressable
                style={styles.retryButton}
                onPress={() =>
                  setRetryCount(
                    (previous) => previous + 1
                  )
                }
              >
                <Text style={styles.retryText}>
                  {labels.retry}
                </Text>
              </Pressable>
            )}

            {nextStep && (
              <Pressable
                style={[
                  styles.actionButton,
                  !actionEnabled && styles.disabledButton,
                ]}
                disabled={!actionEnabled}
                onPress={handleNext}
              >
                {busy ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionText}>
                    {actionLabel}
                  </Text>
                )}
              </Pressable>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  status: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  mapContainer: {
    flex: 1,
    minHeight: 180,
  },
  bottomPanel: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  caption: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  address: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  passenger: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  info: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  warning: {
    color: colors.warning,
    fontSize: 13,
  },
  retryButton: {
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.primary,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    minHeight: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  completed: {
    color: colors.success,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    padding: spacing.md,
  },
  error: {
    color: colors.error,
  },
});
