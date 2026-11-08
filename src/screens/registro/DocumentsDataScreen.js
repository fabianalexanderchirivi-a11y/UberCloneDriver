import { useContext, useState, useRef, useEffect } from 'react';
import {
  View,
  Text, ScrollView,
  KeyboardAvoidingView,
  Pressable,
  Image,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { RegistrationContext } from '../../context/RegistrationContext';
import { LanguageContext } from '../../context/LanguageContext';
import { requiresTechnicalReview } from '../../utils/validations';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors, spacing, radius, typography } from '../../theme';

export default function DocumentsDataScreen({ navigation }) {
  const registration = useContext(RegistrationContext);
  const languageContext = useContext(LanguageContext);

  const scrollRef = useRef(null);
  const fieldPositions = useRef({});
  const activeField = useRef(null);
  const scrollTimeout = useRef(null);

  const [photoLoading, setPhotoLoading] = useState(false);
  const [activePicker, setActivePicker] = useState(null);
  const [imageError, setImageError] = useState({});

  const {
    vehicleData,
    documentsData,
    updateDocuments,
    touchDocuments,
    touchAllDocuments,
    documentsErrors,
    isDocumentsValid,
  } = registration;

  const { t, language } = languageContext;

  const technicalRequired = requiresTechnicalReview(
    vehicleData.year
  );

  const scrollToField = (field) => {
    const y = fieldPositions.current[field];

    if (typeof y !== 'number') return;

    scrollRef.current?.scrollTo({
      y: Math.max(0, y - 70),
      animated: true,
    });
  };

  const focusField = (field) => {
    activeField.current = field;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    requestAnimationFrame(() => {
      scrollToField(field);
    });

    scrollTimeout.current = setTimeout(() => {
      scrollToField(field);
    }, 300);
  };

  useEffect(() => {
    const keyboardSubscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (activeField.current) {
          scrollToField(activeField.current);

          if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
          }

          scrollTimeout.current = setTimeout(() => {
            if (activeField.current) {
              scrollToField(activeField.current);
            }
          }, 150);
        }
      }
    );

    return () => {
      keyboardSubscription.remove();

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const translateError = (error) => {
    if (!error) return '';

    const translated = t(`errors.${error}`);

    return translated === `errors.${error}`
      ? error
      : translated;
  };

  const updateField = (field, value) => {
    updateDocuments(field, value);
  };

  const selectPhoto = async (field, source) => {
    if (photoLoading) return;

    touchDocuments(field);

    setImageError((previous) => ({
      ...previous,
      [field]: '',
    }));

    try {
      let result;

      setPhotoLoading(true);

      if (source === 'camera') {
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          setImageError((previous) => ({
            ...previous,
            [field]: t('documents.cameraPermission'),
          }));
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          setImageError((previous) => ({
            ...previous,
            [field]: t('documents.galleryPermission'),
          }));
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets?.[0]?.uri) {
        updateField(field, result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar fotografía:', error);

      setImageError((previous) => ({
        ...previous,
        [field]: t('documents.imageError'),
      }));
    } finally {
      setPhotoLoading(false);
    }
  };

  const getMinimumDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(12, 0, 0, 0);

    return date;
  };

  const handleDateChange = (event, selectedDate) => {
    const field = activePicker;

    if (Platform.OS === 'android') {
      setActivePicker(null);
    }

    if (
      event.type === 'set' &&
      selectedDate &&
      field
    ) {
      updateField(field, selectedDate);
      touchDocuments(field);
    }
  };

  const openDatePicker = (field) => {
    activeField.current = null;
    Keyboard.dismiss();
    touchDocuments(field);
    setActivePicker(field);
  };

  const renderPhotoField = (field, label) => {
    const photo = documentsData[field];

    return (
      <View style={styles.field} key={field}>
        <Text style={styles.label}>
          {label} *
        </Text>

        {photo ? (
          <Image
            source={{ uri: photo }}
            style={styles.photo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.placeholderText}>
              {t('documents.noPhoto')}
            </Text>
          </View>
        )}

        <View style={styles.photoActions}>
          <Pressable
            style={styles.photoButton}
            onPress={() => selectPhoto(field, 'gallery')}
            disabled={photoLoading}
          >
            <Text style={styles.photoButtonText}>
              {photo
                ? t('documents.changePhoto')
                : t('documents.gallery')}
            </Text>
          </Pressable>

          <Pressable
            style={styles.photoButton}
            onPress={() => selectPhoto(field, 'camera')}
            disabled={photoLoading}
          >
            <Text style={styles.photoButtonText}>
              {t('documents.camera')}
            </Text>
          </Pressable>
        </View>

        {!!documentsErrors[field] && (
          <Text style={styles.error}>
            {translateError(documentsErrors[field])}
          </Text>
        )}

        {!!imageError[field] && (
          <Text style={styles.error}>
            {imageError[field]}
          </Text>
        )}
      </View>
    );
  };

  const renderDateField = (field, label) => {
    const date = documentsData[field];

    const formattedDate =
      date instanceof Date &&
      !Number.isNaN(date.getTime())
        ? date.toLocaleDateString(
            language === 'en' ? 'en-US' : 'es-CO'
          )
        : t('documents.selectDate');

    return (
      <View style={styles.field} key={field}>
        <Text style={styles.label}>
          {label} *
        </Text>

        <Pressable
          style={[
            styles.dateButton,
            !!documentsErrors[field] && styles.invalid,
          ]}
          onPress={() => openDatePicker(field)}
          accessibilityRole="button"
        >
          <Text style={styles.dateText}>
            {formattedDate}
          </Text>

          <Text style={styles.dateIcon}>
            📅
          </Text>
        </Pressable>

        {activePicker === field && (
          <View>
            <DateTimePicker
              value={
                date instanceof Date &&
                !Number.isNaN(date.getTime())
                  ? date
                  : getMinimumDate()
              }
              mode="date"
              display={
                Platform.OS === 'ios'
                  ? 'spinner'
                  : 'default'
              }
              minimumDate={getMinimumDate()}
              locale={
                language === 'en'
                  ? 'en-US'
                  : 'es-CO'
              }
              themeVariant="dark"
              onChange={handleDateChange}
            />

            {Platform.OS === 'ios' && (
              <Pressable
                style={styles.doneButton}
                onPress={() => {
                  setActivePicker(null);
                  touchDocuments(field);
                }}
              >
                <Text style={styles.photoButtonText}>
                  {t('documents.done')}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {!!documentsErrors[field] && (
          <Text style={styles.error}>
            {translateError(documentsErrors[field])}
          </Text>
        )}
      </View>
    );
  };

  const handleContinue = () => {
    activeField.current = null;
    Keyboard.dismiss();
    touchAllDocuments();

    if (!isDocumentsValid) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
      return;
    }

    navigation.navigate('Password');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        <Text style={styles.title}>
          {t('documents.title')}
        </Text>

        <Text style={styles.description}>
          {t('documents.description')}
        </Text>

        <Text style={styles.sectionTitle}>
          {t('documents.license')}
        </Text>

        <View
          onLayout={(event) => {
            fieldPositions.current.licenseNumber =
              event.nativeEvent.layout.y;
          }}
        >
          <TextField
            label={`${t('documents.licenseNumber')} *`}
            placeholder={t('documents.licensePlaceholder')}
            value={documentsData.licenseNumber}
            onChangeText={(value) =>
              updateField(
                'licenseNumber',
                value.replace(/\D/g, '').slice(0, 15)
              )
            }
            onFocus={() => focusField('licenseNumber')}
            onBlur={() => {
              activeField.current = null;
              touchDocuments('licenseNumber');
            }}
            keyboardType="number-pad"
            maxLength={15}
            error={translateError(
              documentsErrors.licenseNumber
            )}
          />
        </View>

        {renderPhotoField(
          'licensePhoto',
          t('documents.licensePhoto')
        )}

        {renderDateField(
          'licenseExpiry',
          t('documents.licenseExpiry')
        )}

        <Text style={styles.sectionTitle}>
          {t('documents.soat')}
        </Text>

        {renderPhotoField(
          'soatPhoto',
          t('documents.soatPhoto')
        )}

        {renderDateField(
          'soatExpiry',
          t('documents.soatExpiry')
        )}

        <Text style={styles.sectionTitle}>
          {t('documents.technical')}
        </Text>

        <Text style={styles.helper}>
          {technicalRequired
            ? t('documents.technicalRequired')
            : t('documents.technicalNotRequired')}
        </Text>

        {technicalRequired && (
          <>
            {renderPhotoField(
              'technicalReviewPhoto',
              t('documents.technicalPhoto')
            )}

            {renderDateField(
              'technicalReviewExpiry',
              t('documents.technicalExpiry')
            )}
          </>
        )}

        <Text style={styles.sectionTitle}>
          {t('documents.payments')}
        </Text>

        <View
          onLayout={(event) => {
            fieldPositions.current.mercadoPagoEmail =
              event.nativeEvent.layout.y;
          }}
        >
          <TextField
            label={`${t('documents.paymentEmail')} *`}
            placeholder={t('documents.paymentPlaceholder')}
            value={documentsData.mercadoPagoEmail}
            onChangeText={(value) =>
              updateField('mercadoPagoEmail', value)
            }
            onFocus={() =>
              focusField('mercadoPagoEmail')
            }
            onBlur={() => {
              activeField.current = null;
              touchDocuments('mercadoPagoEmail');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={translateError(
              documentsErrors.mercadoPagoEmail
            )}
          />
        </View>

        <Pressable
          style={styles.termsRow}
          onPress={() => {
            activeField.current = null;
            Keyboard.dismiss();

            updateField(
              'acceptedTerms',
              !documentsData.acceptedTerms
            );

            touchDocuments('acceptedTerms');
          }}
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: documentsData.acceptedTerms,
          }}
        >
          <View
            style={[
              styles.checkbox,
              documentsData.acceptedTerms &&
                styles.checkboxChecked,
            ]}
          >
            {documentsData.acceptedTerms && (
              <Text style={styles.checkmark}>
                ✓
              </Text>
            )}
          </View>

          <Text style={styles.termsText}>
            {t('documents.terms')}
          </Text>
        </Pressable>

        <Text style={styles.commission}>
          {t('documents.commission')}
        </Text>

        {!!documentsErrors.acceptedTerms && (
          <Text style={styles.error}>
            {translateError(
              documentsErrors.acceptedTerms
            )}
          </Text>
        )}

        <View style={styles.buttonSpacing}>
          <Button
            title={t('common.continue')}
            onPress={handleContinue}
            disabled={photoLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 320,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 19,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  photo: {
    width: '100%',
    height: 190,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  photoPlaceholder: {
    height: 130,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
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
    textAlign: 'center',
  },
  dateButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    ...typography.body,
    color: colors.text,
  },
  dateIcon: {
    fontSize: 20,
  },
  invalid: {
    borderColor: colors.error,
  },
  doneButton: {
    alignSelf: 'flex-end',
    padding: spacing.md,
  },
  helper: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  error: {
    ...typography.error,
    color: colors.error,
    marginTop: spacing.xs,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  termsText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  commission: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  buttonSpacing: {
    marginTop: spacing.xl,
  },
});
