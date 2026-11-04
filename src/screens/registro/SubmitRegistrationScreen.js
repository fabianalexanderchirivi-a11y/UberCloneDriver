
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
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';

export default function SubmitRegistrationScreen({ route, navigation }) {
    const { password } = route.params;

    const {
        personalData,
        vehicleData,
        isPersonalValid,
        isVehicleValid,
    } = useContext(RegistrationContext);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!isPersonalValid || !isVehicleValid) {
            Alert.alert(
                'Datos incompletos',
                'Regresa y revisa que todos los datos sean correctos.',
            );
            return;
        }

        if (!personalData.photo || !vehicleData.vehiclePhoto) {
            Alert.alert(
                'Faltan fotografías',
                'Necesitas seleccionar tu foto de perfil y la foto del vehículo.',
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const email = personalData.email.trim().toLowerCase();

            let user = auth.currentUser;

            if (user && user.email?.toLowerCase() !== email) {
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

            // Subir fotografía de perfil a Cloudinary.
            const profilePhotoUrl = await uploadImageToCloudinary(
                personalData.photo,
                `${uid}/personal`,
            );

            // Subir fotografía del vehículo a Cloudinary.
            const vehiclePhotoUrl = await uploadImageToCloudinary(
                vehicleData.vehiclePhoto,
                `${uid}/vehicles`,
            );

            // Verificar que Cloudinary haya devuelto las dos URL.
            if (!profilePhotoUrl || !vehiclePhotoUrl) {
                throw new Error(
                    'Cloudinary no devolvió correctamente las URL de las fotografías.',
                );
            }

            console.log('URL FOTO PERFIL:', profilePhotoUrl);
            console.log('URL FOTO VEHÍCULO:', vehiclePhotoUrl);

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
                status: 'pending',
                photosPending: false,
                createdAt: serverTimestamp(),
            };

            // Guardar registro completo en Firestore.
            const registrationRef = doc(
                db,
                'driverRegistrations',
                uid,
            );

            await setDoc(registrationRef, registration);

            // Comprobar que Firestore tenga las dos URL guardadas.
            const savedRegistration = await getDoc(registrationRef);

            if (!savedRegistration.exists()) {
                throw new Error(
                    'El registro no aparece en Firestore después de guardarlo.',
                );
            }

            const savedData = savedRegistration.data();

            if (
                !savedData.personalData?.photo ||
                !savedData.vehicleData?.vehiclePhoto
            ) {
                throw new Error(
                    'El registro se guardó, pero no se encontraron las fotografías en Firestore.',
                );
            }

            console.log('Registro guardado correctamente:', uid);
            console.log('Foto de perfil guardada:', savedData.personalData.photo);
            console.log('Foto del vehículo guardada:', savedData.vehicleData.vehiclePhoto);

            navigation.replace('RegistrationSuccess');

        } catch (error) {
            console.error(
                'Error al enviar registro:',
                error.code || error.message,
                error,
            );

            let message = 'No se pudo completar el registro. Inténtalo nuevamente.';

            if (error.code === 'auth/email-already-in-use') {
                message = 'Este correo ya tiene una cuenta. Utiliza otro correo o inicia sesión.';
            } else if (error.code === 'auth/weak-password') {
                message = 'La contraseña no cumple los requisitos de seguridad.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'El correo electrónico no es válido.';
            } else if (error.code === 'auth/network-request-failed') {
                message = 'No hay conexión. Revisa tu internet e inténtalo nuevamente.';
            } else if (
                error.code === 'permission-denied' ||
                error.code === 'firestore/permission-denied'
            ) {
                message = 'No fue posible guardar el registro. Revisa las reglas de Firestore.';
            } else if (error.message?.includes('Cloudinary')) {
                message = error.message;
            } else if (error.message?.includes('fotografías')) {
                message = error.message;
            }

            Alert.alert('Error en el registro', message);

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enviar registro</Text>

            <Text style={styles.description}>
                Al continuar, crearemos tu cuenta y enviaremos tus datos y fotografías
                para revisión. Tu registro quedará pendiente de aprobación.
            </Text>

            <Button
                title={isSubmitting ? 'Enviando...' : 'Crear cuenta y enviar registro'}
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
