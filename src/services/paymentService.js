
// AI-assisted: see docs/AI_LOG.md #197, #208

import { auth } from '../config/firebase';

// Mantén aquí la IP de tu computador.
// El celular y el computador deben estar en la misma red.
const BACKEND_URL = 'http://10.157.4.37:3000';

async function paymentRequest(path, payload) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('SESSION_REQUIRED');
  }

  const token = await user.getIdToken();

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(
      `${BACKEND_URL}${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || 'PAYMENT_REQUEST_FAILED'
      );
    }

    return result;
  } finally {
    clearTimeout(timeout);
  }
}

// Crear pago Stripe Sandbox.
export async function createStripePayment(
  tripId,
  estimate
) {
  if (!estimate) {
    throw new Error('ESTIMATE_REQUIRED');
  }

  return paymentRequest('/payments/create', {
    tripId,
    distanceKm: estimate.distanceKm,
    durationMin: estimate.durationMin,
  });
}

// Consultar si Stripe confirmó el pago.
export async function verifyStripePayment(tripId) {
  return paymentRequest('/payments/verify', {
    tripId,
  });
}

// Confirmar dinero recibido en efectivo.
export async function confirmCashPayment(
  tripId,
  estimate
) {
  if (!estimate) {
    throw new Error('ESTIMATE_REQUIRED');
  }

  return paymentRequest('/payments/cash', {
    tripId,
    distanceKm: estimate.distanceKm,
    durationMin: estimate.durationMin,
  });
}
