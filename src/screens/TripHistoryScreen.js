
// AI-assisted: see docs/AI_LOG.md #206

import { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import { LanguageContext } from '../context/LanguageContext';
import { colors, spacing, radius } from '../theme';

const money = (value) =>
  `$${Math.round(value).toLocaleString('es-CO')} COP`;

const toDate = (value) => {
  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  if (value instanceof Date) return value;

  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
};

function startOfPeriod(period) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  if (period === 'week') {
    const day = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - day);
  }

  if (period === 'month') {
    date.setDate(1);
  }

  return date;
}

const WORDS = {
  es: {
    title: 'Historial de viajes',
    today: 'Hoy',
    week: 'Semana',
    month: 'Mes',
    all: 'Todos',
    stripe: 'Stripe',
    cash: 'Efectivo',
    paid: 'Pagado',
    pending: 'Pendiente',
    trips: 'Viajes',
    billed: 'Total facturado',
    earned: 'Ganancia registrada',
    fare: 'Tarifa',
    earnings: 'Ganancia',
    empty: 'No tienes viajes para estos filtros.',
    error: 'No fue posible cargar el historial.',
    loading: 'Cargando viajes...',
    noAddress: 'Ubicación no disponible',
  },
  en: {
    title: 'Trip history',
    today: 'Today',
    week: 'Week',
    month: 'Month',
    all: 'All',
    stripe: 'Stripe',
    cash: 'Cash',
    paid: 'Paid',
    pending: 'Pending',
    trips: 'Trips',
    billed: 'Total billed',
    earned: 'Recorded earnings',
    fare: 'Fare',
    earnings: 'Earnings',
    empty: 'No trips found for these filters.',
    error: 'Unable to load trip history.',
    loading: 'Loading trips...',
    noAddress: 'Address unavailable',
  },
};

