
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

            const profilePhotoUrl = await uploadImageToCloudinary(
                personalData.photo,
                `${uid}/personal`,
            );

            const vehiclePhotoUrl = await uploadImageToCloudinary(
                vehicleData.vehiclePhoto,
                `${uid}/vehicles`,
            );

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

            await setDoc(
                doc(db, 'driverRegistrations', uid),
                registration,
            );

            navigation.replace('RegistrationSuccess');
        } catch (error) {
            console.error(
                'Error al enviar registro:',
                error.code || error.message,
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
            } else if (error.code === 'auth/too-many-requests') {
                message = 'Se hicieron demasiados intentos. Espera un momento.';
            } else if (error.code === 'permission-denied') {
                message = 'No fue posible guardar el registro. Revisa las reglas de Firestore.';
            } else if (error.message?.includes('Cloudinary')) {
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
