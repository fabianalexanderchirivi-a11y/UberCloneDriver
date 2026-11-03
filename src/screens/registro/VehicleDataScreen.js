
import { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { RegistrationContext } from '../../context/RegistrationContext';
import Dropdown from '../../components/Dropdown';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors, spacing, radius, typography } from '../../theme';
import { t } from '../../i18n';

export default function VehicleDataScreen({ navigation }) {
  const registration = useContext(RegistrationContext);

  if (!registration) {
    throw new Error(
      'VehicleDataScreen debe estar dentro de RegistrationProvider',
    );
  }

  const {
    vehicleData,
    updateVehicle,
    touchVehicle,
    touchAllVehicle,
    vehicleErrors,
    isVehicleValid,
  } = registration;

  const [photoLoading, setPhotoLoading] = useState(false);

  const categoryOptions = [
    { value: 'economy', label: 'Económico' },
    { value: 'xl', label: 'XL' },
    { value: 'premium', label: 'Premium' },
  ];

  const colorOptions = [
    { value: 'white', label: 'Blanco' },
    { value: 'black', label: 'Negro' },
    { value: 'gray', label: 'Gris' },
    { value: 'silver', label: 'Plata' },
    { value: 'red', label: 'Rojo' },
    { value: 'blue', label: 'Azul' },
    { value: 'other', label: 'Otro' },
  ];

  const selectVehiclePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permiso necesario',
          'Necesitamos permiso para seleccionar la foto del vehículo.',
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
      Alert.alert('Error', 'No se pudo seleccionar la fotografía.');
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
        'Revisa los datos',
        'Hay campos que necesitan corrección antes de continuar.',
      );
      return;
    }

    navigation.navigate('Password');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Datos del vehículo</Text>

      <Text style={styles.description}>
        Registra la información del vehículo con el que prestarás el servicio.
      </Text>

      <Dropdown
        label="Categoría del servicio"
        value={vehicleData.category}
        options={categoryOptions}
        placeholder="Selecciona una categoría"
        onChange={(value) => updateVehicle('category', value)}
        onTouch={() => touchVehicle('category')}
        error={vehicleErrors.category}
      />

      <TextField
        label="Placa"
        value={vehicleData.plate}
        onChangeText={handlePlateChange}
        onBlur={() => touchVehicle('plate')}
        placeholder="ABC123"
        autoCapitalize="characters"
        maxLength={6}
        error={vehicleErrors.plate}
      />

      <TextField
        label="Marca"
        value={vehicleData.brand}
        onChangeText={(value) => updateVehicle('brand', value)}
        onBlur={() => touchVehicle('brand')}
        placeholder="Ej. Chevrolet"
        maxLength={30}
        error={vehicleErrors.brand}
      />

      <TextField
        label="Modelo"
        value={vehicleData.model}
        onChangeText={(value) => updateVehicle('model', value)}
        onBlur={() => touchVehicle('model')}
        placeholder="Ej. Onix"
        maxLength={30}
        error={vehicleErrors.model}
      />

      <TextField
        label="Año"
        value={vehicleData.year}
        onChangeText={handleYearChange}
        onBlur={() => touchVehicle('year')}
        placeholder="Ej. 2022"
        keyboardType="number-pad"
        maxLength={4}
        error={vehicleErrors.year}
      />

      <Dropdown
        label="Color"
        value={vehicleData.color}
        options={colorOptions}
        placeholder="Selecciona un color"
        onChange={(value) => updateVehicle('color', value)}
        onTouch={() => touchVehicle('color')}
        error={vehicleErrors.color}
      />

      <TextField
        label="Capacidad de pasajeros"
        value={vehicleData.capacity}
        onChangeText={handleCapacityChange}
        onBlur={() => touchVehicle('capacity')}
        placeholder="Ej. 4"
        keyboardType="number-pad"
        error={vehicleErrors.capacity}
      />

      <View style={styles.photoSection}>
        <Text style={styles.label}>Foto del vehículo</Text>

        <Text style={styles.photoDescription}>
          Selecciona una fotografía donde se pueda ver claramente la placa.
        </Text>

        {vehicleData.vehiclePhoto ? (
          <Image
            source={{ uri: vehicleData.vehiclePhoto }}
            style={styles.vehiclePhoto}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>
              No has seleccionado una fotografía
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
              ? 'Cargando...'
              : vehicleData.vehiclePhoto
                ? 'Cambiar fotografía'
                : 'Seleccionar fotografía'}
          </Text>
        </Pressable>

        {!!vehicleErrors.vehiclePhoto && (
          <Text style={styles.error}>
            {t.errors[vehicleErrors.vehiclePhoto] ??
              vehicleErrors.vehiclePhoto}
          </Text>
        )}
      </View>

      <Button
        title="Continuar"
        onPress={handleContinue}
        disabled={photoLoading}
      />
    </ScrollView>
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
