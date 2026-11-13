
/*
 * AI-assisted: see docs/AI_LOG.md #195, #196, #197, #200, #208
 * Backend UberCloneDriver
 * Firebase Admin + Stripe Sandbox + pago en efectivo
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const {
  initializeApp,
  applicationDefault,
} = require('firebase-admin/app');

const {
  getFirestore,
  FieldValue,
} = require('firebase-admin/firestore');

const {
  getAuth,
} = require('firebase-admin/auth');

const startAutoAssignTrips = require('./autoAssignTrips');

const app = express();

const PORT = Number(process.env.PORT || 3000);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const BASE_URL = (
  process.env.SERVER_PUBLIC_URL ||
  `http://localhost:${PORT}`
).replace(/\/$/, '');

if (!STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
  throw new Error('Configura STRIPE_SECRET_KEY de prueba');
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error('Configura GOOGLE_APPLICATION_CREDENTIALS');
}

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();
const stripe = new Stripe(STRIPE_SECRET_KEY);

// Asignar automáticamente solicitudes a conductores disponibles.
startAutoAssignTrips(db);

// Tarifas del proyecto.
const PRICING = {
  baseFare: 3500,
  pricePerKm: 1200,
  pricePerMin: 250,
  minimumFare: 6000,
  commissionRate: 0.20,
  multipliers: {
    economy: 1,
    xl: 1.4,
    premium: 1.8,
  },
};

// Fórmula de la profesora.
function calculateFare(distanceKm, durationMin, category) {
  const multiplier = PRICING.multipliers[category];

  if (
    multiplier === undefined ||
    !Number.isFinite(distanceKm) ||
    !Number.isFinite(durationMin) ||
    distanceKm <= 0 ||
    durationMin <= 0 ||
    distanceKm > 500 ||
    durationMin > 1440
  ) {
    throw new Error('INVALID_ESTIMATE');
  }

  const subtotal =
    PRICING.baseFare +
    distanceKm * PRICING.pricePerKm +
    durationMin * PRICING.pricePerMin;

  const fare = Math.round(
    Math.max(
      subtotal * multiplier,
      PRICING.minimumFare
    ) / 100
  ) * 100;

  const commission = Math.round(
    fare * PRICING.commissionRate
  );

  return {
    distanceKm,
    durationMin,
    fare,
    commission,
    tip: 0,
    driverEarnings: fare - commission,
    commissionRate: PRICING.commissionRate,
  };
}

// Verificar usuario autenticado en Firebase.
async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization
      ?.replace(/^Bearer /, '');

    if (!token) {
      return res.status(401).json({
        error: 'MISSING_TOKEN',
      });
    }

    req.user = await getAuth().verifyIdToken(token);

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
    });
  }
}

// Verificar que el viaje pertenece al conductor.
async function getOwnedTrip(tripId, uid) {
  if (
    typeof tripId !== 'string' ||
    !tripId ||
    tripId.includes('/')
  ) {
    throw new Error('INVALID_TRIP_ID');
  }

  const ref = db.collection('trip').doc(tripId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error('TRIP_NOT_FOUND');
  }

  const trip = snapshot.data();

  if (trip.driverId !== uid) {
    throw new Error('NOT_ALLOWED');
  }

  return { ref, trip };
}

// Stripe confirma el pago, no el celular.
async function confirmSession(tripId, session) {
  if (
    session.metadata?.tripId !== tripId ||
    session.mode !== 'payment' ||
    session.livemode ||
    session.payment_status !== 'paid'
  ) {
    return false;
  }

  const ref = db.collection('trip').doc(tripId);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists) {
      throw new Error('TRIP_NOT_FOUND');
    }

    const trip = snapshot.data();

    if (
      trip.paymentSessionId !== session.id ||
      trip.driverId !== session.metadata.driverId ||
      session.currency !== 'cop' ||
      session.amount_total !== trip.fare * 100
    ) {
      throw new Error('PAYMENT_MISMATCH');
    }

    if (trip.status === 'paid') {
      return;
    }

    if (trip.status !== 'completed') {
      throw new Error('INVALID_TRIP_STATUS');
    }

    transaction.update(ref, {
      status: 'paid',
      paymentStatus: 'approved',
      paymentMethod: 'stripe',
      paymentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || session.id,
      paidAt: FieldValue.serverTimestamp(),
    });
  });

  return true;
}

// Webhook de Stripe.
// Debe estar antes de express.json().
app.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      return res.status(503).send(
        'Webhook no configurado'
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        secret
      );
    } catch {
      return res.status(400).send('Firma inválida');
    }

    try {
      if (
        event.type === 'checkout.session.completed' ||
        event.type ===
          'checkout.session.async_payment_succeeded'
      ) {
        const session = event.data.object;
        const tripId = session.metadata?.tripId;

        if (tripId) {
          const verified =
            await stripe.checkout.sessions.retrieve(
              session.id
            );

          await confirmSession(tripId, verified);
        }
      }

      return res.json({ received: true });
    } catch (error) {
      console.error(
        'Stripe webhook:',
        error.message
      );

      return res.status(500).send(
        'Error al confirmar pago'
      );
    }
  }
);

app.use(cors());
app.use(express.json());

// Comprobar backend.
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'UberCloneDriver Backend',
    stripeMode: 'test',
    cashEnabled: true,
  });
});

// Comprobar conexiones.
app.get('/health/services', async (req, res) => {
  try {
    await db.collection('trip').limit(1).get();
    await stripe.balance.retrieve();

    res.json({
      ok: true,
      firebase: 'connected',
      stripe: 'connected',
    });
  } catch (error) {
    console.error('Services:', error.message);

    res.status(503).json({
      ok: false,
      error: 'SERVICE_CONNECTION_FAILED',
    });
  }
});

// Crear pago de prueba con Stripe.
app.post(
  '/payments/create',
  requireAuth,
  async (req, res) => {
    try {
      const {
        tripId,
        distanceKm,
        durationMin,
      } = req.body;

      const { ref, trip } = await getOwnedTrip(
        tripId,
        req.user.uid
      );

      if (trip.status === 'paid') {
        return res.status(409).json({
          error: 'ALREADY_PAID',
        });
      }

      if (trip.status !== 'completed') {
        return res.status(409).json({
          error: 'TRIP_NOT_COMPLETED',
        });
      }

      // No permitir Stripe si se eligió efectivo.
      if (trip.paymentMethod === 'cash') {
        return res.status(409).json({
          error: 'NOT_STRIPE_TRIP',
        });
      }

      // Reutilizar un Checkout ya creado.
      if (trip.paymentSessionId) {
        const existing =
          await stripe.checkout.sessions.retrieve(
            trip.paymentSessionId
          );

        if (existing.payment_status === 'paid') {
          await confirmSession(tripId, existing);

          return res.json({
            alreadyPaid: true,
          });
        }

        if (
          existing.status === 'open' &&
          existing.url
        ) {
          return res.json({
            url: existing.url,
          });
        }

        if (existing.status === 'complete') {
          return res.status(409).json({
            error: 'PAYMENT_PROCESSING',
          });
        }
      }

      const payment = calculateFare(
        distanceKm,
        durationMin,
        trip.category
      );

      const session =
        await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [
            {
              price_data: {
                currency: 'cop',
                unit_amount: payment.fare * 100,
                product_data: {
                  name: 'Viaje UberCloneDriver',
                  description: `Viaje ${tripId}`,
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            tripId,
            driverId: req.user.uid,
          },
          success_url:
            `${BASE_URL}/payment-result?result=success`,
          cancel_url:
            `${BASE_URL}/payment-result?result=cancel`,
        });

      await ref.update({
        ...payment,
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
        paymentSessionId: session.id,
        paymentId: null,
      });

      return res.json({
        url: session.url,
      });
    } catch (error) {
      console.error(
        'Create payment:',
        error.message
      );

      return res.status(400).json({
        error:
          error.message === 'INVALID_ESTIMATE'
            ? 'INVALID_ESTIMATE'
            : 'PAYMENT_CREATE_FAILED',
      });
    }
  }
);

// Confirmar pago en efectivo.
// AI-assisted: see docs/AI_LOG.md #208
app.post(
  '/payments/cash',
  requireAuth,
  async (req, res) => {
    try {
      const {
        tripId,
        distanceKm,
        durationMin,
      } = req.body;

      const { ref } = await getOwnedTrip(
        tripId,
        req.user.uid
      );

      const result = await db.runTransaction(
        async (transaction) => {
          const snapshot =
            await transaction.get(ref);

          if (
            !snapshot.exists ||
            snapshot.data().driverId !== req.user.uid
          ) {
            throw new Error('NOT_ALLOWED');
          }

          const trip = snapshot.data();

          // Evitar registrar dos veces el efectivo.
          if (trip.status === 'paid') {
            if (trip.paymentMethod === 'cash') {
              return {
                status: 'approved',
                alreadyPaid: true,
              };
            }

            throw new Error('ALREADY_PAID');
          }

          // El recorrido debe estar terminado.
          if (trip.status !== 'completed') {
            throw new Error('TRIP_NOT_COMPLETED');
          }

          // Solo viajes creados como efectivo.
          if (trip.paymentMethod !== 'cash') {
            throw new Error('NOT_CASH_TRIP');
          }

          // No permitir efectivo si existe pago Stripe.
          if (trip.paymentSessionId) {
            throw new Error('STRIPE_PAYMENT_EXISTS');
          }

          const payment = calculateFare(
            distanceKm,
            durationMin,
            trip.category
          );

          transaction.update(ref, {
            ...payment,
            status: 'paid',
            paymentMethod: 'cash',
            paymentStatus: 'cash',
            paymentId: null,
            paidAt: FieldValue.serverTimestamp(),
          });

          return {
            status: 'approved',
            alreadyPaid: false,
          };
        }
      );

      return res.json(result);
    } catch (error) {
      console.error(
        'Cash payment:',
        error.message
      );

      const conflicts = [
        'ALREADY_PAID',
        'TRIP_NOT_COMPLETED',
        'NOT_CASH_TRIP',
        'STRIPE_PAYMENT_EXISTS',
      ];

      return res.status(
        conflicts.includes(error.message)
          ? 409
          : 400
      ).json({
        error:
          error.message === 'INVALID_ESTIMATE'
            ? 'INVALID_ESTIMATE'
            : conflicts.includes(error.message)
              ? error.message
              : 'CASH_PAYMENT_FAILED',
      });
    }
  }
);

// Verificar pago Stripe.
app.post(
  '/payments/verify',
  requireAuth,
  async (req, res) => {
    try {
      const { tripId } = req.body;

      const { trip } = await getOwnedTrip(
        tripId,
        req.user.uid
      );

      if (trip.status === 'paid') {
        return res.json({
          status: 'approved',
        });
      }

      if (!trip.paymentSessionId) {
        return res.json({
          status: 'not_started',
        });
      }

      const session =
        await stripe.checkout.sessions.retrieve(
          trip.paymentSessionId
        );

      if (session.payment_status === 'paid') {
        await confirmSession(tripId, session);

        return res.json({
          status: 'approved',
        });
      }

      return res.json({
        status:
          session.status === 'expired'
            ? 'expired'
            : 'pending',
      });
    } catch (error) {
      console.error(
        'Verify payment:',
        error.message
      );

      return res.status(400).json({
        error: 'PAYMENT_VERIFY_FAILED',
      });
    }
  }
);

// Página de retorno de Stripe.
app.get('/payment-result', (req, res) => {
  const success = req.query.result === 'success';

  res.type('html').send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        >
        <meta charset="utf-8">
        <title>UberCloneDriver</title>
      </head>
      <body style="
        font-family: Arial;
        text-align: center;
        padding: 40px;
        background: #f6f6f6;
      ">
        <h2>${
          success
            ? 'Stripe terminó el proceso de pago'
            : 'Pago cancelado'
        }</h2>
        <p>
          Regresa a UberCloneDriver y pulsa
          "Verificar pago".
        </p>
        <p>
          La aplicación consultará el resultado
          directamente con Stripe.
        </p>
      </body>
    </html>
  `);
});

// Iniciar servidor.
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `UberCloneDriver Backend: http://localhost:${PORT}`
  );
});
