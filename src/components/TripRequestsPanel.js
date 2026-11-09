
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import useTripRequests from '../hooks/useTripRequests';
import { colors, radius, spacing, typography } from '../theme';

export default function TripRequestsPanel({
  enabled,
  category,
  language,
}) {
  const {
    requests,
    activeTrip,
    isLoading,
    isAccepting,
    error,
    acceptTrip,
    rejectTrip,
  } = useTripRequests(enabled, category);

  const [message, setMessage] = useState('');
  const en = language === 'en';

  const labels = en
    ? {
        title: 'Trip requests',
        waiting: 'Waiting for trip requests...',
        enable: 'Enable availability and GPS to receive trips.',
        origin: 'Pickup',
        destination: 'Destination',
        passenger: 'Passenger',
        category: 'Category',
        distance: 'Distance',
        duration: 'Duration',
        payment: 'Payment method',
        accept: 'Accept',
        reject: 'Reject',
        accepting: 'Accepting...',
        accepted: 'Trip accepted',
        acceptedDescription: 'This trip is assigned to your account.',
        loadError: 'Could not load trips. Check Firebase permissions.',
        acceptError: 'Could not accept this trip.',
        unavailable: 'This trip is no longer available.',
      }
    : {
        title: 'Solicitudes de viajes',
        waiting: 'Esperando solicitudes de viajes...',
        enable: 'Activa Disponible y el GPS para recibir viajes.',
        origin: 'Recogida',
        destination: 'Destino',
        passenger: 'Pasajero',
        category: 'Categoría',
        distance: 'Distancia',
        duration: 'Duración',
        payment: 'Método de pago',
        accept: 'Aceptar',
        reject: 'Rechazar',
        accepting: 'Aceptando...',
        accepted: 'Viaje aceptado',
        acceptedDescription: 'Este viaje está asignado a tu cuenta.',
        loadError: 'No se pudieron cargar los viajes. Revisa los permisos de Firebase.',
        acceptError: 'No se pudo aceptar este viaje.',
        unavailable: 'Este viaje ya no está disponible.',
      };

  const categoryLabel = (value) => {
    if (value === 'economy') {
      return en ? 'Economy' : 'Económico';
    }

    if (value === 'xl') return 'XL';
    if (value === 'premium') return 'Premium';

    return value || '-';
  };

  const paymentLabel = (value) => {
    if (value === 'cash') {
      return en ? 'Cash' : 'Efectivo';
    }

    if (value === 'mercadopago') return 'Mercado Pago';
    if (value === 'stripe') return 'Stripe';

    return value || '-';
  };

  const handleAccept = async (tripId) => {
    setMessage('');

    const accepted = await acceptTrip(tripId);

    if (!accepted) {
      setMessage(labels.acceptError);
    }
  };

  const renderTrip = (trip) => (
    <View key={trip.id} style={styles.trip}>
      <Text style={styles.passenger}>
        {labels.passenger}: {trip.passengerName || trip.passengerId || '-'}
      </Text>

      <Text style={styles.detail}>
        {labels.origin}: {trip.origin?.address || '-'}
      </Text>

      <Text style={styles.detail}>
        {labels.destination}: {trip.destination?.address || '-'}
      </Text>

      <Text style={styles.detail}>
        {labels.category}: {categoryLabel(trip.category)}
      </Text>

      <Text style={styles.detail}>
        {labels.distance}: {
          typeof trip.distanceKm === 'number'
            ? `${trip.distanceKm.toLocaleString(
                en ? 'en-US' : 'es-CO'
              )} km`
            : '-'
        }
      </Text>

      <Text style={styles.detail}>
        {labels.duration}: {
          typeof trip.durationMin === 'number'
            ? `${trip.durationMin} min`
            : '-'
        }
      </Text>

      <Text style={styles.detail}>
        {labels.payment}: {paymentLabel(trip.paymentMethod)}
      </Text>

      {!activeTrip && (
        <View style={styles.actions}>
          <Pressable
            style={[
              styles.rejectButton,
              isAccepting && styles.disabled,
            ]}
            onPress={() => rejectTrip(trip.id)}
            disabled={isAccepting}
          >
            <Text style={styles.rejectText}>
              {labels.reject}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.acceptButton,
              isAccepting && styles.disabled,
            ]}
            onPress={() => handleAccept(trip.id)}
            disabled={isAccepting}
          >
            <Text style={styles.acceptText}>
              {isAccepting
                ? labels.accepting
                : labels.accept}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {activeTrip ? labels.accepted : labels.title}
      </Text>

      {activeTrip ? (
        <>
          <Text style={styles.success}>
            {labels.acceptedDescription}
          </Text>
          {renderTrip(activeTrip)}
        </>
      ) : !enabled ? (
        <Text style={styles.hint}>
          {labels.enable}
        </Text>
      ) : isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : requests.length === 0 ? (
        <Text style={styles.hint}>
          {labels.waiting}
        </Text>
      ) : (
        renderTrip(requests[0])
      )}

      {(error || message) && !activeTrip && (
        <Text style={styles.error}>
          {error === 'listenError'
            ? labels.loadError
            : error === 'tripUnavailable'
              ? labels.unavailable
              : message || labels.acceptError}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    ...typography.label,
    color: colors.text,
    fontSize: 16,
  },
  hint: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
  },
  trip: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  passenger: {
    ...typography.label,
    color: colors.text,
  },
  detail: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  acceptText: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  rejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  rejectText: {
    color: colors.text,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
  success: {
    color: colors.success,
    fontSize: 13,
  },
  error: {
    color: colors.error,
    fontSize: 13,
  },
});
