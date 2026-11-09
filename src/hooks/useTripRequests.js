import { useCallback, useEffect, useState } from 'react';
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

export default function useTripRequests(enabled, category) {
  const [requests, setRequests] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user || !category) {
      setRequests([]);
      setActiveTrip(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const tripsQuery = query(
      collection(db, 'trips'),
      where('driverId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      tripsQuery,
      (snapshot) => {
        const trips = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        const accepted = trips.find(
          (trip) =>
            trip.category === category &&
            trip.status === 'accepted'
        );

        const pending = trips
          .filter(
            (trip) =>
              trip.category === category &&
              trip.status === 'requested'
          )
          .sort((a, b) => {
            const first = a.createdAt?.seconds ?? 0;
            const second = b.createdAt?.seconds ?? 0;
            return first - second;
          });

        setActiveTrip(accepted ?? null);
        setRequests(pending);
        setIsLoading(false);
      },
      (snapshotError) => {
        console.error(
          'Error al recibir viajes:',
          snapshotError.code || snapshotError.message
        );

        setError('listenError');
        setRequests([]);
        setActiveTrip(null);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [category]);

  const rejectTrip = useCallback((tripId) => {
    setDismissedIds((previous) =>
      previous.includes(tripId)
        ? previous
        : [...previous, tripId]
    );
  }, []);

  const acceptTrip = useCallback(async (tripId) => {
    if (
      !enabled ||
      !category ||
      isAccepting ||
      activeTrip
    ) {
      return false;
    }

    const user = auth.currentUser;

    if (!user) {
      setError('authError');
      return false;
    }

    setIsAccepting(true);
    setError(null);

    try {
      const tripRef = doc(db, 'trips', tripId);

      const acceptedTrip = await runTransaction(
        db,
        async (transaction) => {
          const snapshot = await transaction.get(tripRef);

          if (!snapshot.exists()) {
            throw new Error('tripUnavailable');
          }

          const trip = snapshot.data();

          if (
            trip.status !== 'requested' ||
            trip.driverId !== user.uid ||
            trip.category !== category
          ) {
            throw new Error('tripUnavailable');
          }

          transaction.update(tripRef, {
            status: 'accepted',
            acceptedAt: serverTimestamp(),
          });

          return {
            id: tripId,
            ...trip,
            status: 'accepted',
          };
        }
      );

      setActiveTrip(acceptedTrip);
      setRequests([]);

      return true;
    } catch (acceptError) {
      console.error(
        'Error al aceptar viaje:',
        acceptError.code || acceptError.message
      );

      setError(
        acceptError.message === 'tripUnavailable'
          ? 'tripUnavailable'
          : 'acceptError'
      );

      return false;
    } finally {
      setIsAccepting(false);
    }
  }, [enabled, category, isAccepting, activeTrip]);

  return {
    requests: enabled && !activeTrip
      ? requests.filter(
          (trip) => !dismissedIds.includes(trip.id)
        )
      : [],
    activeTrip,
    isLoading,
    isAccepting,
    error,
    acceptTrip,
    rejectTrip,
  };
}
