
// AI-assisted: see docs/AI_LOG.md #120, #143, #164

import { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';
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

const TEXT = {
  es: {
    passenger: 'Pasajero',
    accepted: 'Viaje aceptado',
    driver_arriving: 'Conductor en camino',
    in_progress: 'Viaje en curso',
    completed: 'Viaje finalizado',
    startPickup: 'Iniciar recogida',
    passengerOnboard: 'Pasajero a bordo',
    finishTrip: 'Finalizar viaje',
    success: 'Viaje finalizado correctamente.',
    error: 'No se pudo actualizar el viaje. Intenta nuevamente.',
    unavailable: 'El viaje cambió de estado. Revisa la información.',
    completedNotice: 'El viaje se ha guardado como finalizado en Firebase.',
    nextStage: 'La navegación por el mapa y el resumen del pago se integrarán después.',
    confirmTitle: 'Finalizar viaje',
    confirmMessage: '¿Confirmas que el pasajero llegó a su destino?',
    cancel: 'Cancelar',
    confirm: 'Finalizar',
  },
  en: {
    passenger: 'Passenger',
    accepted: 'Trip accepted',
    driver_arriving: 'Driver on the way',
    in_progress: 'Trip in progress',
    completed: 'Trip completed',
    startPickup: 'Start pickup',
    passengerOnboard: 'Passenger onboard',
    finishTrip: 'Finish trip',
    success: 'Trip completed successfully.',
    error: 'Unable to update the trip. Please try again.',
    unavailable: 'The trip status has changed. Check its information.',
    completedNotice: 'The trip was saved as completed in Firebase.',
    nextStage: 'Map navigation and payment summary will be added next.',
    confirmTitle: 'Finish trip',
    confirmMessage: 'Do you confirm the passenger reached the destination?',
    cancel: 'Cancel',
    confirm: 'Finish',
  },
};

export default function ActiveTripScreen({ route }) {
  const { t, language } = useContext(LanguageContext);
  const labels = TEXT[language] ?? TEXT.es;

  const tripId = route.params?.tripId;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!tripId || !auth.currentUser) {
      setLoading(false);
      setError(true);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'trip', tripId),
      (snapshot) => {
        const item = snapshot.exists()
          ? snapshot.data()
          : null;

        const belongsToDriver =
          item?.driverId === auth.currentUser?.uid;

        setTrip(belongsToDriver ? item : null);
        setError(!belongsToDriver);
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

    return unsubscribe;
  }, [tripId]);

  const updateTripStatus = async () => {
    const step = NEXT_STEP[trip?.status];
    const uid = auth.currentUser?.uid;

    if (!step || !tripId || !uid || busy) {
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

        const currentTrip = snapshot.data();

        if (
          currentTrip.driverId !== uid ||
          currentTrip.status !== trip.status
        ) {
          throw new Error('unavailable');
        }

        transaction.update(tripRef, {
          status: step.next,
          [step.timestamp]: serverTimestamp(),
        });
      });

      if (step.next === 'completed') {
        Alert.alert(labels.confirmTitle, labels.success);
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
          : labels.error
      );
    } finally {
      setBusy(false);
    }
  };

  const handleNextStep = () => {
    if (trip?.status === 'in_progress') {
      Alert.alert(
        labels.confirmTitle,
        labels.confirmMessage,
        [
          { text: labels.cancel, style: 'cancel' },
          {
            text: labels.confirm,
            onPress: updateTripStatus,
          },
        ]
      );
      return;
    }

    updateTripStatus();
  };

  const renderField = (label, value) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? '-'}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !trip) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <View style={styles.center}>
          <Text style={styles.error}>
            {t('requests.tripLoadError')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const nextStep = NEXT_STEP[trip.status];

  const buttonLabel = {
    accepted: labels.startPickup,
    driver_arriving: labels.passengerOnboard,
    in_progress: labels.finishTrip,
  }[trip.status];

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {t('requests.activeTrip')}
        </Text>

        <View style={styles.card}>
          {renderField(
            t('requests.status'),
            labels[trip.status] ?? trip.status
          )}

          {renderField(
            labels.passenger,
            trip.passengerName
          )}

          {renderField(
            t('requests.origin'),
            trip.origin?.address
          )}

          {renderField(
            t('requests.destination'),
            trip.destination?.address
          )}

          {renderField(
            t('requests.category'),
            t(`vehicle.${trip.category}`)
          )}

          {renderField(
            t('requests.distance'),
            `${trip.distanceKm ?? '-'} km`
          )}

          {renderField(
            t('requests.duration'),
            `${trip.durationMin ?? '-'} min`
          )}
        </View>

        {nextStep && (
          <Pressable
            style={[
              styles.actionButton,
              busy && styles.disabledButton,
            ]}
            onPress={handleNextStep}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.actionText}>
                {buttonLabel}
              </Text>
            )}
          </Pressable>
        )}

        {trip.status === 'completed' && (
          <View style={styles.card}>
            <Text style={styles.completed}>
              {labels.completedNotice}
            </Text>
          </View>
        )}

        <Text style={styles.notice}>
          {labels.nextStage}
        </Text>
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
    gap: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  value: {
    ...typography.body,
    color: colors.text,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  completed: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  notice: {
    color: colors.warning,
    fontSize: 14,
  },
  error: {
    color: colors.error,
  },
});
