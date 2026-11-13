
// AI-assisted: see docs/AI_LOG.md #143

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';

const OPEN_STATUSES = [
  'accepted',
  'driver_arriving',
  'in_progress',
];

const timestampMillis = (value) =>
  value?.toMillis?.() ?? 0;

export default function useTripRequests(enabled, category) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const user = auth.currentUser;

    if (!user || !category) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const tripsQuery = query(
      collection(db, 'trip'),
      where('driverId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      tripsQuery,
      (snapshot) => {
        setTrips(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );

        setLoading(false);
        setError('');
      },
      (snapshotError) => {
        console.error(
          'Trip listener:',
          snapshotError.code || snapshotError.message
        );

        setTrips([]);
        setLoading(false);
        setError('listenError');
      }
    );

    return unsubscribe;
  }, [category]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => clearInterval(interval);
  }, [enabled]);

  const activeTrip = useMemo(
    () =>
      trips.find(
        (trip) =>
          trip.category === category &&
          OPEN_STATUSES.includes(trip.status)
      ) ?? null,
    [trips, category]
  );

  const pendingTrip = useMemo(() => {
    if (!enabled || activeTrip) return null;

    return (
      trips
        .filter(
          (trip) =>
            trip.category === category &&
            trip.status === 'requested' &&
            timestampMillis(trip.expiresAt) > now
        )
        .sort(
          (a, b) =>
            timestampMillis(a.expiresAt) -
            timestampMillis(b.expiresAt)
        )[0] ?? null
    );
  }, [trips, enabled, category, activeTrip, now]);

  const changeStatus = useCallback(
    async (tripId, status) => {
      if (!enabled || busy || !auth.currentUser) {
        return false;
      }

      setBusy(true);
      setError('');

      try {
        const uid = auth.currentUser.uid;

        await runTransaction(db, async (transaction) => {
          const tripRef = doc(db, 'trip', tripId);
          const snapshot = await transaction.get(tripRef);

          if (!snapshot.exists()) {
            throw new Error('unavailable');
          }

          const trip = snapshot.data();

          if (
            trip.driverId !== uid ||
            trip.category !== category ||
            trip.status !== 'requested' ||
            (
              status === 'accepted' &&
              timestampMillis(trip.expiresAt) <= Date.now()
            )
          ) {
            throw new Error('unavailable');
          }

          transaction.update(tripRef, {
            status,
            ...(status === 'accepted'
              ? { acceptedAt: serverTimestamp() }
              : { rejectedAt: serverTimestamp() }),
          });
        });

        return true;
      } catch (changeError) {
        console.error(
          'Trip status:',
          changeError.code || changeError.message
        );

        setError(
          changeError.message === 'unavailable'
            ? 'unavailable'
            : 'writeError'
        );

        return false;
      } finally {
        setBusy(false);
      }
    },
    [enabled, busy, category]
  );

  const acceptTrip = useCallback(
    (tripId) => changeStatus(tripId, 'accepted'),
    [changeStatus]
  );

  const rejectTrip = useCallback(
    (tripId) => changeStatus(tripId, 'rejected'),
    [changeStatus]
  );

  return {
    pendingTrip,
    activeTrip,
    loading,
    busy,
    error,
    now,
    acceptTrip,
    rejectTrip,
  };
}
