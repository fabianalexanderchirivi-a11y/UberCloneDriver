
 // AI-assisted: see docs/AI_LOG.md #105, #107, #113

import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const DEFAULT_REGION = {
  latitude: 6.33492,
  longitude: -75.55829,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

export default function DriverMap({
  location,
  pickup,
  language = 'es',
}) {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const validLocation =
    location &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude);

  const validPickup =
    pickup &&
    Number.isFinite(pickup.lat) &&
    Number.isFinite(pickup.lng);

  const driverCoordinate = validLocation
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
      }
    : null;

  const pickupCoordinate = validPickup
    ? {
        latitude: pickup.lat,
        longitude: pickup.lng,
      }
    : null;

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    if (driverCoordinate && pickupCoordinate) {
      mapRef.current.fitToCoordinates(
        [driverCoordinate, pickupCoordinate],
        {
          edgePadding: {
            top: 100,
            right: 50,
            bottom: 280,
            left: 50,
          },
          animated: true,
        }
      );
    } else if (driverCoordinate) {
      mapRef.current.animateToRegion(
        {
          ...driverCoordinate,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    } else if (pickupCoordinate) {
      mapRef.current.animateToRegion(
        {
          ...pickupCoordinate,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  }, [
    mapReady,
    driverCoordinate?.latitude,
    driverCoordinate?.longitude,
    pickupCoordinate?.latitude,
    pickupCoordinate?.longitude,
  ]);

  return (
    <View style={styles.container}collapsable={false}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        onMapReady={() => setMapReady(true)}
        showsCompass
        showsUserLocation={false}
      >
        {driverCoordinate && (
          <Marker
            coordinate={driverCoordinate}
            pinColor="#2563EB"
            title={
              language === 'en'
                ? 'My vehicle'
                : 'Mi vehículo'
            }
          />
        )}

        {pickupCoordinate && (
          <Marker
            coordinate={pickupCoordinate}
            pinColor="#34D399"
            title={
              language === 'en'
                ? 'Test pickup'
                : 'Recogida de prueba'
            }
            description={pickup.address}
          />
        )}
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});


