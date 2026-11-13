
// AI-assisted: see docs/AI_LOG.md #105, #107, #113, #171, #175

import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const DEFAULT_REGION = {
  latitude: 6.33492,
  longitude: -75.55829,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

const toCoordinate = (point) => {
  const latitude = point?.latitude ?? point?.lat;
  const longitude = point?.longitude ?? point?.lng;

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return null;
  }

  return { latitude, longitude };
};

export default function DriverMap({
  location,
  pickup,
  destination,
  routeCoordinates = [],
  simulatedLocation,
  vehicleHeading = 0,
  followVehicle = false,
  language = 'es',
}) {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const driverCoordinate =
    toCoordinate(simulatedLocation) ??
    toCoordinate(location);

  const pickupCoordinate = toCoordinate(pickup);
  const destinationCoordinate = toCoordinate(destination);

  const points = Array.isArray(routeCoordinates)
    ? routeCoordinates.map(toCoordinate).filter(Boolean)
    : [];

  const first = points[0];
  const last = points[points.length - 1];

  const driverLatitude = driverCoordinate?.latitude;
  const driverLongitude = driverCoordinate?.longitude;

  const simulationLatitude = simulatedLocation?.latitude;
  const simulationLongitude = simulatedLocation?.longitude;

  // Ajusta el mapa cuando se recibe una ruta nueva.
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (followVehicle && simulatedLocation) return;

    const visiblePoints = points.length >= 2
      ? points
      : [
          driverCoordinate,
          pickupCoordinate,
          destinationCoordinate,
        ].filter(Boolean);

    if (visiblePoints.length >= 2) {
      mapRef.current.fitToCoordinates(visiblePoints, {
        edgePadding: {
          top: 75,
          right: 45,
          bottom: 90,
          left: 45,
        },
        animated: true,
      });
    } else if (visiblePoints.length === 1) {
      mapRef.current.animateToRegion(
        {
          ...visiblePoints[0],
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        },
        500
      );
    }
  }, [
    mapReady,
    first?.latitude,
    first?.longitude,
    last?.latitude,
    last?.longitude,
    points.length,
    pickupCoordinate?.latitude,
    pickupCoordinate?.longitude,
    destinationCoordinate?.latitude,
    destinationCoordinate?.longitude,
    followVehicle,
    Boolean(simulatedLocation),
    !first ? driverLatitude : null,
    !first ? driverLongitude : null,
  ]);

  // Sigue al vehículo durante el recorrido.
  useEffect(() => {
    if (
      !mapReady ||
      !followVehicle ||
      !mapRef.current ||
      !Number.isFinite(simulationLatitude) ||
      !Number.isFinite(simulationLongitude)
    ) {
      return;
    }

    mapRef.current.animateCamera(
      {
        center: {
          latitude: simulationLatitude,
          longitude: simulationLongitude,
        },
        heading: vehicleHeading,
        pitch: 45,
        zoom: 17,
      },
      { duration: 250 }
    );
  }, [
    mapReady,
    followVehicle,
    simulationLatitude,
    simulationLongitude,
    vehicleHeading,
  ]);

  return (
    <View style={styles.container} collapsable={false}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        onMapReady={() => setMapReady(true)}
        showsCompass
        showsUserLocation={false}
      >
        {points.length >= 2 && (
          <Polyline
            coordinates={points}
            strokeColor="#2563EB"
            strokeWidth={5}
          />
        )}

        {driverCoordinate && (
          <Marker
            coordinate={driverCoordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
            rotation={vehicleHeading}
            tracksViewChanges={Boolean(simulatedLocation)}
            title={
              language === 'en'
                ? 'My vehicle'
                : 'Mi vehículo'
            }
          >
            <View style={styles.vehicleMarker}>
              <View style={styles.vehicleFront} />
              <View style={styles.windshield} />
              <View style={styles.vehicleRoof} />
              <View style={styles.rearWindow} />
            </View>
          </Marker>
        )}

        {pickupCoordinate && (
          <Marker
            coordinate={pickupCoordinate}
            pinColor="#34D399"
            title={
              language === 'en'
                ? 'Pickup'
                : 'Recogida'
            }
            description={pickup?.address}
          />
        )}

        {destinationCoordinate && (
          <Marker
            coordinate={destinationCoordinate}
            pinColor="#EF4444"
            title={
              language === 'en'
                ? 'Destination'
                : 'Destino'
            }
            description={destination?.address}
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
  vehicleMarker: {
    width: 27,
    height: 44,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 5,
  },
  vehicleFront: {
    width: 15,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#BFDBFE',
  },
  windshield: {
    width: 19,
    height: 7,
    borderRadius: 3,
    backgroundColor: '#93C5FD',
  },
  vehicleRoof: {
    width: 18,
    height: 13,
    borderRadius: 4,
    backgroundColor: '#1D4ED8',
  },
  rearWindow: {
    width: 19,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#93C5FD',
  },
});
