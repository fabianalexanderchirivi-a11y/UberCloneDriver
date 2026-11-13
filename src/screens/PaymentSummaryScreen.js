
// AI-assisted: see docs/AI_LOG.md #194, #197, #198

import { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Linking,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, onSnapshot } from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import useTripEstimate from '../hooks/useTripEstimate';
import { LanguageContext } from '../context/LanguageContext';

import {
    createStripePayment,
    verifyStripePayment,
} from '../services/paymentService';

import { colors, spacing, radius, typography } from '../theme';

const money = (value) =>
    `$${Math.round(value).toLocaleString('es-CO')} COP`;

const WORDS = {
    es: {
        success: 'Viaje finalizado',
        paid: 'Pago aprobado',
        passenger: 'Pasajero',
        origin: 'Recogida',
        destination: 'Destino',
        distance: 'Distancia',
        duration: 'Tiempo estimado',
        payment: 'Método de pago',
        status: 'Estado del pago',
        cash: 'Efectivo',
        card: 'Tarjeta',
        pending: 'Pendiente',
        approved: 'Aprobado',
        fare: 'Tarifa total',
        commission: 'Comisión de la plataforma (20 %)',
        earnings: 'Tu ganancia',
        calculating: 'Calculando el resumen del pago...',
        calculationError: 'No fue posible calcular la tarifa.',
        retry: 'Reintentar cálculo',
        home: 'Volver al inicio',
        loadError: 'No se pudo cargar el viaje.',
        pay: 'Pagar con Stripe',
        verify: 'Verificar pago',
        paymentError: 'No se pudo procesar el pago.',
        paymentSuccess: '¡Pago confirmado correctamente!',
        notPaid: 'Stripe todavía no confirma el pago.',
        note: 'Pago de prueba. No se utiliza dinero real.',
        cashWarning:
            'Este viaje estaba marcado como efectivo. Para esta prueba, se cambiará el método de pago a Stripe. ¿Continuar?',
        cancel: 'Cancelar',
        continue: 'Continuar',
    },
    en: {
        success: 'Trip completed',
        paid: 'Payment approved',
        passenger: 'Passenger',
        origin: 'Pickup',
        destination: 'Destination',
        distance: 'Distance',
        duration: 'Estimated time',
        payment: 'Payment method',
        status: 'Payment status',
        cash: 'Cash',
        card: 'Card',
        pending: 'Pending',
        approved: 'Approved',
        fare: 'Total fare',
        commission: 'Platform commission (20%)',
        earnings: 'Your earnings',
        calculating: 'Calculating payment summary...',
        calculationError: 'Unable to calculate the fare.',
        retry: 'Retry calculation',
        home: 'Back to home',
        loadError: 'Unable to load the trip.',
        pay: 'Pay with Stripe',
        verify: 'Verify payment',
        paymentError: 'Unable to process payment.',
        paymentSuccess: 'Payment confirmed!',
        notPaid: 'Stripe has not confirmed the payment yet.',
        note: 'Test payment. No real money is used.',
        cashWarning:
            'This trip was marked as cash. For this test, its payment method will be changed to Stripe. Continue?',
        cancel: 'Cancel',
        continue: 'Continue',
    },
};

