
// AI-assisted: see docs/AI_LOG.md #104, #137

import { PRICING } from '../config/pricing';

export const calculateFare = ({
  distanceKm,
  durationMin,
  category,
  tip = 0,
}) => {
  const values = [distanceKm, durationMin, tip];

  if (
    values.some(
      (value) =>
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < 0
    )
  ) {
    throw new Error('INVALID_FARE_VALUES');
  }

  if (!Number.isInteger(tip)) {
    throw new Error('INVALID_TIP');
  }

  const multiplier = PRICING.multipliers[category];

  if (multiplier === undefined) {
    throw new Error('INVALID_CATEGORY');
  }

  const subtotal =
    PRICING.baseFare +
    distanceKm * PRICING.pricePerKm +
    durationMin * PRICING.pricePerMin;

  const calculatedFare = subtotal * multiplier;

  const fare = Math.round(
    Math.max(calculatedFare, PRICING.minimumFare) / 100
  ) * 100;

  const commission = Math.round(
    fare * PRICING.commissionRate
  );

  const driverEarnings = fare - commission + tip;

  return {
    fare,
    commission,
    driverEarnings,
  };
};
