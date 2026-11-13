
// AI-assisted: see docs/AI_LOG.md #209

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';

const number = (value) =>
  typeof value === 'number' && Number.isFinite(value)
    ? value
    : 0;

const dateOf = (value) => {
  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  if (value instanceof Date) return value;

  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
};

const periodStarts = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const week = new Date(today);
  const dayOfWeek = (week.getDay() + 6) % 7;
  week.setDate(week.getDate() - dayOfWeek);

  const month = new Date(today);
  month.setDate(1);

  return { today, week, month };
};

const emptyTotals = () => ({
  count: 0,
  fare: 0,
  commission: 0,
  tips: 0,
  earnings: 0,
  average: 0,
});

const calculateTotals = (trips) => {
  const totals = trips.reduce((acc, trip) => {
    acc.count += 1;
    acc.fare += number(trip.fare);
    acc.commission += number(trip.commission);
    acc.tips += number(trip.tip);
    acc.earnings += number(trip.driverEarnings);
    return acc;
  }, emptyTotals());

  totals.average = totals.count
    ? Math.round(totals.earnings / totals.count)
    : 0;

  return totals;
};

export default function useEarnings() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Se actualiza la referencia del día al recibir datos.
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    const uid = auth.currentUser?.uid;

    if (!uid) {
      setError('SESSION_REQUIRED');
      setLoading(false);
      return;
    }

    const tripsQuery = query(
      collection(db, 'trip'),
      where('driverId', '==', uid)
    );

    return onSnapshot(
      tripsQuery,
      (snapshot) => {
        const records = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter((trip) => trip.status === 'paid');

        setTrips(records);
        setClock(Date.now());
        setError(null);
        setLoading(false);
      },
      (snapshotError) => {
        console.error(
          'useEarnings:',
          snapshotError.code || snapshotError.message
        );
        setError(snapshotError.code || 'EARNINGS_ERROR');
        setLoading(false);
      }
    );
  }, []);

  const summary = useMemo(() => {
    const { today, week, month } = periodStarts();

    const withDates = trips.map((trip) => ({
      ...trip,
      earningsDate:
        dateOf(trip.paidAt) ??
        dateOf(trip.completedAt) ??
        dateOf(trip.createdAt),
    }));

    const totals = {
      day: calculateTotals(
        withDates.filter((trip) =>
          trip.earningsDate &&
          trip.earningsDate >= today
        )
      ),
      week: calculateTotals(
        withDates.filter((trip) =>
          trip.earningsDate &&
          trip.earningsDate >= week
        )
      ),
      month: calculateTotals(
        withDates.filter((trip) =>
          trip.earningsDate &&
          trip.earningsDate >= month
        )
      ),
    };

    // Saldo de la plataforma:
    // Stripe aporta la ganancia neta del conductor.
    // En efectivo, el conductor ya recibió el dinero;
    // la plataforma le descuenta solamente la comisión.
    const balance = trips.reduce((acc, trip) => {
      if (trip.paymentMethod === 'cash') {
        return acc - number(trip.commission);
      }

      if (
        trip.paymentMethod === 'stripe' ||
        trip.paymentMethod === 'mercadopago'
      ) {
        return acc + number(trip.driverEarnings);
      }

      return acc;
    }, 0);

    const cashCommissionDebt = trips
      .filter((trip) => trip.paymentMethod === 'cash')
      .reduce(
        (total, trip) => total + number(trip.commission),
        0
      );

    return {
      ...totals,
      balance,
      cashCommissionDebt,
      totalPaidTrips: trips.length,
    };
  }, [trips, clock]);

  return {
    summary,
    loading,
    error,
  };
}
