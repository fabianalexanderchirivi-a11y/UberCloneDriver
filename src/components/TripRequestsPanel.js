
// AI-assisted: see docs/AI_LOG.md #143, #190, #192, #193

import { useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

import { LanguageContext } from '../context/LanguageContext';
import useTripEstimate from '../hooks/useTripEstimate';
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
  const { t, language } = useContext(LanguageContext);

  const [dismissedKey, setDismissedKey] = useState(null);
  const [processing, setProcessing] = useState(false);
  const actionInProgress = useRef(false);

  const { estimate, loading, error: estimateError, retry } =
    useTripEstimate(trip);

  const expiresAt = trip?.expiresAt?.toMillis?.() ?? 0;

  const requestKey = trip
    ? `${trip.id}:${expiresAt}`
    : null;

  const secondsLeft = Math.max(
    0,
    Math.ceil((expiresAt - now) / 1000)
  );

  const visible =
    Boolean(trip) &&
    dismissedKey !== requestKey &&
    secondsLeft > 0;

  const isBusy = busy || processing;

  const text = language === 'en'
    ? {
        calculating: 'Calculating distance and fare...',
        calculationError:
          'Unable to calculate the route. Try again.',
        retry: 'Retry calculation',
        estimated: 'Estimated price based on route',
      }
    : {
        calculating: 'Calculando distancia y tarifa...',
        calculationError:
          'No se pudo calcular la ruta. Intenta nuevamente.',
        retry: 'Reintentar cálculo',
        estimated: 'Precio estimado según el recorrido',
      };

  const handleAction = async (action) => {
    if (
      !trip ||
      !visible ||
      isBusy ||
      actionInProgress.current
    ) {
      return;
    }

    const currentKey = requestKey;
    const tripId = trip.id;

    actionInProgress.current = true;
    setProcessing(true);

    try {
      const success = await action(tripId);

      if (!success) {
        setDismissedKey(currentKey);

        Alert.alert(
          'UberCloneDriver',
          t('requests.unavailable')
        );

        return;
      }

      setDismissedKey(currentKey);
    } catch (actionError) {
      console.error(
        'Trip request action:',
        actionError.code || actionError.message
      );

      setDismissedKey(currentKey);

      Alert.alert(
        'UberCloneDriver',
        t('requests.unavailable')
      );
    } finally {
      actionInProgress.current = false;
      setProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isBusy && requestKey) {
          setDismissedKey(requestKey);
        }
      }}
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
              {t('requests.origin')}:{' '}
              {trip.origin?.address || '-'}
            </Text>

            <Text style={styles.info}>
              {t('requests.destination')}:{' '}
              {trip.destination?.address || '-'}
            </Text>

            <Text style={styles.info}>
              {t('requests.category')}:{' '}
              {t(`vehicle.${trip.category}`)}
            </Text>

            <Text style={styles.info}>
              {t('requests.payment')}:{' '}
              {t(`requests.payment_${trip.paymentMethod}`)}
            </Text>

            {loading || (!estimate && !estimateError) ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.info}>
                  {text.calculating}
                </Text>
              </View>
            ) : estimateError ? (
              <View style={styles.estimateBox}>
                <Text style={styles.error}>
                  {text.calculationError}
                </Text>

                <Pressable
                  onPress={retry}
                  disabled={isBusy}
                  accessibilityRole="button"
                >
                  <Text style={styles.retryText}>
                    {text.retry}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.estimateBox}>
                <Text style={styles.info}>
                  {t('requests.distance')}:{' '}
                  {estimate.distanceKm.toFixed(1)} km
                </Text>

                <Text style={styles.info}>
                  {t('requests.duration')}:{' '}
                  {Math.round(estimate.durationMin)} min
                </Text>

                <Text style={styles.amount}>
                  {t('requests.fare')}:{' '}
                  {money(estimate.fare)}
                </Text>

                <Text style={styles.amount}>
                  {t('requests.earnings')}:{' '}
                  {money(estimate.driverEarnings)}
                </Text>

                <Text style={styles.caption}>
                  {text.estimated}
                </Text>
              </View>
            )}

            {error === 'listenError' && (
              <Text style={styles.error}>
                {t(`requests.${error}`)}
              </Text>
            )}

            <View style={styles.actions}>
              <Pressable
                style={styles.secondary}
                disabled={isBusy}
                onPress={() => handleAction(onReject)}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryText}>
                  {t('requests.reject')}
                </Text>
              </Pressable>

              <Pressable
                style={styles.primary}
                disabled={
                  isBusy ||
                  secondsLeft === 0 ||
                  !estimate ||
                  loading
                }
                onPress={() => handleAction(onAccept)}
                accessibilityRole="button"
              >
                {isBusy ? (
                  <ActivityIndicator
                    color={colors.onPrimary}
                  />
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
  caption: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  estimateBox: {
    gap: spacing.sm,
  },
  retryText: {
    color: colors.primary,
    fontWeight: '700',
  },
  error: {
    color: colors.error,
    fontSize: 13,
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
