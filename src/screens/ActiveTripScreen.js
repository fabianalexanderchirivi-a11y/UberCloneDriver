
 // AI-assisted: see docs/AI_LOG.md #120

import { useContext, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageContext } from '../context/LanguageContext';
import { colors, spacing, radius, typography } from '../theme';

const TEST_TRIP = {
  passengerName: 'Carlos Pérez',
  category: 'economy',
  origin: {
    address: 'Parque Principal de Bello',
    lat: 6.33492,
    lng: -75.55829,
  },
  destination: {
    address: 'Parque de Berrío, Medellín',
  },
  distanceKm: 8.5,
  durationMin: 22,
  paymentMethod: 'cash',
};

const TRIP_STATES = [
  'accepted',
  'driver_arriving',
  'in_progress',
  'completed',
];

export default function ActiveTripScreen({ navigation }) {
  const { language } = useContext(LanguageContext);
  const [status, setStatus] = useState('accepted');

  const en = language === 'en';
  const completed = status === 'completed';

  const labels = en
    ? {
        title: 'Trip in progress',
        simulation: 'LOCAL SIMULATION',
        passenger: 'Passenger',
        pickup: 'Pickup',
        destination: 'Destination',
        category: 'Category',
        distance: 'Distance',
        duration: 'Duration',
        payment: 'Payment',
        status: 'Trip status',
        accepted: 'Accepted',
        driver_arriving: 'Heading to passenger',
        in_progress: 'Trip in progress',
        completed: 'Completed',
        nextAccepted: 'Head to pickup',
        nextArriving: 'Start trip',
        nextProgress: 'Finish trip',
        completedMessage: 'Test trip completed successfully.',
        back: 'Back to home',
        note: 'Test data only. No real trip is being created.',
        cash: 'Cash',
      }
    : {
        title: 'Viaje en curso',
        simulation: 'SIMULACIÓN LOCAL',
        passenger: 'Pasajero',
        pickup: 'Recogida',
        destination: 'Destino',
        category: 'Categoría',
        distance: 'Distancia',
        duration: 'Duración',
        payment: 'Pago',
        status: 'Estado del viaje',
        accepted: 'Aceptado',
        driver_arriving: 'Camino al pasajero',
        in_progress: 'Viaje en curso',
        completed: 'Finalizado',
        nextAccepted: 'Ir a recoger',
        nextArriving: 'Iniciar viaje',
        nextProgress: 'Finalizar viaje',
        completedMessage: 'Viaje de prueba finalizado correctamente.',
        back: 'Volver al inicio',
        note: 'Datos de prueba. No se crea ningún viaje real.',
        cash: 'Efectivo',
      };

  const advanceTrip = () => {
    const currentIndex = TRIP_STATES.indexOf(status);

    if (currentIndex < TRIP_STATES.length - 1) {
      setStatus(TRIP_STATES[currentIndex + 1]);
    }
  };

  const nextButtonTitle =
    status === 'accepted'
      ? labels.nextAccepted
      : status === 'driver_arriving'
        ? labels.nextArriving
        : labels.nextProgress;

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {labels.title}
        </Text>

        <Text style={styles.simulation}>
          {labels.simulation}
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            {labels.passenger}
          </Text>

          <Text style={styles.passenger}>
            {TEST_TRIP.passengerName}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.label}>
            {labels.pickup}
          </Text>

          <Text style={styles.value}>
            {TEST_TRIP.origin.address}
          </Text>

          <Text style={styles.label}>
            {labels.destination}
          </Text>

          <Text style={styles.value}>
            {TEST_TRIP.destination.address}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            {labels.category}
          </Text>

          <Text style={styles.value}>
            {TEST_TRIP.category === 'economy'
              ? en ? 'Economy' : 'Económico'
              : TEST_TRIP.category}
          </Text>

          <Text style={styles.label}>
            {labels.distance}
          </Text>

          <Text style={styles.value}>
            {TEST_TRIP.distanceKm} km
          </Text>

          <Text style={styles.label}>
            {labels.duration}
          </Text>

          <Text style={styles.value}>
            {TEST_TRIP.durationMin} min
          </Text>

          <Text style={styles.label}>
            {labels.payment}
          </Text>

          <Text style={styles.value}>
            {labels.cash}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            {labels.status}
          </Text>

          <Text
            style={[
              styles.status,
              completed && styles.completedStatus,
            ]}
          >
            {labels[status]}
          </Text>

          <View style={styles.progress}>
            {TRIP_STATES.map((step, index) => (
              <View
                key={step}
                style={[
                  styles.progressStep,
                  index <= TRIP_STATES.indexOf(status) &&
                    styles.progressActive,
                ]}
              />
            ))}
          </View>

          {completed && (
            <Text style={styles.completedMessage}>
              {labels.completedMessage}
            </Text>
          )}
        </View>

        <Text style={styles.note}>
          {labels.note}
        </Text>

        {!completed ? (
          <Pressable
            style={styles.primaryButton}
            onPress={advanceTrip}
            accessibilityRole="button"
          >
            <Text style={styles.primaryText}>
              {nextButtonTitle}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
          >
            <Text style={styles.primaryText}>
              {labels.back}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  simulation: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  value: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  passenger: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  status: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  completedStatus: {
    color: colors.success,
  },
  progress: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  progressStep: {
    flex: 1,
    height: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.disabled,
  },
  progressActive: {
    backgroundColor: colors.primary,
  },
  completedMessage: {
    color: colors.success,
    marginTop: spacing.sm,
  },
  note: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  primaryText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
