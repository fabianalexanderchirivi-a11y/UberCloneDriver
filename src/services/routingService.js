
// AI-assisted: see docs/AI_LOG.md #170

import { OSRM_CONFIG } from '../config/osrm';

export async function getDrivingRoute(start, end, signal) {
  const coordinates =
    `${start.longitude},${start.latitude};` +
    `${end.longitude},${end.latitude}`;

  const url =
    `${OSRM_CONFIG.baseUrl}/route/v1/` +
    `${OSRM_CONFIG.profile}/${coordinates}` +
    '?overview=full&geometries=geojson';

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    OSRM_CONFIG.timeoutMs
  );

  const abortRequest = () => controller.abort();

  if (signal) {
    signal.addEventListener('abort', abortRequest, {
      once: true,
    });
  }

  try {
    if (signal?.aborted) {
      controller.abort();
    }

    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`OSRM HTTP ${response.status}`);
    }

    const data = await response.json();
    const route = data.routes?.[0];

    if (
      data.code !== 'Ok' ||
      !Array.isArray(route?.geometry?.coordinates) ||
      route.geometry.coordinates.length < 2
    ) {
      throw new Error('OSRM_ROUTE_NOT_FOUND');
    }

    return {
      coordinates: route.geometry.coordinates.map(
        ([longitude, latitude]) => ({
          latitude,
          longitude,
        })
      ),
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60,
    };
  } finally {
    clearTimeout(timeout);

    if (signal) {
      signal.removeEventListener('abort', abortRequest);
    }
  }
}
