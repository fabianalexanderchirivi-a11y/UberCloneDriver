
// AI-assisted: see docs/AI_LOG.md #205, #207

import { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

import { auth, db } from '../config/firebase';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import {
  validatePhone,
  validateLicenseNumber,
  validateExpiryDate,
} from '../utils/validations';
import { LanguageContext } from '../context/LanguageContext';
import { colors, spacing, radius } from '../theme';

const PHOTO_FIELDS = [
  {
    key: 'profilePhoto',
    label: 'Foto de perfil',
    path: 'personalData.photo',
    folder: 'personal',
  },
  {
    key: 'vehiclePhoto',
    label: 'Fotografía del vehículo',
    path: 'vehicleData.vehiclePhoto',
    folder: 'vehicles',
  },
  {
    key: 'licensePhoto',
    label: 'Licencia de conducción',
    path: 'documentsData.licensePhoto',
    folder: 'documents/license',
  },
  {
    key: 'soatPhoto',
    label: 'SOAT',
    path: 'documentsData.soatPhoto',
    folder: 'documents/soat',
  },
  {
    key: 'technicalReviewPhoto',
    label: 'Revisión técnico-mecánica',
    path: 'documentsData.technicalReviewPhoto',
    folder: 'documents/technical-review',
  },
];

const DATE_FIELDS = [
  { key: 'licenseExpiry', label: 'Vencimiento de licencia' },
  { key: 'soatExpiry', label: 'Vencimiento del SOAT' },
  {
    key: 'technicalReviewExpiry',
    label: 'Vencimiento técnico-mecánica',
  },
];

const parseDate = (value) => {
  if (!value) return null;

  const date =
    typeof value?.toDate === 'function'
      ? value.toDate()
      : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const minimumDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(12, 0, 0, 0);
  return date;
};

const makeDraft = (data) => ({
  phone: data.personalData?.phone ?? '',
  licenseNumber: data.documentsData?.licenseNumber ?? '',
  licenseExpiry: parseDate(data.documentsData?.licenseExpiry),
  soatExpiry: parseDate(data.documentsData?.soatExpiry),
  technicalReviewExpiry: parseDate(
    data.documentsData?.technicalReviewExpiry
  ),
  profilePhoto: data.personalData?.photo ?? null,
  vehiclePhoto: data.vehicleData?.vehiclePhoto ?? null,
  licensePhoto: data.documentsData?.licensePhoto ?? null,
  soatPhoto: data.documentsData?.soatPhoto ?? null,
  technicalReviewPhoto:
    data.documentsData?.technicalReviewPhoto ?? null,
});

function Section({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Detail({ label, value }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.detailValue}>{value || '-'}</Text>
    </View>
  );
}

export default function DriverProfileScreen({ navigation }) {
  const { language } = useContext(LanguageContext);
  const en = language === 'en';

  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(null);
  const [changedPhotos, setChangedPhotos] = useState({});
  const [changedDates, setChangedDates] = useState({});
  const [activeDate, setActiveDate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dirtyRef = useRef(false);
  const scrollRef = useRef(null);
  const focusedInput = useRef(null);
  const scrollTimer = useRef(null);

  const setDirtyState = (value) => {
    dirtyRef.current = value;
    setDirty(value);
  };

  // Desplazar el campo activo por encima del teclado.
  const scrollToFocusedInput = () => {
    if (!focusedInput.current) return;

    scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(
      focusedInput.current,
      140,
      true
    );
  };

  const handleInputFocus = (event) => {
    focusedInput.current = event.target;

    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      scrollToFocusedInput();
    }, 250);
  };

  useEffect(() => {
    const subscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (scrollTimer.current) {
          clearTimeout(scrollTimer.current);
        }

        scrollTimer.current = setTimeout(() => {
          scrollToFocusedInput();
        }, 100);
      }
    );

    return () => {
      subscription.remove();

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  // Recuperar perfil desde Firestore.
  useEffect(() => {
    const uid = auth.currentUser?.uid;

    if (!uid) {
      setLoading(false);
      return;
    }

    return onSnapshot(
      doc(db, 'driverRegistrations', uid),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();

          setProfile(data);

          if (!dirtyRef.current) {
            setDraft(makeDraft(data));
          }
        }

        setLoading(false);
      },
      (error) => {
        console.error('Profile listener:', error.message);
        setLoading(false);
        Alert.alert('Error', 'No se pudo cargar el perfil.');
      }
    );
  }, []);

  const changeField = (key, value) => {
    setDraft((previous) => ({
      ...previous,
      [key]: value,
    }));

    setDirtyState(true);
  };

  // Cámara y galería.
  const selectPhoto = async (key, source) => {
    if (saving) return;

    try {
      const permission =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permiso necesario',
          'Debes permitir acceso a cámara o galería.'
        );
        return;
      }

      const options = {
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      };

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      const uri = result.assets?.[0]?.uri;

      if (result.canceled || !uri) return;

      changeField(key, uri);

      setChangedPhotos((previous) => ({
        ...previous,
        [key]: true,
      }));
    } catch (error) {
      console.error('Photo picker:', error.message);
      Alert.alert('Error', 'No se pudo seleccionar la fotografía.');
    }
  };

  const selectDate = (key, date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return;
    }

    changeField(key, date);

    setChangedDates((previous) => ({
      ...previous,
      [key]: true,
    }));
  };

  // Guardar solamente campos realmente modificados.
  const saveProfile = async () => {
    if (!draft || !profile || saving) return;

    const uid = auth.currentUser?.uid;

    if (!uid) {
      Alert.alert('Error', 'Debes iniciar sesión nuevamente.');
      return;
    }

    const technicalRequired =
      profile.documentsData?.technicalReviewRequired === true;

    if (
      draft.phone !== profile.personalData?.phone &&
      validatePhone(draft.phone)
    ) {
      Alert.alert(
        'Celular inválido',
        'El teléfono debe tener exactamente 10 dígitos.'
      );
      return;
    }

    if (
      draft.licenseNumber !== profile.documentsData?.licenseNumber &&
      validateLicenseNumber(draft.licenseNumber)
    ) {
      Alert.alert(
        'Licencia inválida',
        'El número debe tener entre 6 y 15 dígitos.'
      );
      return;
    }

    for (const field of DATE_FIELDS) {
      if (!changedDates[field.key]) continue;

      if (
        field.key === 'technicalReviewExpiry' &&
        !technicalRequired
      ) {
        continue;
      }

      if (validateExpiryDate(draft[field.key])) {
        Alert.alert(
          'Fecha inválida',
          `${field.label} debe ser posterior a hoy.`
        );
        return;
      }
    }

    const requiredPhotos = [
      'profilePhoto',
      'vehiclePhoto',
      'licensePhoto',
      'soatPhoto',
      ...(technicalRequired ? ['technicalReviewPhoto'] : []),
    ];

    if (requiredPhotos.some((key) => !draft[key])) {
      Alert.alert(
        'Fotografías incompletas',
        'Debes conservar las fotografías obligatorias.'
      );
      return;
    }

    setSaving(true);
    Keyboard.dismiss();

    try {
      const updates = {};

      if (draft.phone !== profile.personalData?.phone) {
        updates['personalData.phone'] = draft.phone.trim();
      }

      if (
        draft.licenseNumber !==
        profile.documentsData?.licenseNumber
      ) {
        updates['documentsData.licenseNumber'] =
          draft.licenseNumber.trim();
      }

      for (const field of DATE_FIELDS) {
        if (!changedDates[field.key]) continue;

        if (
          field.key === 'technicalReviewExpiry' &&
          !technicalRequired
        ) {
          continue;
        }

        updates[`documentsData.${field.key}`] =
          draft[field.key].toISOString();
      }

      // Subir solamente fotografías nuevas.
      for (const field of PHOTO_FIELDS) {
        if (!changedPhotos[field.key]) continue;

        if (
          field.key === 'technicalReviewPhoto' &&
          !technicalRequired
        ) {
          continue;
        }

        const url = await uploadImageToCloudinary(
          draft[field.key],
          `${uid}/${field.folder}`
        );

        updates[field.path] = url;
      }

      if (!Object.keys(updates).length) {
        setDirtyState(false);
        Alert.alert('Perfil', 'No hay cambios para guardar.');
        return;
      }

      updates.updatedAt = serverTimestamp();

      console.log(
        'Campos que se intentan guardar:',
        Object.keys(updates)
      );

      await updateDoc(
        doc(db, 'driverRegistrations', uid),
        updates
      );

      // Actualizar las fotos locales con las URLs definitivas.
      const nextDraft = { ...draft };

      for (const field of PHOTO_FIELDS) {
        if (updates[field.path]) {
          nextDraft[field.key] = updates[field.path];
        }
      }

      setDraft(nextDraft);
      setProfile((previous) => {
        const next = {
          ...previous,
          personalData: { ...previous.personalData },
          vehicleData: { ...previous.vehicleData },
          documentsData: { ...previous.documentsData },
        };

        for (const [path, value] of Object.entries(updates)) {
          if (path === 'updatedAt') continue;

          const [section, field] = path.split('.');

          if (next[section]) {
            next[section][field] = value;
          }
        }

        return next;
      });

      setChangedPhotos({});
      setChangedDates({});
      setDirtyState(false);

      Alert.alert(
        'Perfil actualizado',
        'Los cambios se guardaron correctamente.'
      );
    } catch (error) {
      console.error(
        'Save profile:',
        error.code || error.message
      );

      Alert.alert(
        'No se pudo guardar',
        error.code === 'permission-denied'
          ? 'Firestore rechazó la actualización del perfil.'
          : 'Revisa tu conexión e inténtalo nuevamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Cambiar contraseña con Firebase Authentication.
  const changePassword = async () => {
    if (passwordBusy) return;

    if (!currentPassword) {
      Alert.alert('Contraseña', 'Ingresa la contraseña actual.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Contraseña',
        'La nueva contraseña debe tener al menos 6 caracteres.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Contraseña', 'Las contraseñas no coinciden.');
      return;
    }

    const user = auth.currentUser;

    if (!user?.email) {
      Alert.alert('Error', 'No se encontró una sesión válida.');
      return;
    }

    setPasswordBusy(true);
    Keyboard.dismiss();

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);

      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña se modificó correctamente.'
      );
    } catch (error) {
      console.error(
        'Change password:',
        error.code || error.message
      );

      Alert.alert(
        'No se pudo cambiar la contraseña',
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
          ? 'La contraseña actual es incorrecta.'
          : 'Revisa los datos e inténtalo nuevamente.'
      );
    } finally {
      setPasswordBusy(false);
    }
  };

  const renderPhoto = (field) => {
    const uri = draft?.[field.key];

    return (
      <View key={field.key} style={styles.field}>
        <Text style={styles.fieldLabel}>{field.label}</Text>

        {uri ? (
          <Image
            source={{ uri }}
            style={styles.photo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.muted}>Sin fotografía</Text>
          </View>
        )}

        <View style={styles.photoButtons}>
          <Pressable
            style={styles.outlineButton}
            disabled={saving}
            onPress={() => selectPhoto(field.key, 'gallery')}
          >
            <Text style={styles.outlineText}>Galería</Text>
          </Pressable>

          <Pressable
            style={styles.outlineButton}
            disabled={saving}
            onPress={() => selectPhoto(field.key, 'camera')}
          >
            <Text style={styles.outlineText}>Cámara</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderDate = (field) => (
    <View key={field.key} style={styles.field}>
      <Text style={styles.fieldLabel}>{field.label}</Text>

      <Pressable
        style={styles.input}
        disabled={saving}
        onPress={() => {
          Keyboard.dismiss();
          setActiveDate(field.key);
        }}
      >
        <Text style={styles.inputText}>
          {draft?.[field.key]
            ? draft[field.key].toLocaleDateString(
                en ? 'en-US' : 'es-CO'
              )
            : 'Seleccionar fecha'}{' '}
          📅
        </Text>
      </Pressable>

      {activeDate === field.key && (
        <DateTimePicker
          value={draft?.[field.key] ?? minimumDate()}
          minimumDate={minimumDate()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              setActiveDate(null);
            }

            if (event.type === 'set' && selectedDate) {
              selectDate(field.key, selectedDate);
            }
          }}
        />
      )}

      {activeDate === field.key && Platform.OS === 'ios' && (
        <Pressable
          style={styles.outlineButton}
          onPress={() => setActiveDate(null)}
        >
          <Text style={styles.outlineText}>Listo</Text>
        </Pressable>
      )}
    </View>
  );

  if (loading || !draft) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.error}>No se encontró el perfil.</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const technicalRequired =
    profile?.documentsData?.technicalReviewRequired === true;

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
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
            {en ? 'My profile' : 'Mi perfil'}
          </Text>

          <Section title="Datos personales">
            <Detail
              label="Nombre"
              value={profile.personalData?.fullName}
            />
            <Detail
              label="Correo electrónico"
              value={profile.personalData?.email}
            />

            {renderPhoto(PHOTO_FIELDS[0])}

            <Text style={styles.fieldLabel}>Número de celular</Text>

            <TextInput
              style={styles.input}
              value={draft.phone}
              onFocus={handleInputFocus}
              onChangeText={(value) =>
                changeField(
                  'phone',
                  value.replace(/\D/g, '').slice(0, 10)
                )
              }
              keyboardType="phone-pad"
              maxLength={10}
              editable={!saving}
              placeholder="3001234567"
              placeholderTextColor={colors.textSecondary}
            />
          </Section>

          <Section title="Vehículo">
            <Detail
              label="Categoría"
              value={profile.vehicleData?.category}
            />
            <Detail
              label="Placa"
              value={profile.vehicleData?.plate}
            />
            <Detail
              label="Marca"
              value={profile.vehicleData?.brand}
            />
            <Detail
              label="Modelo"
              value={profile.vehicleData?.model}
            />

            {renderPhoto(PHOTO_FIELDS[1])}
          </Section>

          <Section title="Documentos">
            <Text style={styles.fieldLabel}>Número de licencia</Text>

            <TextInput
              style={styles.input}
              value={draft.licenseNumber}
              onFocus={handleInputFocus}
              onChangeText={(value) =>
                changeField(
                  'licenseNumber',
                  value.replace(/\D/g, '').slice(0, 15)
                )
              }
              keyboardType="number-pad"
              maxLength={15}
              editable={!saving}
            />

            {renderPhoto(PHOTO_FIELDS[2])}
            {renderDate(DATE_FIELDS[0])}

            <View style={styles.divider} />

            {renderPhoto(PHOTO_FIELDS[3])}
            {renderDate(DATE_FIELDS[1])}

            {technicalRequired && (
              <>
                <View style={styles.divider} />
                {renderPhoto(PHOTO_FIELDS[4])}
                {renderDate(DATE_FIELDS[2])}
              </>
            )}
          </Section>

          <Pressable
            style={[
              styles.primaryButton,
              (!dirty || saving) && styles.disabled,
            ]}
            disabled={!dirty || saving}
            onPress={saveProfile}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryText}>
                Guardar cambios del perfil
              </Text>
            )}
          </Pressable>

          <Section title="Seguridad de la cuenta">
            <Pressable
              style={styles.outlineButton}
              disabled={passwordBusy}
              onPress={() => {
                Keyboard.dismiss();
                setChangingPassword((previous) => !previous);
              }}
            >
              <Text style={styles.outlineText}>
                {changingPassword
                  ? 'Cancelar cambio de contraseña'
                  : 'Cambiar contraseña'}
              </Text>
            </Pressable>

            {changingPassword && (
              <>
                <Text style={styles.fieldLabel}>
                  Contraseña actual
                </Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onFocus={handleInputFocus}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!passwordBusy}
                />

                <Text style={styles.fieldLabel}>
                  Nueva contraseña
                </Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onFocus={handleInputFocus}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!passwordBusy}
                />

                <Text style={styles.fieldLabel}>
                  Confirmar contraseña nueva
                </Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onFocus={handleInputFocus}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!passwordBusy}
                />

                <Pressable
                  style={[
                    styles.primaryButton,
                    passwordBusy && styles.disabled,
                  ]}
                  disabled={passwordBusy}
                  onPress={changePassword}
                >
                  {passwordBusy ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryText}>
                      Actualizar contraseña
                    </Text>
                  )}
                </Pressable>
              </>
            )}
          </Section>

          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Earnings')}
          >
            <Text style={styles.primaryText}>
              Ver mis ganancias
            </Text>
          </Pressable>

          <Pressable
            style={styles.outlineButton}
            onPress={() => navigation.navigate('TripHistory')}
          >
            <Text style={styles.outlineText}>
              Ver historial de viajes
            </Text>
          </Pressable>

          <Text style={styles.note}>
            Los cambios de documentos oficiales pueden requerir
            revisión administrativa.
          </Text>
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
  keyboardArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: 260,
    gap: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
  },
  detail: {
    gap: spacing.xs,
  },
  detailValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  muted: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  field: {
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    color: colors.text,
    justifyContent: 'center',
  },
  inputText: {
    color: colors.text,
    fontSize: 15,
  },
  photo: {
    width: '100%',
    height: 185,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  photoPlaceholder: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: colors.error,
  },
  note: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
  },
});
