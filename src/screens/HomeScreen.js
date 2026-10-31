import { useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../hooks/useAuth';
import { colors, spacing, radius, typography } from '../theme';
import { t } from '../i18n';

const ACCOUNT_STATUS = 'pending';

export default function HomeScreen() {
    const { signOut } = useAuth();
    const [isAvailable, setIsAvailable] = useState(false);

    const isPending = ACCOUNT_STATUS === 'pending';
    const accountStatus = isPending
        ? t.home.pending
        : t.home.approved;

    const handleAvailabilityChange = (value) => {
        if (isPending) return;
        setIsAvailable(value);
    };

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
                        isPending ? styles.pending : styles.approved,
                    ]}>
                        {accountStatus}
                    </Text>

                    <Text style={styles.note}>
                        {t.home.temporaryNote}
                    </Text>
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
                            disabled={isPending}
                            trackColor={{
                                false: colors.disabled,
                                true: colors.primary,
                            }}
                            thumbColor={isAvailable ? colors.onPrimary : colors.textSecondary}
                            accessibilityRole="switch"
                            accessibilityLabel={t.home.availability}
                            accessibilityState={{ disabled: isPending }}
                        />
                    </View>

                    {isPending && (
                        <Text style={styles.warning}>
                            {t.home.pendingMessage}
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