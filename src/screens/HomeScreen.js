import { useEffect, useState } from 'react';
import {
    View,
    Text,
    Switch,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';

import useAuth from '../hooks/useAuth';
import { auth, db } from '../config/firebase';
import { colors, spacing, radius, typography } from '../theme';
import { t } from '../i18n';

export default function HomeScreen() {
    const { signOut } = useAuth();
    const [isAvailable, setIsAvailable] = useState(false);
    const [accountStatus, setAccountStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadAccountStatus = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    throw new Error('No hay un usuario autenticado.');
                }

                const registrationRef = doc(
                    db,
                    'driverRegistrations',
                    user.uid
                );

                const registrationSnapshot = await getDoc(registrationRef);

                if (!registrationSnapshot.exists()) {
                    throw new Error('No existe el registro del conductor.');
                }

                const registration = registrationSnapshot.data();

                if (isMounted) {
                    setAccountStatus(registration.status);
                }
            } catch (error) {
                console.error(
                    'Error al consultar el estado:',
                    error.code || error.message
                );

                if (isMounted) {
                    Alert.alert(
                        'Error',
                        'No pudimos consultar el estado de tu cuenta. Inténtalo nuevamente.'
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadAccountStatus();

        return () => {
            isMounted = false;
        };
    }, []);

    const isPending = accountStatus === 'pending';
    const isApproved = accountStatus === 'approved';

    const statusText = isPending
        ? t.home.pending
        : isApproved
            ? t.home.approved
            : accountStatus === 'rejected'
                ? 'No aprobado'
                : 'Estado no disponible';

    const handleAvailabilityChange = (value) => {
        if (!isApproved) return;
        setIsAvailable(value);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.description}>
                        Consultando tu cuenta...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>{t.home.welcome}</Text>

                <Text style={styles.description}>
                    {t.home.description}
                </Text>

                <View style={styles.card}>
                    <Text style={styles.label}>
                        {t.home.accountStatus}
                    </Text>

                    <Text style={[
                        styles.status,
                        isPending
                            ? styles.pending
                            : isApproved
                                ? styles.approved
                                : styles.rejected,
                    ]}>
                        {statusText}
                    </Text>

                    {isPending && (
                        <Text style={styles.note}>
                            {t.home.temporaryNote}
                        </Text>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>
                        {t.home.availability}
                    </Text>

                    <View style={styles.switchRow}>
                        <Text style={styles.availabilityText}>
                            {isAvailable ? t.home.available : t.home.unavailable}
                        </Text>

                        <Switch
                            value={isAvailable}
                            onValueChange={handleAvailabilityChange}
                            disabled={!isApproved}
                            trackColor={{
                                false: colors.disabled,
                                true: colors.primary,
                            }}
                            thumbColor={
                                isAvailable
                                    ? colors.onPrimary
                                    : colors.textSecondary
                            }
                            accessibilityRole="switch"
                            accessibilityLabel={t.home.availability}
                            accessibilityState={{ disabled: !isApproved }}
                        />
                    </View>

                    {!isApproved && (
                        <Text style={styles.warning}>
                            {isPending
                                ? t.home.pendingMessage
                                : 'La disponibilidad estará habilitada cuando tu cuenta sea aprobada.'}
                        </Text>
                    )}
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.logoutPressed,
                    ]}
                    onPress={signOut}
                    accessibilityRole="button"
                >
                    <Text style={styles.logoutText}>
                        {t.home.logOut}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: spacing.xl,
        gap: spacing.lg,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
    },
    title: {
        ...typography.title,
        color: colors.text,
    },
    description: {
        ...typography.body,
        color: colors.textSecondary,
    },
    card: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: radius.md,
        gap: spacing.sm,
    },
    label: {
        ...typography.label,
        color: colors.textSecondary,
    },
    status: {
        ...typography.body,
        fontWeight: '700',
    },
    pending: {
        color: colors.warning,
    },
    approved: {
        color: colors.success,
    },
    rejected: {
        color: colors.error,
    },
    note: {
        ...typography.body,
        color: colors.textSecondary,
        fontSize: 13,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    availabilityText: {
        ...typography.body,
        color: colors.text,
    },
    warning: {
        ...typography.body,
        color: colors.textSecondary,
        fontSize: 13,
    },
    logoutButton: {
        backgroundColor: colors.primary,
        minHeight: 56,
        borderRadius: radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
    },
    logoutPressed: {
        opacity: 0.7,
    },
    logoutText: {
        color: colors.onPrimary,
        ...typography.label,
    },
});
