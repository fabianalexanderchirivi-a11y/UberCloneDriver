
 // AI-assisted: see docs/AI_LOG.md #104

export const calculateFare = ({
  distanceKm,
  durationMin,
  baseFare,
  pricePerKm,
  pricePerMin,
  commissionRate,
  minimumFare = 0,
}) => {
  const values = [
    distanceKm,
    durationMin,
    baseFare,
    pricePerKm,
    pricePerMin,
    commissionRate,
    minimumFare,
  ];

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

  if (commissionRate > 1) {
    throw new Error('INVALID_COMMISSION_RATE');
  }

  const calculatedFare =
    baseFare +
    distanceKm * pricePerKm +
    durationMin * pricePerMin;

  const fare = Math.round(
    Math.max(calculatedFare, minimumFare)
  );

  const commission = Math.round(
    fare * commissionRate
  );

  const driverEarnings = fare - commission;

  return {
    fare,
    commission,
    driverEarnings,
  };
};
