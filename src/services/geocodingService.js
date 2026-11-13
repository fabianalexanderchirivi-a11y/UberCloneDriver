
// AI-assisted: see docs/AI_LOG.md #186

import * as Location from 'expo-location';

const validCoordinate = (latitude, longitude) =>
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  Math.abs(latitude) <= 90 &&
  Math.abs(longitude) <= 180;

export async function resolveTripLocation(place) {
  if (!place) {
    throw new Error('MISSING_LOCATION');
  }

  const latitude = place.latitude ?? place.lat;
  const longitude = place.longitude ?? place.lng;

  // Conservar las coordenadas que ya existan en Firestore.
  if (validCoordinate(latitude, longitude)) {
    return { latitude, longitude };
  }

  const address = place.address?.trim();

  if (!address) {
    throw new Error('MISSING_ADDRESS');
  }

  // Android necesita permiso de ubicación para geocodeAsync.
  const permission =
    await Location.getForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error('LOCATION_PERMISSION_REQUIRED');
  }

  // Añadir contexto geográfico a las búsquedas de prueba.
  const query = /colombia/i.test(address)
    ? address
    : `${address}, Colombia`;

  const results = await Location.geocodeAsync(query);

  const match = results.find((result) =>
    validCoordinate(result.latitude, result.longitude)
  );

  if (!match) {
    throw new Error('LOCATION_NOT_FOUND');
  }

  return {
    latitude: match.latitude,
    longitude: match.longitude,
  };
}
