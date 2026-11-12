
// AI-assisted: see docs/AI_LOG.md #126, #128

import { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    Pressable,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';

import { auth, db } from '../config/firebase';
import { LanguageContext } from '../context/LanguageContext';
import { validatePhone, validatePassword } from '../utils/validations';
import { colors, spacing, radius, typography } from '../theme';

export default function DriverProfileScreen({ navigation }) {
    const { t, language, setLanguage } = useContext(LanguageContext);

    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [editingPhone, setEditingPhone] = useState(false);
    const [phone, setPhone] = useState('');
    const [savingPhone, setSavingPhone] = useState(false);
    const [phoneMessage, setPhoneMessage] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const [editingPassword, setEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

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
                const data = snapshot.exists() ? snapshot.data() : null;
                setRegistration(data);
                setError(!data);
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

        const number = String(value);

        return `${'*'.repeat(
            Math.max(0, number.length - 4)
        )}${number.slice(-4)}`;
    };

    const formatDate = (value) => {
        if (!value) return t('profile.notAvailable');

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? t('profile.notAvailable')
            : date.toLocaleDateString(
                language === 'en' ? 'en-US' : 'es-CO'
            );
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

    const startEditingPhone = () => {
        setPhone(personal.phone || '');
        setPhoneError('');
        setPhoneMessage('');
        setEditingPhone(true);
    };

    const cancelEditingPhone = () => {
        setEditingPhone(false);
        setPhoneError('');
        setPhoneMessage('');
    };

    const savePhone = async () => {
        if (savingPhone) return;

        const cleaned = phone.trim();
        const validationError = validatePhone(cleaned);

        if (validationError) {
            setPhoneError(t(`errors.${validationError}`));
            return;
        }

        if (cleaned === personal.phone) {
            setEditingPhone(false);
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            setPhoneError(t('profile.sessionError'));
            return;
        }

        setSavingPhone(true);
        setPhoneError('');
        setPhoneMessage('');

        try {
            await updateDoc(
                doc(db, 'driverRegistrations', user.uid),
                { 'personalData.phone': cleaned }
            );

            setEditingPhone(false);
            setPhoneMessage(t('profile.phoneSaved'));
        } catch (saveError) {
            console.error(
                'Error al actualizar teléfono:',
                saveError.code || saveError.message
            );

            setPhoneError(
                saveError.code === 'permission-denied'
                    ? t('profile.phonePermissionError')
                    : t('profile.phoneSaveError')
            );
        } finally {
            setSavingPhone(false);
        }
    };

    const clearPasswordFields = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const savePassword = async () => {
        if (savingPassword) return;

        setPasswordError('');
        setPasswordMessage('');

        if (!currentPassword) {
            setPasswordError(t('profile.currentPasswordRequired'));
            return;
        }

        const validationError = validatePassword(newPassword);

        if (validationError) {
            setPasswordError(t(`errors.${validationError}`));
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(t('profile.passwordMismatch'));
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordError(t('profile.passwordMustChange'));
            return;
        }

        const user = auth.currentUser;

        if (!user || !user.email) {
            setPasswordError(t('profile.sessionError'));
            return;
        }

        setSavingPassword(true);

        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            clearPasswordFields();
            setEditingPassword(false);
            setPasswordMessage(t('profile.passwordSaved'));
        } catch (saveError) {
            console.error(
                'Error al cambiar contraseña:',
                saveError.code || saveError.message
            );

            if (
                saveError.code === 'auth/invalid-credential' ||
                saveError.code === 'auth/wrong-password'
            ) {
                setPasswordError(t('profile.incorrectPassword'));
            } else if (saveError.code === 'auth/weak-password') {
                setPasswordError(t('profile.weakPassword'));
            } else if (saveError.code === 'auth/too-many-requests') {
                setPasswordError(t('profile.tooManyRequests'));
            } else {
                setPasswordError(t('profile.passwordSaveError'));
            }
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.screen} edges={['bottom']}>
                <View style={styles.center}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !registration) {
        return (
            <SafeAreaView style={styles.screen} edges={['bottom']}>
                <View style={styles.center}>
                    <Text style={styles.error}>
                        {t('profile.loadError')}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen} edges={['bottom']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
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

                        <View style={styles.field}>
                            <Text style={styles.label}>
                                {t('personal.phone')}
                            </Text>

                            {!editingPhone ? (
                                <>
                                    <Text style={styles.value}>
                                        {displayValue(personal.phone)}
                                    </Text>

                                    <Pressable
                                        style={styles.secondaryButton}
                                        onPress={startEditingPhone}
                                    >
                                        <Text style={styles.secondaryText}>
                                            {t('profile.changePhone')}
                                        </Text>
                                    </Pressable>
                                </>
                            ) : (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        value={phone}
                                        onChangeText={(value) => {
                                            setPhone(value.replace(/\D/g, ''));
                                            setPhoneError('');
                                        }}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        placeholder={t('profile.phonePlaceholder')}
                                        placeholderTextColor={colors.textSecondary}
                                        accessibilityLabel={t('personal.phone')}
                                        editable={!savingPhone}
                                    />

                                    <View style={styles.actions}>
                                        <Pressable
                                            style={styles.secondaryButton}
                                            onPress={cancelEditingPhone}
                                            disabled={savingPhone}
                                        >
                                            <Text style={styles.secondaryText}>
                                                {t('profile.cancel')}
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            style={styles.primaryButton}
                                            onPress={savePhone}
                                            disabled={savingPhone}
                                        >
                                            <Text style={styles.primaryText}>
                                                {savingPhone
                                                    ? t('profile.saving')
                                                    : t('profile.save')}
                                            </Text>
                                        </Pressable>
                                    </View>
                                </>
                            )}

                            {!!phoneError && (
                                <Text style={styles.error}>{phoneError}</Text>
                            )}

                            {!!phoneMessage && (
                                <Text style={styles.success}>{phoneMessage}</Text>
                            )}
                        </View>

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

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>
                            {t('profile.settingsSection')}
                        </Text>

                        <Text style={styles.label}>
                            {t('personal.language')}
                        </Text>

                        <View style={styles.actions}>
                            <Pressable
                                style={[
                                    styles.languageButton,
                                    language === 'es' && styles.languageSelected,
                                ]}
                                onPress={() => setLanguage('es')}
                                accessibilityRole="button"
                                accessibilityState={{ selected: language === 'es' }}
                            >
                                <Text style={styles.secondaryText}>
                                    {t('personal.spanish')}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.languageButton,
                                    language === 'en' && styles.languageSelected,
                                ]}
                                onPress={() => setLanguage('en')}
                                accessibilityRole="button"
                                accessibilityState={{ selected: language === 'en' }}
                            >
                                <Text style={styles.secondaryText}>
                                    {t('personal.english')}
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.label}>
                            {t('profile.securitySection')}
                        </Text>

                        {!editingPassword ? (
                            <Pressable
                                style={styles.secondaryButton}
                                onPress={() => {
                                    clearPasswordFields();
                                    setPasswordError('');
                                    setPasswordMessage('');
                                    setEditingPassword(true);
                                }}
                            >
                                <Text style={styles.secondaryText}>
                                    {t('profile.changePassword')}
                                </Text>
                            </Pressable>
                        ) : (
                            <>
                                <Text style={styles.label}>
                                    {t('profile.currentPassword')}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="off"
                                    editable={!savingPassword}
                                />

                                <Text style={styles.label}>
                                    {t('profile.newPassword')}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="new-password"
                                    editable={!savingPassword}
                                />

                                <Text style={styles.label}>
                                    {t('profile.confirmPassword')}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="new-password"
                                    editable={!savingPassword}
                                />

                                <View style={styles.actions}>
                                    <Pressable
                                        style={styles.secondaryButton}
                                        disabled={savingPassword}
                                        onPress={() => {
                                            clearPasswordFields();
                                            setPasswordError('');
                                            setEditingPassword(false);
                                        }}
                                    >
                                        <Text style={styles.secondaryText}>
                                            {t('profile.cancel')}
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        style={styles.primaryButton}
                                        disabled={savingPassword}
                                        onPress={savePassword}
                                    >
                                        <Text style={styles.primaryText}>
                                            {savingPassword
                                                ? t('profile.saving')
                                                : t('profile.savePassword')}
                                        </Text>
                                    </Pressable>
                                </View>
                            </>
                        )}

                        {!!passwordError && (
                            <Text style={styles.error}>{passwordError}</Text>
                        )}

                        {!!passwordMessage && (
                            <Text style={styles.success}>{passwordMessage}</Text>
                        )}
                    </View>

                    <Text style={styles.notice}>
                        {t('profile.protectedNotice')}
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
    flex: {
        flex: 1,
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
        fontSize: 24,
        textAlign: 'center',
    },
    status: {
        color: colors.success,
        fontWeight: '700',
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
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: 48,
        paddingHorizontal: spacing.md,
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    secondaryButton: {
        flex: 1,
        minHeight: 44,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
    },
    secondaryText: {
        color: colors.text,
        fontWeight: '600',
        textAlign: 'center',
    },
    primaryButton: {
        flex: 1,
        minHeight: 44,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
    },
    primaryText: {
        color: colors.onPrimary,
        fontWeight: '700',
        textAlign: 'center',
    },
    languageButton: {
        flex: 1,
        minHeight: 46,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
    },
    languageSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
    },
    error: {
        color: colors.error,
        fontSize: 13,
    },
    success: {
        color: colors.success,
        fontSize: 13,
    },
    notice: {
        color: colors.textSecondary,
        fontSize: 12,
        textAlign: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },
    backButtonText: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
});
