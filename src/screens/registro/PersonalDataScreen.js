import { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { RegistrationContext } from '../../context/RegistrationContext';
import { LanguageContext } from '../../context/LanguageContext';

import TextField from '../../components/TextField';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';

import { colors, spacing, radius, typography } from '../../theme';

export default function PersonalDataScreen({ navigation }) {
  const registration = useContext(RegistrationContext);
  const languageContext = useContext(LanguageContext);

  if (!registration) {
    throw new Error('PersonalDataScreen requiere RegistrationProvider');
  }

  if (!languageContext) {
    throw new Error('PersonalDataScreen requiere LanguageProvider');
  }

  const {
    personalData,
    updatePersonal,
    touchPersonal,
    touchAllPersonal,
    personalErrors,
    isPersonalValid,
  } = registration;

  const { language, setLanguage, t } = languageContext;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deviceError, setDeviceError] = useState('');
  const [message, setMessage] = useState('');

  // Mantener sincronizado el idioma global con el idioma del registro.
  useEffect(() => {
    if (personalData.language !== language) {
      updatePersonal('language', language);
    }
  }, [language]);

  const genderOptions = [
    { label: t('personal.female'), value: 'female' },
    { label: t('personal.male'), value: 'male' },
    { label: t('personal.other'), value: 'other' },
  ];

  const languageOptions = [
    { label: t('personal.spanish'), value: 'es' },
    { label: t('personal.english'), value: 'en' },
  ];

  const translateError = (error) => {
    if (!error) return '';

    const translated = t(`errors.${error}`);

    return translated === `errors.${error}` ? error : translated;
  };

  const updateField = (field, value) => {
    updatePersonal(field, value);
    setMessage('');

    if (field === 'language') {
      setLanguage(value);
    }
  };

  const selectPhoto = async (source) => {
    touchPersonal('photo');
    setDeviceError('');

    try {
      let result;

      if (source === 'camera') {
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          setDeviceError(t('personal.cameraPermission'));
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets?.[0]?.uri) {
        updateField('photo', result.assets[0].uri);
      }
    } catch {
      setDeviceError(t('personal.photoError'));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      updateField('birthDate', selectedDate);
      touchPersonal('birthDate');
    }
  };

  const handleValidate = () => {
    touchAllPersonal();

    if (isPersonalValid) {
      setMessage('');
      navigation.navigate('VehicleData');
    } else {
      setMessage('');
    }
  };

  const formattedDate = personalData.birthDate
    ? personalData.birthDate.toLocaleDateString(
        language === 'en' ? 'en-US' : 'es-CO',
      )
    : t('personal.selectDate');

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            {t('personal.title')}
          </Text>

          <Text style={styles.subtitle}>
            {t('personal.subtitle')}
          </Text>

          <Text style={styles.label}>
            {t('personal.profilePhoto')} *
          </Text>

          <View style={styles.photoContainer}>
            {personalData.photo ? (
              <Image
                source={{ uri: personalData.photo }}
                style={styles.photo}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>👤</Text>
              </View>
            )}
          </View>

          <View style={styles.photoActions}>
            <Pressable
              style={styles.photoButton}
              onPress={() => selectPhoto('gallery')}
            >
              <Text style={styles.photoButtonText}>
                {t('personal.gallery')}
              </Text>
            </Pressable>

            <Pressable
              style={styles.photoButton}
              onPress={() => selectPhoto('camera')}
            >
              <Text style={styles.photoButtonText}>
                {t('personal.camera')}
              </Text>
            </Pressable>
          </View>

          {!!personalErrors.photo && (
            <Text style={styles.error}>
              {translateError(personalErrors.photo)}
            </Text>
          )}

          {!!deviceError && (
            <Text style={styles.error}>{deviceError}</Text>
          )}

          <View style={styles.photoSpacing} />

          <TextField
            label={`${t('personal.fullName')} *`}
            placeholder={t('personal.fullNamePlaceholder')}
            value={personalData.fullName}
            onChangeText={(text) => updateField('fullName', text)}
            onBlur={() => touchPersonal('fullName')}
            error={translateError(personalErrors.fullName)}
            maxLength={50}
            autoCapitalize="words"
          />

          <TextField
            label={`${t('personal.documentNumber')} *`}
            placeholder={t('personal.documentPlaceholder')}
            value={personalData.documentNumber}
            onChangeText={(text) =>
              updateField(
                'documentNumber',
                text.replace(/\D/g, ''),
              )
            }
            onBlur={() => touchPersonal('documentNumber')}
            error={translateError(personalErrors.documentNumber)}
            keyboardType="number-pad"
            maxLength={10}
          />

          <TextField
            label={`${t('personal.phone')} *`}
            placeholder="3001234567"
            value={personalData.phone}
            onChangeText={(text) =>
              updateField('phone', text.replace(/\D/g, ''))
            }
            onBlur={() => touchPersonal('phone')}
            error={translateError(personalErrors.phone)}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <View style={styles.field}>
            <Text style={styles.label}>
              {t('personal.birthDate')} *
            </Text>

            <Pressable
              accessibilityRole="button"
              style={[
                styles.select,
                personalErrors.birthDate && styles.invalid,
              ]}
              onPress={() => {
                touchPersonal('birthDate');
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.inputText}>{formattedDate}</Text>
              <Text>📅</Text>
            </Pressable>

            {showDatePicker && (
              <View>
                <DateTimePicker
                  value={personalData.birthDate || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  locale={language === 'en' ? 'en-US' : 'es-CO'}
                  themeVariant="dark"
                  textColor={colors.text}
                  onChange={handleDateChange}
                />

                {Platform.OS === 'ios' && (
                  <Pressable
                    style={styles.dateDone}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.photoButtonText}>
                      {t('personal.done')}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {!!personalErrors.birthDate && (
              <Text style={styles.error}>
                {translateError(personalErrors.birthDate)}
              </Text>
            )}
          </View>

          <Dropdown
            label={`${t('personal.gender')} *`}
            value={personalData.gender}
            options={genderOptions}
            onChange={(value) => updateField('gender', value)}
            onTouch={() => touchPersonal('gender')}
            error={translateError(personalErrors.gender)}
          />

          <TextField
            label={`${t('personal.email')} *`}
            placeholder={t('personal.emailPlaceholder')}
            value={personalData.email}
            onChangeText={(text) => updateField('email', text)}
            onBlur={() => touchPersonal('email')}
            error={translateError(personalErrors.email)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Dropdown
            label={`${t('personal.language')} *`}
            value={language}
            options={languageOptions}
            onChange={(value) => updateField('language', value)}
            onTouch={() => touchPersonal('language')}
            error={translateError(personalErrors.language)}
          />

          <Button
            title={t('common.continue')}
            onPress={handleValidate}
          />

          {!!message && (
            <Text style={styles.success} accessibilityLiveRegion="polite">
              {message}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  select: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  invalid: {
    borderColor: colors.error,
  },
  inputText: {
    ...typography.body,
    color: colors.text,
  },
  error: {
    ...typography.error,
    color: colors.error,
    marginTop: spacing.xs,
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoIcon: {
    fontSize: 48,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photoButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  photoButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  photoSpacing: {
    marginBottom: spacing.lg,
  },
  dateDone: {
    alignSelf: 'flex-end',
    padding: spacing.md,
  },
  success: {
    color: colors.success,
    marginTop: spacing.md,
    textAlign: 'center',
    fontWeight: '600',
  },
});
