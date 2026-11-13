
// AI-assisted: see docs/AI_LOG.md #193

import { useEffect, useState } from 'react';

import { resolveTripLocation } from '../services/geocodingService';
import { getDrivingRoute } from '../services/routingService';
import { calculateFare } from '../utils/calculateFare';

export default function useTripEstimate(trip) {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const tripId = trip?.id;
  const category = trip?.category;

  const originAddress = trip?.origin?.address;
  const originLat = trip?.origin?.lat ?? trip?.origin?.latitude;
  const originLng = trip?.origin?.lng ?? trip?.origin?.longitude;

  const destinationAddress = trip?.destination?.address;
  const destinationLat =
    trip?.destination?.lat ?? trip?.destination?.latitude;
  const destinationLng =
    trip?.destination?.lng ?? trip?.destination?.longitude;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    setEstimate(null);
    setError(false);

    if (!tripId || !category) {
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);

    const calculateEstimate = async () => {
      try {
        const origin = await resolveTripLocation({
          address: originAddress,
          lat: originLat,
          lng: originLng,
        });

        if (cancelled) return;

        const destination = await resolveTripLocation({
          address: destinationAddress,
          lat: destinationLat,
          lng: destinationLng,
        });

        if (cancelled) return;

        const route = await getDrivingRoute(
          origin,
          destination,
          controller.signal
        );

        if (cancelled) return;

        const distanceKm = route.distanceKm;
        const durationMin = route.durationMin;

        const payment = calculateFare({
          distanceKm,
          durationMin,
          category,
          tip: 0,
        });

        setEstimate({
          distanceKm,
          durationMin,
          ...payment,
        });
      } catch (estimateError) {
        if (!cancelled) {
          console.error(
            'Trip estimate:',
            estimateError.code || estimateError.message
          );
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    calculateEstimate();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    tripId,
    category,
    originAddress,
    originLat,
    originLng,
    destinationAddress,
    destinationLat,
    destinationLng,
    retryCount,
  ]);

  return {
    estimate,
    loading,
    error,
    retry: () => setRetryCount((previous) => previous + 1),
  };
}
