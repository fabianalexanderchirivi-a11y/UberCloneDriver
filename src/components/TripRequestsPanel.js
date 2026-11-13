
// AI-assisted: see docs/AI_LOG.md #143

import { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { LanguageContext } from '../context/LanguageContext';
import { calculateFare } from '../utils/calculateFare';
import { colors, spacing, radius, typography } from '../theme';

const money = (value) =>
  `$${Math.round(value).toLocaleString('es-CO')} COP`;

export default function TripRequestsPanel({
  trip,
  now,
  busy,
  error,
  onAccept,
  onReject,
}) {
  const { t } = useContext(LanguageContext);

  const [message, setMessage] = useState('');
  const expiring = useRef(null);

  const expiresAt = trip?.expiresAt?.toMillis?.() ?? 0;

  const secondsLeft = Math.max(
    0,
    Math.ceil((expiresAt - now) / 1000)
  );

  const amount = trip
    ? (() => {
        try {
          return calculateFare({
            distanceKm: trip.distanceKm,
            durationMin: trip.durationMin,
            category: trip.category,
            tip: 0,
          });
        } catch {
          return null;
        }
      })()
    : null;

  useEffect(() => {
    setMessage('');
    expiring.current = null;
  }, [trip?.id]);

  useEffect(() => {
    if (
      !trip ||
      secondsLeft > 0 ||
      busy ||
      expiring.current === trip.id
    ) {
      return;
    }

    expiring.current = trip.id;
    onReject(trip.id);
  }, [trip, secondsLeft, busy, onReject]);

  const handleAction = async (action) => {
    if (!trip || secondsLeft === 0 || busy) {
      return;
    }

    setMessage('');

    const success = await action(trip.id);

    if (!success) {
      setMessage(t('requests.unavailable'));
    }
  };

  return (
    <Modal
      visible={Boolean(trip)}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.backdrop}>
        {trip && (
          <View style={styles.card}>
            <Text style={styles.title}>
              {t('requests.title')}
            </Text>

            <Text style={styles.timer}>
              {t('requests.time')}: {secondsLeft}s
            </Text>

            <Text style={styles.info}>
              {t('requests.origin')}: {trip.origin?.address || '-'}
            </Text>

            <Text style={styles.info}>
              {t('requests.destination')}: {trip.destination?.address || '-'}
            </Text>

            <Text style={styles.info}>
              {t('requests.category')}: {t(`vehicle.${trip.category}`)}
            </Text>

            <Text style={styles.info}>
              {t('requests.distance')}: {trip.distanceKm} km
            </Text>

            <Text style={styles.info}>
              {t('requests.duration')}: {trip.durationMin} min
            </Text>

            <Text style={styles.info}>
              {t('requests.payment')}:{' '}
              {t(`requests.payment_${trip.paymentMethod}`)}
            </Text>

            <Text style={styles.amount}>
              {t('requests.fare')}:{' '}
              {amount ? money(amount.fare) : '-'}
            </Text>

            <Text style={styles.amount}>
              {t('requests.earnings')}:{' '}
              {amount ? money(amount.driverEarnings) : '-'}
            </Text>

            {!!(error || message) && (
              <Text style={styles.error}>
                {message || t(`requests.${error}`)}
              </Text>
            )}

            <View style={styles.actions}>
              <Pressable
                style={styles.secondary}
                disabled={busy}
                onPress={() => handleAction(onReject)}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryText}>
                  {t('requests.reject')}
                </Text>
              </Pressable>

              <Pressable
                style={styles.primary}
                disabled={busy || secondsLeft === 0 || !amount}
                onPress={() => handleAction(onAccept)}
                accessibilityRole="button"
              >
                {busy ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.primaryText}>
                    {t('requests.accept')}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.68)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 22,
  },
  timer: {
    color: colors.warning,
    fontWeight: '700',
    fontSize: 20,
  },
  info: {
    color: colors.text,
    fontSize: 14,
  },
  amount: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: colors.error,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primary: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  secondary: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
});
