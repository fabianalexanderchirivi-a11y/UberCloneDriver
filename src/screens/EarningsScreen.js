
// AI-assisted: see docs/AI_LOG.md #209

import { useContext, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import useEarnings from '../hooks/useEarnings';
import { LanguageContext } from '../context/LanguageContext';

import {
  colors,
  spacing,
  radius,
  typography,
} from '../theme';

const money = (value) =>
  `$${Math.round(value).toLocaleString('es-CO')} COP`;

const WORDS = {
  es: {
    title: 'Mis ganancias',
    day: 'Hoy',
    week: 'Semana',
    month: 'Mes',
    net: 'Ganancia neta',
    trips: 'Viajes pagados',
    billed: 'Total facturado',
    commissions: 'Comisiones',
    tips: 'Propinas',
    average: 'Promedio por viaje',
    balance: 'Saldo del conductor',
    cashDebt: 'Comisiones de efectivo',
    balanceDescription:
      'Ganancias de pagos electrónicos menos comisiones de viajes en efectivo.',
    loading: 'Cargando ganancias...',
    error: 'No se pudieron cargar las ganancias.',
    empty: 'No tienes viajes pagados en este período.',
    history: 'Ver historial de viajes',
    negative:
      'Tu saldo es negativo porque debes comisiones de viajes en efectivo.',
  },

  en: {
    title: 'My earnings',
    day: 'Today',
    week: 'Week',
    month: 'Month',
    net: 'Net earnings',
    trips: 'Paid trips',
    billed: 'Total billed',
    commissions: 'Commissions',
    tips: 'Tips',
    average: 'Average per trip',
    balance: 'Driver balance',
    cashDebt: 'Cash commissions',
    balanceDescription:
      'Electronic payment earnings minus commissions from cash trips.',
    loading: 'Loading earnings...',
    error: 'Unable to load earnings.',
    empty: 'No paid trips in this period.',
    history: 'View trip history',
    negative:
      'Your balance is negative due to outstanding cash commissions.',
  },
};

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function EarningsScreen({ navigation }) {
  const { language } = useContext(LanguageContext);
  const labels = WORDS[language] ?? WORDS.es;

  const [period, setPeriod] = useState('day');

  const {
    summary,
    loading,
    error,
  } = useEarnings();

  const totals = summary[period];

  const periods = [
    { id: 'day', label: labels.day },
    { id: 'week', label: labels.week },
    { id: 'month', label: labels.month },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
          <Text style={styles.muted}>{labels.loading}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.error}>{labels.error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{labels.title}</Text>

        <View style={styles.tabs}>
          {periods.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.tab,
                period === item.id && styles.activeTab,
              ]}
              onPress={() => setPeriod(item.id)}
              accessibilityRole="button"
              accessibilityState={{
                selected: period === item.id,
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  period === item.id &&
                    styles.activeTabText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{labels.net}</Text>

          <Text style={styles.heroValue}>
            {money(totals.earnings)}
          </Text>

          <Text style={styles.heroDescription}>
            {totals.count} {labels.trips.toLowerCase()}
          </Text>
        </View>

        <View style={styles.grid}>
          <Metric
            label={labels.billed}
            value={money(totals.fare)}
          />

          <Metric
            label={labels.commissions}
            value={money(totals.commission)}
          />

          <Metric
            label={labels.tips}
            value={money(totals.tips)}
          />

          <Metric
            label={labels.average}
            value={money(totals.average)}
          />
        </View>

        {totals.count === 0 && (
          <Text style={styles.empty}>{labels.empty}</Text>
        )}

        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>
            {labels.balance}
          </Text>

          <Text
            style={[
              styles.balanceValue,
              summary.balance < 0 && styles.negativeValue,
            ]}
          >
            {money(summary.balance)}
          </Text>

          <Text style={styles.muted}>
            {labels.balanceDescription}
          </Text>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.muted}>
              {labels.cashDebt}
            </Text>

            <Text style={styles.debtValue}>
              {money(summary.cashCommissionDebt)}
            </Text>
          </View>

          {summary.balance < 0 && (
            <Text style={styles.warning}>
              {labels.negative}
            </Text>
          )}
        </View>

        <Pressable
          style={styles.historyButton}
          onPress={() =>
            navigation.navigate('TripHistory')
          }
          accessibilityRole="button"
        >
          <Text style={styles.historyButtonText}>
            {labels.history}
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

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },

  title: {
    ...typography.title,
    color: colors.text,
  },

  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  tab: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  tabText: {
    color: colors.textSecondary,
    fontWeight: '700',
  },

  activeTabText: {
    color: colors.onPrimary,
  },

  hero: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },

  heroLabel: {
    color: colors.textSecondary,
    fontSize: 15,
  },

  heroValue: {
    color: colors.success,
    fontSize: 30,
    fontWeight: '800',
  },

  heroDescription: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },

  metric: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
    flexGrow: 1,
  },

  metricLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  metricValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },

  balanceCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },

  balanceTitle: {
    color: colors.textSecondary,
    fontSize: 15,
  },

  balanceValue: {
    color: colors.success,
    fontSize: 27,
    fontWeight: '800',
  },

  negativeValue: {
    color: '#FB7185',
  },

  muted: {
    color: colors.textSecondary,
    fontSize: 13,
    flexShrink: 1,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  debtValue: {
    color: colors.warning,
    fontWeight: '700',
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  warning: {
    color: colors.warning,
    fontSize: 13,
  },

  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
  },

  error: {
    color: colors.error,
  },

  historyButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },

  historyButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
