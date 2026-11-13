import { useContext, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, StyleSheet, Alert, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { RegistrationContext } from '../../context/RegistrationContext';
import { LanguageContext } from '../../context/LanguageContext';
import Dropdown from '../../components/Dropdown';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors, spacing, radius, typography } from '../../theme';

export default function VehicleDataScreen({ navigation }) {
  const registration = useContext(RegistrationContext);
  const languageContext = useContext(LanguageContext);

  if (!registration) {
    throw new Error(
      'VehicleDataScreen debe estar dentro de RegistrationProvider',
    );
  }

  if (!languageContext) {
    throw new Error(
      'VehicleDataScreen debe estar dentro de LanguageProvider',
    );
  }

  const { t } = languageContext;

  const {
    vehicleData,
    updateVehicle,
    touchVehicle,
    touchAllVehicle,
    vehicleErrors,
    isVehicleValid,
  } = registration;

  const [photoLoading, setPhotoLoading] = useState(false);

  const translateError = (error) => {
    if (!error) return '';

    const translated = t(`errors.${error}`);

    return translated === `errors.${error}` ? error : translated;
  };

  const categoryOptions = [
    { value: 'economy', label: t('vehicle.economy') },
    { value: 'xl', label: t('vehicle.xl') },
    { value: 'premium', label: t('vehicle.premium') },
  ];

  const colorOptions = [
    { value: 'white', label: t('vehicle.white') },
    { value: 'black', label: t('vehicle.black') },
    { value: 'gray', label: t('vehicle.gray') },
    { value: 'silver', label: t('vehicle.silver') },
    { value: 'red', label: t('vehicle.red') },
    { value: 'blue', label: t('vehicle.blue') },
    { value: 'other', label: t('vehicle.other') },
  ];

  const selectVehiclePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          t('vehicle.permissionTitle'),
          t('vehicle.permissionMessage'),
        );
        return;
      }

      setPhotoLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        updateVehicle('vehiclePhoto', result.assets[0].uri);
        touchVehicle('vehiclePhoto');
      }
    } catch {
      Alert.alert(
        t('vehicle.errorTitle'),
        t('vehicle.photoError'),
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePlateChange = (value) => {
    updateVehicle(
      'plate',
      value.toUpperCase().replace(/\s/g, '').slice(0, 6),
    );
  };

  const handleYearChange = (value) => {
    updateVehicle('year', value.replace(/\D/g, '').slice(0, 4));
  };

  const handleCapacityChange = (value) => {
    updateVehicle('capacity', value.replace(/\D/g, ''));
  };

  const handleContinue = () => {
    touchAllVehicle();

    if (!isVehicleValid) {
      Alert.alert(
        t('vehicle.reviewTitle'),
        t('vehicle.reviewMessage'),
      );
      return;
    }

    navigation.navigate('DocumentsData');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >

        <Text style={styles.description}>
          {t('vehicle.description')}
        </Text>

        <Dropdown
          label={t('vehicle.category')}
          value={vehicleData.category}
          options={categoryOptions}
          placeholder={t('vehicle.categoryPlaceholder')}
          onChange={(value) => updateVehicle('category', value)}
          onTouch={() => touchVehicle('category')}
          error={translateError(vehicleErrors.category)}
        />

        <TextField
          label={t('vehicle.plate')}
          value={vehicleData.plate}
          onChangeText={handlePlateChange}
          onBlur={() => touchVehicle('plate')}
          placeholder="ABC123"
          autoCapitalize="characters"
          maxLength={6}
          error={translateError(vehicleErrors.plate)}
        />

        <TextField
          label={t('vehicle.brand')}
          value={vehicleData.brand}
          onChangeText={(value) => updateVehicle('brand', value)}
          onBlur={() => touchVehicle('brand')}
          placeholder={t('vehicle.brandPlaceholder')}
          maxLength={30}
          error={translateError(vehicleErrors.brand)}
        />

        <TextField
          label={t('vehicle.model')}
          value={vehicleData.model}
          onChangeText={(value) => updateVehicle('model', value)}
          onBlur={() => touchVehicle('model')}
          placeholder={t('vehicle.modelPlaceholder')}
          maxLength={30}
          error={translateError(vehicleErrors.model)}
        />

        <TextField
          label={t('vehicle.year')}
          value={vehicleData.year}
          onChangeText={handleYearChange}
          onBlur={() => touchVehicle('year')}
          placeholder={t('vehicle.yearPlaceholder')}
          keyboardType="number-pad"
          maxLength={4}
          error={translateError(vehicleErrors.year)}
        />

        <Dropdown
          label={t('vehicle.color')}
          value={vehicleData.color}
          options={colorOptions}
          placeholder={t('vehicle.colorPlaceholder')}
          onChange={(value) => updateVehicle('color', value)}
          onTouch={() => touchVehicle('color')}
          error={translateError(vehicleErrors.color)}
        />

        <TextField
          label={t('vehicle.capacity')}
          value={vehicleData.capacity}
          onChangeText={handleCapacityChange}
          onBlur={() => touchVehicle('capacity')}
          placeholder={t('vehicle.capacityPlaceholder')}
          keyboardType="number-pad"
          error={translateError(vehicleErrors.capacity)}
        />

        <View style={styles.photoSection}>
          <Text style={styles.label}>
            {t('vehicle.photo')}
          </Text>

          <Text style={styles.photoDescription}>
            {t('vehicle.photoDescription')}
          </Text>

          {vehicleData.vehiclePhoto ? (
            <Image
              source={{ uri: vehicleData.vehiclePhoto }}
              style={styles.vehiclePhoto}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {t('vehicle.noPhoto')}
              </Text>
            </View>
          )}

          <Pressable
            style={styles.photoButton}
            onPress={selectVehiclePhoto}
            disabled={photoLoading}
          >
            <Text style={styles.photoButtonText}>
              {photoLoading
                ? t('vehicle.loading')
                : vehicleData.vehiclePhoto
                  ? t('vehicle.changePhoto')
                  : t('vehicle.selectPhoto')}
            </Text>
          </Pressable>

          {!!vehicleErrors.vehiclePhoto && (
            <Text style={styles.error}>
              {translateError(vehicleErrors.vehiclePhoto)}
            </Text>
          )}
        </View>

        <Button
          title={t('common.continue')}
          onPress={handleContinue}
          disabled={photoLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  photoSection: {
    marginBottom: spacing.xl,
  },
  photoDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  vehiclePhoto: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  photoPlaceholder: {
    height: 150,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  photoPlaceholderText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  photoButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  photoButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  error: {
    ...typography.error,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
