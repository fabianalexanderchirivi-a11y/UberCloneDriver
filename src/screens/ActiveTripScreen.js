
// AI-assisted: see docs/AI_LOG.md #120, #143

import { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, onSnapshot } from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import { LanguageContext } from '../context/LanguageContext';
import { colors, spacing, radius, typography } from '../theme';

export default function ActiveTripScreen({ route }) {
  const { t } = useContext(LanguageContext);

  const tripId = route.params?.tripId;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const renderField = (label, value) => (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value ?? '-'}
      </Text>
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

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {t('requests.activeTrip')}
        </Text>

        <View style={styles.card}>
          {renderField(
            t('requests.status'),
            t(`requests.status_${trip.status}`)
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
            `${trip.distanceKm} km`
          )}

          {renderField(
            t('requests.duration'),
            `${trip.durationMin} min`
          )}
        </View>

        <Text style={styles.notice}>
          {t('requests.routePending')}
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
  notice: {
    color: colors.warning,
    fontSize: 14,
  },
  error: {
    color: colors.error,
  },
});