function FilterButton({ selected, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filter,
        selected && styles.filterSelected,
      ]}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.filterText,
          selected && styles.filterTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function TripHistoryScreen() {
  const { language } = useContext(LanguageContext);
  const labels = WORDS[language] ?? WORDS.es;

  const [trips, setTrips] = useState([]);
  const [period, setPeriod] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;

    if (!uid) {
      setLoading(false);
      setError(true);
      return;
    }

    const tripQuery = query(
      collection(db, 'trip'),
      where('driverId', '==', uid)
    );

    return onSnapshot(
      tripQuery,
      (snapshot) => {
        const records = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter((trip) =>
            ['completed', 'paid'].includes(trip.status)
          )
          .sort((a, b) => {
            const aDate =
              toDate(a.completedAt) ??
              toDate(a.createdAt);

            const bDate =
              toDate(b.completedAt) ??
              toDate(b.createdAt);

            return (bDate?.getTime() ?? 0) -
              (aDate?.getTime() ?? 0);
          });

        setTrips(records);
        setLoading(false);
        setError(false);
      },
      (snapshotError) => {
        console.error(
          'Trip history:',
          snapshotError.code || snapshotError.message
        );

        setError(true);
        setLoading(false);
      }
    );
  }, []);

  const filteredTrips = useMemo(() => {
    const start =
      period === 'all' ? null : startOfPeriod(period);

    return trips.filter((trip) => {
      const date =
        toDate(trip.completedAt) ??
        toDate(trip.createdAt);

      if (start && (!date || date < start)) {
        return false;
      }

      if (
        paymentFilter !== 'all' &&
        trip.paymentMethod !== paymentFilter
      ) {
        return false;
      }

      return true;
    });
  }, [trips, period, paymentFilter]);

  const totals = useMemo(() => {
    return filteredTrips.reduce(
      (result, trip) => ({
        count: result.count + 1,
        fare:
          result.fare +
          (Number.isFinite(trip.fare) ? trip.fare : 0),
        earnings:
          result.earnings +
          (
            trip.status === 'paid' &&
            Number.isFinite(trip.driverEarnings)
              ? trip.driverEarnings
              : 0
          ),
      }),
      { count: 0, fare: 0, earnings: 0 }
    );
  }, [filteredTrips]);

  const formatTripDate = (trip) => {
    const date =
      toDate(trip.completedAt) ??
      toDate(trip.createdAt);

    return date
      ? date.toLocaleString(
          language === 'en' ? 'en-US' : 'es-CO'
        )
      : '-';
  };

  const renderTrip = ({ item }) => {
    const expanded = expandedId === item.id;
    const paid = item.status === 'paid';

    return (
      <Pressable
        onPress={() =>
          setExpandedId(expanded ? null : item.id)
        }
        style={styles.tripCard}
        accessibilityRole="button"
      >
        <View style={styles.tripTop}>
          <Text style={styles.date}>
            {formatTripDate(item)}
          </Text>

          <Text
            style={[
              styles.status,
              paid ? styles.approved : styles.pending,
            ]}
          >
            {paid ? labels.paid : labels.pending}
          </Text>
        </View>

        <Text style={styles.address}>
          {item.origin?.address || labels.noAddress}
        </Text>

        <Text style={styles.arrow}>↓</Text>

        <Text style={styles.address}>
          {item.destination?.address || labels.noAddress}
        </Text>

        <View style={styles.tripBottom}>
          <Text style={styles.muted}>
            {(item.category || '-').toUpperCase()} ·{' '}
            {item.paymentMethod || '-'}
          </Text>

          <Text style={styles.fare}>
            {Number.isFinite(item.fare)
              ? money(item.fare)
              : '-'}
          </Text>
        </View>

        {expanded && (
          <View style={styles.details}>
            <Text style={styles.detailText}>
              {labels.fare}: {Number.isFinite(item.fare)
                ? money(item.fare)
                : '-'}
            </Text>

            <Text style={styles.detailText}>
              {labels.earnings}: {
                Number.isFinite(item.driverEarnings)
                  ? money(item.driverEarnings)
                  : '-'
              }
            </Text>

            <Text style={styles.detailText}>
              {item.passengerName || '-'}
            </Text>

            <Text style={styles.detailText}>
              {Number.isFinite(item.distanceKm)
                ? `${item.distanceKm.toFixed(1)} km`
                : '-'}
              {' · '}
              {Number.isFinite(item.durationMin)
                ? `${Math.round(item.durationMin)} min`
                : '-'}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['bottom']}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{labels.title}</Text>

        <View style={styles.filterRow}>
          {[
            ['today', labels.today],
            ['week', labels.week],
            ['month', labels.month],
            ['all', labels.all],
          ].map(([key, label]) => (
            <FilterButton
              key={key}
              selected={period === key}
              label={label}
              onPress={() => setPeriod(key)}
            />
          ))}
        </View>

        <View style={styles.filterRow}>
          {[
            ['all', labels.all],
            ['stripe', labels.stripe],
            ['cash', labels.cash],
          ].map(([key, label]) => (
            <FilterButton
              key={key}
              selected={paymentFilter === key}
              label={label}
              onPress={() => setPaymentFilter(key)}
            />
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.muted}>
            {labels.trips}: {totals.count}
          </Text>

          <Text style={styles.muted}>
            {labels.billed}: {money(totals.fare)}
          </Text>

          <Text style={styles.earned}>
            {labels.earned}: {money(totals.earnings)}
          </Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.muted}>{labels.loading}</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.error}>{labels.error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTrips}
            keyExtractor={(item) => item.id}
            renderItem={renderTrip}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>{labels.empty}</Text>
            }
          />
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  filter: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  summary: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  muted: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  earned: {
    color: colors.success,
    fontSize: 15,
    fontWeight: '700',
  },
  list: {
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  tripCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  tripTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
  },
  approved: {
    color: colors.success,
  },
  pending: {
    color: colors.warning,
  },
  address: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  arrow: {
    color: colors.primary,
  },
  tripBottom: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  fare: {
    color: colors.text,
    fontWeight: '700',
  },
  details: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  error: {
    color: colors.error,
  },
});
