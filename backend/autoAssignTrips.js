
// AI-assisted: see docs/AI_LOG.md #200

const { FieldValue, Timestamp } =
    require('firebase-admin/firestore');

const REQUEST_SECONDS = 120;
const LOCATION_MAX_AGE_MS = 30 * 60 * 1000;

const VALID_CATEGORIES = [
    'economy',
    'xl',
    'premium',
];

const ACTIVE_STATUSES = [
    'requested',
    'accepted',
    'driver_arriving',
    'in_progress',
];

const validAddress = (place) =>
    typeof place?.address === 'string' &&
    place.address.trim().length >= 5 &&
    place.address.trim().length <= 200;

function isUnassigned(trip) {
    return (
        !trip.driverId &&
        (trip.status == null || trip.status === 'requested') &&
        VALID_CATEGORIES.includes(trip.category) &&
        typeof trip.passengerName === 'string' &&
        trip.passengerName.trim().length > 0 &&
        validAddress(trip.origin) &&
        validAddress(trip.destination)
    );
}

module.exports = function startAutoAssignTrips(db) {
    let tripDocs = [];
    let locationDocs = [];
    let running = false;
    let dirty = false;
    let readyTrips = false;
    let readyLocations = false;

    async function assignAvailableTrips() {
        const now = Date.now();

        const occupied = new Set();

        // Evitar asignar solicitudes a conductores ocupados.
        for (const snapshot of tripDocs) {
            const trip = snapshot.data();

            if (
                trip.driverId &&
                ACTIVE_STATUSES.includes(trip.status) &&
                (
                    trip.status !== 'requested' ||
                    (trip.expiresAt?.toMillis?.() ?? 0) > now
                )
            ) {
                occupied.add(trip.driverId);
            }
        }

        const locations = locationDocs.filter((snapshot) => {
            const location = snapshot.data();
            const updatedAt =
                location.updatedAt?.toMillis?.() ?? 0;

            return (
                location.isAvailable === true &&
                updatedAt > 0 &&
                now - updatedAt < LOCATION_MAX_AGE_MS &&
                updatedAt <= now + 60000
            );
        });

        const candidates = tripDocs.filter((snapshot) =>
            isUnassigned(snapshot.data())
        );
        // AI-assisted: see docs/AI_LOG.md #202
        console.log(
            'Viajes detectados:',
            tripDocs.length
        );

        console.log(
            'Solicitudes pendientes de asignación:',
            tripDocs
                .filter((item) => !item.data().driverId)
                .map((item) => ({
                    id: item.id,
                    status: item.data().status,
                    category: item.data().category,
                    passengerName: item.data().passengerName,
                    origin: item.data().origin?.address,
                    destination: item.data().destination?.address,
                }))
        );

        for (const candidate of candidates) {
            const category = candidate.data().category;

            for (const locationSnapshot of locations) {
                const driverId = locationSnapshot.id;

                if (occupied.has(driverId)) {
                    continue;
                }

                try {
                    const registrationRef = db
                        .collection('driverRegistrations')
                        .doc(driverId);

                    const registration = await registrationRef.get();

                    if (
                        !registration.exists ||
                        registration.data().status !== 'approved' ||
                        registration.data().vehicleData?.category !==
                        category
                    ) {
                        continue;
                    }

                    const tripRef = db
                        .collection('trip')
                        .doc(candidate.id);

                    const driverLocationRef = db
                        .collection('driverLocations')
                        .doc(driverId);

                    const assigned = await db.runTransaction(
                        async (transaction) => {
                            const tripSnapshot =
                                await transaction.get(tripRef);

                            const currentLocation =
                                await transaction.get(driverLocationRef);

                            const currentRegistration =
                                await transaction.get(registrationRef);

                            if (
                                !tripSnapshot.exists ||
                                !isUnassigned(tripSnapshot.data()) ||
                                !currentLocation.exists ||
                                !currentRegistration.exists
                            ) {
                                return false;
                            }

                            const driver = currentRegistration.data();
                            const location = currentLocation.data();

                            const updatedAt =
                                location.updatedAt?.toMillis?.() ?? 0;

                            const transactionNow = Date.now();

                            if (
                                driver.status !== 'approved' ||
                                driver.vehicleData?.category !== category ||
                                !location.isAvailable ||
                                transactionNow - updatedAt >=
                                LOCATION_MAX_AGE_MS
                            ) {
                                return false;
                            }

                            const trip = tripSnapshot.data();

                            const update = {
                                driverId,
                                status: 'requested',
                                expiresAt: Timestamp.fromMillis(
                                    transactionNow +
                                    REQUEST_SECONDS * 1000
                                ),
                                assignedAt:
                                    FieldValue.serverTimestamp(),
                                paymentMethod:
                                    trip.paymentMethod || 'stripe',
                                passengerId:
                                    trip.passengerId ||
                                    'pasajero_demo_1',
                            };

                            if (!trip.createdAt) {
                                update.createdAt =
                                    FieldValue.serverTimestamp();
                            }

                            transaction.update(tripRef, update);

                            return true;
                        }
                    );

                    if (assigned) {
                        occupied.add(driverId);

                        console.log(
                            `Viaje ${candidate.id} asignado automáticamente`
                        );

                        break;
                    }
                } catch (error) {
                    console.error(
                        'Autoassign:',
                        error.code || error.message
                    );
                }
            }
        }
    }

    async function processChanges() {
        if (
            running ||
            !readyTrips ||
            !readyLocations
        ) {
            return;
        }

        running = true;

        try {
            while (dirty) {
                dirty = false;

                try {
                    await assignAvailableTrips();
                } catch (error) {
                    console.error(
                        'Autoassign:',
                        error.code || error.message
                    );
                }
            }
        } finally {
            running = false;
        }
    }

    function schedule() {
        dirty = true;
        processChanges();
    }

    // Detectar solicitudes creadas desde Firebase Console.
    const unsubscribeTrips = db
        .collection('trip')
        .onSnapshot(
            (snapshot) => {
                tripDocs = snapshot.docs;
                readyTrips = true;
                schedule();
            },
            (error) => {
                console.error(
                    'Autoassign trips listener:',
                    error.message
                );
            }
        );

    // Detectar cuando un conductor activa Disponible.
    const unsubscribeLocations = db
        .collection('driverLocations')
        .onSnapshot(
            (snapshot) => {
                locationDocs = snapshot.docs;
                readyLocations = true;
                schedule();
            },
            (error) => {
                console.error(
                    'Autoassign locations listener:',
                    error.message
                );
            }
        );

    console.log(
        'Asignación automática de viajes activada'
    );

    return () => {
        unsubscribeTrips();
        unsubscribeLocations();
    };
};
