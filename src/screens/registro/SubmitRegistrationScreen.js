//docs/AI_LOG.md #83
import { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import {
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

import { auth, db } from '../../config/firebase';
import { RegistrationContext } from '../../context/RegistrationContext';
import { requiresTechnicalReview } from '../../utils/validations';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';

export default function SubmitRegistrationScreen({ route, navigation }) {
  const { password } = route.params;

  const {
    personalData,
    vehicleData,
    documentsData,
    isPersonalValid,
    isVehicleValid,
    isDocumentsValid,
  } = useContext(RegistrationContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (
      !isPersonalValid ||
      !isVehicleValid ||
      !isDocumentsValid
    ) {
      Alert.alert(
        'Datos incompletos',
        'Regresa y revisa que todos los datos y documentos sean correctos.',
      );
      return;
    }

    const technicalRequired = requiresTechnicalReview(
      vehicleData.year
    );

    if (
      !personalData.photo ||
      !vehicleData.vehiclePhoto ||
      !documentsData.licensePhoto ||
      !documentsData.soatPhoto ||
      (
        technicalRequired &&
        !documentsData.technicalReviewPhoto
      )
    ) {
      Alert.alert(
        'Faltan fotografías',
        'Debes seleccionar todas las fotografías obligatorias antes de enviar el registro.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const email = personalData.email.trim().toLowerCase();

      let user = auth.currentUser;

      if (
        user &&
        user.email?.toLowerCase() !== email
      ) {
        await signOut(auth);
        user = null;
      }

      if (!user) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        user = credential.user;
      }

      const uid = user.uid;

      const profilePhotoUrl = await uploadImageToCloudinary(
        personalData.photo,
        `${uid}/personal`,
      );

      const vehiclePhotoUrl = await uploadImageToCloudinary(
        vehicleData.vehiclePhoto,
        `${uid}/vehicles`,
      );

      const licensePhotoUrl = await uploadImageToCloudinary(
        documentsData.licensePhoto,
        `${uid}/documents/license`,
      );

      const soatPhotoUrl = await uploadImageToCloudinary(
        documentsData.soatPhoto,
        `${uid}/documents/soat`,
      );

      let technicalReviewPhotoUrl = null;

      if (technicalRequired) {
        technicalReviewPhotoUrl = await uploadImageToCloudinary(
          documentsData.technicalReviewPhoto,
          `${uid}/documents/technical-review`,
        );
      }

      if (
        !profilePhotoUrl ||
        !vehiclePhotoUrl ||
        !licensePhotoUrl ||
        !soatPhotoUrl ||
        (
          technicalRequired &&
          !technicalReviewPhotoUrl
        )
      ) {
        throw new Error(
          'Cloudinary no devolvió correctamente las URL de las fotografías.',
        );
      }

      const registration = {
        uid,

        personalData: {
          ...personalData,
          fullName: personalData.fullName.trim(),
          documentNumber: personalData.documentNumber.trim(),
          phone: personalData.phone.trim(),
          email,
          birthDate: personalData.birthDate
            ? personalData.birthDate.toISOString()
            : null,
          photo: profilePhotoUrl,
        },

        vehicleData: {
          ...vehicleData,
          plate: vehicleData.plate.trim().toUpperCase(),
          brand: vehicleData.brand.trim(),
          model: vehicleData.model.trim(),
          vehiclePhoto: vehiclePhotoUrl,
        },

        documentsData: {
          licenseNumber: documentsData.licenseNumber.trim(),
          licensePhoto: licensePhotoUrl,
          licenseExpiry: documentsData.licenseExpiry
            ? documentsData.licenseExpiry.toISOString()
            : null,

          soatPhoto: soatPhotoUrl,
          soatExpiry: documentsData.soatExpiry
            ? documentsData.soatExpiry.toISOString()
            : null,

          technicalReviewRequired: technicalRequired,
          technicalReviewPhoto: technicalRequired
            ? technicalReviewPhotoUrl
            : null,

          technicalReviewExpiry:
            technicalRequired && documentsData.technicalReviewExpiry
              ? documentsData.technicalReviewExpiry.toISOString()
              : null,

          mercadoPagoEmail: documentsData.mercadoPagoEmail
            .trim()
            .toLowerCase(),

          acceptedTerms: documentsData.acceptedTerms,
        },

        status: 'pending',
        photosPending: false,
        createdAt: serverTimestamp(),
      };

      const registrationRef = doc(
        db,
        'driverRegistrations',
        uid,
      );

      await setDoc(registrationRef, registration);

      const savedRegistration = await getDoc(registrationRef);

      if (!savedRegistration.exists()) {
        throw new Error(
          'El registro no aparece en Firestore después de guardarlo.',
        );
      }

      const savedData = savedRegistration.data();

      if (
        !savedData.personalData?.photo ||
        !savedData.vehicleData?.vehiclePhoto ||
        !savedData.documentsData?.licensePhoto ||
        !savedData.documentsData?.soatPhoto ||
        (
          technicalRequired &&
          !savedData.documentsData?.technicalReviewPhoto
        )
      ) {
        throw new Error(
          'El registro se guardó, pero no se encontraron todas las fotografías en Firestore.',
        );
      }

      if (
        !savedData.documentsData?.licenseNumber ||
        !savedData.documentsData?.licenseExpiry ||
        !savedData.documentsData?.soatExpiry ||
        !savedData.documentsData?.mercadoPagoEmail ||
        savedData.documentsData?.acceptedTerms !== true
      ) {
        throw new Error(
          'El registro se guardó, pero faltan datos de documentos y pagos.',
        );
      }

      console.log('Registro guardado correctamente:', uid);

      try {
        await signOut(auth);
      } catch (signOutError) {
        console.error(
          'No se pudo cerrar la sesión después del registro:',
          signOutError,
        );
      }

      navigation.replace('RegistrationSuccess');

    } catch (error) {
      console.error(
        'Error al enviar registro:',
        error.code || error.message,
        error,
      );

      let message =
        'No se pudo completar el registro. Inténtalo nuevamente.';

      if (error.code === 'auth/email-already-in-use') {
        message =
          'Este correo ya tiene una cuenta. Utiliza otro correo o inicia sesión.';
      } else if (error.code === 'auth/weak-password') {
        message =
          'La contraseña no cumple los requisitos de seguridad.';
      } else if (error.code === 'auth/invalid-email') {
        message =
          'El correo electrónico no es válido.';
      } else if (error.code === 'auth/network-request-failed') {
        message =
          'No hay conexión. Revisa tu internet e inténtalo nuevamente.';
      } else if (
        error.code === 'permission-denied' ||
        error.code === 'firestore/permission-denied'
      ) {
        message =
          'No fue posible guardar el registro. Revisa las reglas de Firestore.';
      } else if (
        error.message?.includes('Cloudinary') ||
        error.message?.includes('fotografías') ||
        error.message?.includes('documentos y pagos')
      ) {
        message = error.message;
      }

      Alert.alert('Error en el registro', message);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Enviar registro
      </Text>

      <Text style={styles.description}>
        Al continuar, crearemos tu cuenta y enviaremos tus
        datos personales, información del vehículo y
        documentos para revisión. Tu registro quedará
        pendiente de aprobación.
      </Text>

      <Button
        title={
          isSubmitting
            ? 'Enviando...'
            : 'Crear cuenta y enviar registro'
        }
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
});
