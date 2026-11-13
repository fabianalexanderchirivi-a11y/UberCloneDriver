import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import * as Location from 'expo-location';
import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';

export default function useDriverLocation(enabled) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const sharingRef = useRef(false);
  const lastLocationRef = useRef(null);
  const writeQueueRef = useRef(Promise.resolve());
  const sessionRef = useRef(null);

  const saveLocation = useCallback((data) => {
    const user = auth.currentUser;

    if (!user) {
      return Promise.reject(
        new Error('No hay usuario autenticado')
      );
    }

    const registrationRef = doc(
      db,
      'driverLocations',
      user.uid
    );

    const operation = writeQueueRef.current
      .catch(() => {})
      .then(() =>
        setDoc(
          registrationRef,
          {
            uid: user.uid,
            ...data,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        )
      );

    writeQueueRef.current = operation.catch(() => {});

    return operation;
  }, []);

  const stopSharing = useCallback(async () => {
    if (!sharingRef.current) return;

    sharingRef.current = false;

    const coordinates = lastLocationRef.current;

    if (!coordinates) return;

    try {
      await saveLocation({
        ...coordinates,
        isAvailable: false,
      });
    } catch (saveError) {
      console.error(
        'Error al desactivar ubicación:',
        saveError.code || saveError.message
      );

      throw saveError;
    }
  }, [saveLocation]);

  useEffect(() => {
    let active = true;
    let subscription = null;

    if (!enabled) {
      setLocation(null);
      setError(null);
      setIsLocating(false);

      stopSharing().catch(() => {});

      return () => {
        active = false;
      };
    }

    const sessionId = Symbol('driverLocation');
    sessionRef.current = sessionId;

    const startTracking = async () => {
      setIsLocating(true);
      setError(null);

      try {
        const permission =
          await Location.requestForegroundPermissionsAsync();

        if (!active) return;

        if (permission.status !== 'granted') {
          setError('permissionDenied');
          setIsLocating(false);
          return;
        }

        const servicesEnabled =
          await Location.hasServicesEnabledAsync();

        if (!active) return;

        if (!servicesEnabled) {
          setError('locationDisabled');
          setIsLocating(false);
          return;
        }

        const currentLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

        if (!active) return;

        const initialCoordinates = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy ?? null,
        };

        lastLocationRef.current = initialCoordinates;

        setLocation({
          ...initialCoordinates,
          timestamp: currentLocation.timestamp,
        });

        sharingRef.current = true;

        try {
          await saveLocation({
            ...initialCoordinates,
            isAvailable: true,
          });
        } catch (saveError) {
          if (!active) return;

          console.error(
            'Error al guardar ubicación:',
            saveError.code || saveError.message
          );

          sharingRef.current = false;
          setError('syncError');
          setIsLocating(false);
          return;
        }

        if (!active || !sharingRef.current) {
          await stopSharing().catch(() => {});
          return;
        }

        setIsLocating(false);

        const watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
            timeInterval: 5000,
          },
          (newLocation) => {
            if (
              !active ||
              !sharingRef.current ||
              sessionRef.current !== sessionId
            ) {
              return;
            }

            const coordinates = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              accuracy: newLocation.coords.accuracy ?? null,
            };

            lastLocationRef.current = coordinates;

            setLocation({
              ...coordinates,
              timestamp: newLocation.timestamp,
            });

            saveLocation({
              ...coordinates,
              isAvailable: true,
            }).catch((saveError) => {
              if (!active || !sharingRef.current) return;

              console.error(
                'Error al actualizar ubicación:',
                saveError.code || saveError.message
              );

              setError('syncError');
            });
          },
          () => {
            if (!active) return;

            setError('locationError');
            setIsLocating(false);
          }
        );

        if (!active || !sharingRef.current) {
          watcher.remove();
          return;
        }

        subscription = watcher;
      } catch (trackingError) {
        if (!active) return;

        console.error(
          'Error de ubicación:',
          trackingError.code || trackingError.message
        );

        setError('locationError');
        setIsLocating(false);
      }
    };

    startTracking();

    return () => {
      active = false;

      if (sessionRef.current === sessionId) {
        sessionRef.current = null;
      }

      if (subscription) {
        subscription.remove();
      }

      stopSharing().catch(() => {});
    };
  }, [enabled, saveLocation, stopSharing]);

  return {
    location,
    error,
    isLocating,
    stopSharing,
  };
}