export default function PaymentSummaryScreen({
    route,
    navigation,
}) {
    const { language } = useContext(LanguageContext);
    const labels = WORDS[language] ?? WORDS.es;

    const tripId = route.params?.tripId;

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Escuchar cambios del pago desde Firebase.
    useEffect(() => {
        const uid = auth.currentUser?.uid;

        if (!uid || !tripId) {
            setLoading(false);
            setLoadError(true);
            return;
        }

        return onSnapshot(
            doc(db, 'trip', tripId),
            (snapshot) => {
                const data = snapshot.exists()
                    ? snapshot.data()
                    : null;

                const valid =
                    data?.driverId === uid &&
                    ['completed', 'paid'].includes(data.status);

                setTrip(
                    valid
                        ? { id: snapshot.id, ...data }
                        : null
                );

                setLoadError(!valid);
                setLoading(false);
            },
            (error) => {
                console.error(
                    'Payment summary:',
                    error.code || error.message
                );

                setLoadError(true);
                setLoading(false);
            }
        );
    }, [tripId]);

    const isPaid = trip?.status === 'paid';

    const savedEstimate =
        trip?.paymentSessionId &&
            Number.isFinite(trip.fare) &&
            Number.isFinite(trip.commission) &&
            Number.isFinite(trip.driverEarnings) &&
            Number.isFinite(trip.distanceKm) &&
            Number.isFinite(trip.durationMin)
            ? {
                fare: trip.fare,
                commission: trip.commission,
                driverEarnings: trip.driverEarnings,
                distanceKm: trip.distanceKm,
                durationMin: trip.durationMin,
            }
            : null;

    // Calcular con OSRM solo si todavía no hay pago creado.
    const {
        estimate,
        loading: estimateLoading,
        error: estimateError,
        retry,
    } = useTripEstimate(
        trip && !trip.paymentSessionId && !isPaid
            ? trip
            : null
    );

    const amount = savedEstimate || estimate;

    const openCheckout = async () => {
        if (!trip || !amount || processing || isPaid) {
            return;
        }

        setProcessing(true);

        try {
            const result = await createStripePayment(
                tripId,
                amount
            );

            if (result.alreadyPaid) {
                Alert.alert(
                    'UberCloneDriver',
                    labels.paymentSuccess
                );
                return;
            }

            if (!result.url) {
                throw new Error('CHECKOUT_URL_MISSING');
            }

            await Linking.openURL(result.url);
        } catch (error) {
            console.error(
                'Stripe Checkout:',
                error.message
            );

            Alert.alert(
                'UberCloneDriver',
                `${labels.paymentError}\n${error.message}`
            );
        } finally {
            setProcessing(false);
        }
    };

    const handlePayment = () => {
        if (
            trip?.paymentMethod === 'cash' &&
            !trip.paymentSessionId
        ) {
            Alert.alert(
                'Stripe Sandbox',
                labels.cashWarning,
                [
                    {
                        text: labels.cancel,
                        style: 'cancel',
                    },
                    {
                        text: labels.continue,
                        onPress: openCheckout,
                    },
                ]
            );
            return;
        }

        openCheckout();
    };

    const handleVerify = async () => {
        if (!trip || processing) return;

        setProcessing(true);

        try {
            const result = await verifyStripePayment(tripId);

            Alert.alert(
                'UberCloneDriver',
                result.status === 'approved'
                    ? labels.paymentSuccess
                    : labels.notPaid
            );
        } catch (error) {
            console.error(
                'Verify Stripe:',
                error.message
            );

            Alert.alert(
                'UberCloneDriver',
                `${labels.paymentError}\n${error.message}`
            );
        } finally {
            setProcessing(false);
        }
    };

    const goHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    const renderDetail = (label, value) => (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
                {label}
            </Text>

            <Text style={styles.detailValue}>
                {value ?? '-'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView
                style={styles.screen}
                edges={['bottom']}
            >
                <View style={styles.center}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const displayPaymentMethod =
        trip?.paymentSessionId || isPaid
            ? 'Stripe'
            : trip?.paymentMethod === 'cash'
                ? labels.cash
                : trip?.paymentMethod === 'card'
                    ? labels.card
                    : trip?.paymentMethod || '-';

    return (
        <SafeAreaView
            style={styles.screen}
            edges={['bottom']}
        >
            <ScrollView
                contentContainerStyle={styles.content}
            >
                <View style={styles.heading}>
                    <Text style={styles.check}>✓</Text>

                    <Text style={styles.title}>
                        {isPaid ? labels.paid : labels.success}
                    </Text>
                </View>

                {loadError || !trip ? (
                    <Text style={styles.error}>
                        {labels.loadError}
                    </Text>
                ) : (
                    <>
                        <View style={styles.card}>
                            {renderDetail(
                                labels.passenger,
                                trip.passengerName
                            )}

                            {renderDetail(
                                labels.origin,
                                trip.origin?.address
                            )}

                            {renderDetail(
                                labels.destination,
                                trip.destination?.address
                            )}

                            {renderDetail(
                                labels.payment,
                                displayPaymentMethod
                            )}

                            {renderDetail(
                                labels.status,
                                isPaid
                                    ? labels.approved
                                    : labels.pending
                            )}
                        </View>

                        <View style={styles.card}>
                            {!amount && estimateLoading ? (
                                <View style={styles.loadingRow}>
                                    <ActivityIndicator
                                        color={colors.primary}
                                    />

                                    <Text style={styles.detailLabel}>
                                        {labels.calculating}
                                    </Text>
                                </View>
                            ) : !amount && estimateError ? (
                                <>
                                    <Text style={styles.error}>
                                        {labels.calculationError}
                                    </Text>

                                    <Pressable
                                        onPress={retry}
                                        style={styles.retryButton}
                                    >
                                        <Text style={styles.retryText}>
                                            {labels.retry}
                                        </Text>
                                    </Pressable>
                                </>
                            ) : amount ? (
                                <>
                                    {renderDetail(
                                        labels.distance,
                                        `${amount.distanceKm.toFixed(1)} km`
                                    )}

                                    {renderDetail(
                                        labels.duration,
                                        `${Math.round(amount.durationMin)} min`
                                    )}

                                    <View style={styles.divider} />

                                    {renderDetail(
                                        labels.fare,
                                        money(amount.fare)
                                    )}

                                    {renderDetail(
                                        labels.commission,
                                        `-${money(amount.commission)}`
                                    )}

                                    <View style={styles.divider} />

                                    <Text style={styles.earningsLabel}>
                                        {labels.earnings}
                                    </Text>

                                    <Text style={styles.earningsValue}>
                                        {money(amount.driverEarnings)}
                                    </Text>
                                </>
                            ) : null}
                        </View>

                        <Text style={styles.note}>
                            {labels.note}
                        </Text>

                        {!isPaid && (
                            <>
                                <Pressable
                                    style={[
                                        styles.payButton,
                                        (!amount || processing) &&
                                        styles.disabled,
                                    ]}
                                    disabled={!amount || processing}
                                    onPress={handlePayment}
                                    accessibilityRole="button"
                                >
                                    {processing ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.payButtonText}>
                                            {labels.pay}
                                        </Text>
                                    )}
                                </Pressable>

                                <Pressable
                                    style={styles.verifyButton}
                                    disabled={processing}
                                    onPress={handleVerify}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.verifyText}>
                                        {labels.verify}
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </>
                )}

                <Pressable
                    style={styles.homeButton}
                    onPress={goHome}
                    accessibilityRole="button"
                >
                    <Text style={styles.homeButtonText}>
                        {labels.home}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
    },
    check: {
        fontSize: 48,
        fontWeight: '700',
        color: colors.success,
    },
    title: {
        ...typography.title,
        color: colors.text,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: radius.lg,
        gap: spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    detailLabel: {
        flex: 1,
        color: colors.textSecondary,
        fontSize: 14,
    },
    detailValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
    },
    earningsLabel: {
        color: colors.textSecondary,
        textAlign: 'center',
        fontSize: 15,
    },
    earningsValue: {
        color: colors.success,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: '800',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    retryButton: {
        paddingVertical: spacing.sm,
    },
    retryText: {
        color: colors.primary,
        fontWeight: '700',
    },
    error: {
        color: colors.error,
        textAlign: 'center',
    },
    note: {
        color: colors.textSecondary,
        textAlign: 'center',
        fontSize: 12,
    },
    payButton: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        borderRadius: radius.lg,
        alignItems: 'center',
    },
    payButtonText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: '700',
    },
    verifyButton: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        borderRadius: radius.lg,
        alignItems: 'center',
    },
    verifyText: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '700',
    },
    disabled: {
        opacity: 0.5,
    },
    homeButton: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        borderRadius: radius.lg,
        alignItems: 'center',
    },
    homeButtonText: {
        color: colors.onPrimary,
        fontWeight: '700',
        fontSize: 16,
    },
});
