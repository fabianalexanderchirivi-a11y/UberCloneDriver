
// AI-assisted: see docs/AI_LOG.md #126

import { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, onSnapshot } from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import { LanguageContext } from '../context/LanguageContext';
import { colors, spacing, radius, typography } from '../theme';

export default function DriverProfileScreen() {
  const { t, language } = useContext(LanguageContext);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setError(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'driverRegistrations', user.uid),
      (snapshot) => {
        setRegistration(snapshot.exists() ? snapshot.data() : null);
        setError(!snapshot.exists());
        setLoading(false);
      },
      (snapshotError) => {
        console.error(
          'Error al cargar perfil:',
          snapshotError.code || snapshotError.message
        );
        setError(true);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const personal = registration?.personalData || {};
  const vehicle = registration?.vehicleData || {};
  const documents = registration?.documentsData || {};

  const displayValue = (value) =>
    value === undefined || value === null || value === ''
      ? t('profile.notAvailable')
      : String(value);

  const maskDocument = (value) => {
    if (!value) return t('profile.notAvailable');
    const documentNumber = String(value);
    return `${'*'.repeat(Math.max(0, documentNumber.length - 4))}${documentNumber.slice(-4)}`;
  };

  const formatDate = (value) => {
    if (!value) return t('profile.notAvailable');
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? t('profile.notAvailable')
      : date.toLocaleDateString(language === 'en' ? 'en-US' : 'es-CO');
  };

  const translatedOption = (section, value) => {
    if (!value) return t('profile.notAvailable');
    const key = `${section}.${value}`;
    const translated = t(key);
    return translated === key ? String(value) : translated;
  };

  const renderField = (label, value) => (
    <View style={styles.field} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{displayValue(value)}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !registration) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <View style={styles.center}>
          <Text style={styles.error}>{t('profile.loadError')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {typeof personal.photo === 'string' && personal.photo ? (
            <Image
              source={{ uri: personal.photo }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {personal.fullName?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
          )}

          <Text style={styles.name}>
            {displayValue(personal.fullName)}
          </Text>

          <Text style={styles.status}>
            {translatedOption('home', registration.status)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t('profile.personalSection')}
          </Text>

          {renderField(t('personal.email'), personal.email)}
          {renderField(t('personal.phone'), personal.phone)}
          {renderField(
            t('personal.documentNumber'),
            maskDocument(personal.documentNumber)
          )}
          {renderField(
            t('personal.birthDate'),
            formatDate(personal.birthDate)
          )}
          {renderField(
            t('personal.gender'),
            translatedOption('personal', personal.gender)
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t('profile.vehicleSection')}
          </Text>

          {renderField(
            t('vehicle.category'),
            translatedOption('vehicle', vehicle.category)
          )}
          {renderField(t('vehicle.plate'), vehicle.plate)}
          {renderField(t('vehicle.brand'), vehicle.brand)}
          {renderField(t('vehicle.model'), vehicle.model)}
          {renderField(t('vehicle.year'), vehicle.year)}
          {renderField(
            t('vehicle.color'),
            translatedOption('vehicle', vehicle.color)
          )}
          {renderField(t('vehicle.capacity'), vehicle.capacity)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t('profile.documentsSection')}
          </Text>

          {renderField(
            t('documents.licenseExpiry'),
            formatDate(documents.licenseExpiry)
          )}
          {renderField(
            t('documents.soatExpiry'),
            formatDate(documents.soatExpiry)
          )}

          {documents.technicalReviewRequired && renderField(
            t('documents.technicalExpiry'),
            formatDate(documents.technicalReviewExpiry)
          )}
        </View>

        <Text style={styles.notice}>
          {t('profile.readOnlyNotice')}
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
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.primary,
  },
  name: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    fontSize: 24,
  },
  status: {
    fontWeight: '700',
    color: colors.success,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    color: colors.text,
  },
  notice: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  error: {
    color: colors.error,
    textAlign: 'center',
  },
});
