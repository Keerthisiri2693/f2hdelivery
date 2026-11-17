
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";

import MapView, {
  Marker,
  Polyline,
  UrlTile,
} from "react-native-maps";

import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// THEME
const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const BORDER = "#FADADD";
const DARK = "#7F1D1D";
const MUTED = "#9F1239";
const SUCCESS = "#22C55E";
const ROUTE = "#F87171";

// OPENSTREETMAP TILE SERVER
const OSM_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// OSRM ROUTING SERVER
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

// LOCATIONS
const pickup = {
  latitude: 13.0878,
  longitude: 80.2785,
};

const drop = {
  latitude: 13.0827,
  longitude: 80.2707,
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

export default function LiveMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const mapRef = useRef<MapView>(null);

  const [driverLocation, setDriverLocation] =
    useState<Coordinate | null>(null);

  const [routeCoords, setRouteCoords] =
    useState<Coordinate[]>([]);

  const [eta, setEta] = useState("Calculating...");

  const [mapReady, setMapReady] = useState(false);

  // LIVE GPS LOCATION
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let mounted = true;

    const startLocationTracking = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 15,
            timeInterval: 5000,
          },
          (location) => {
            if (!mounted) return;

            const currentLocation: Coordinate = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            setDriverLocation(currentLocation);
          }
        );
      } catch (error) {
        console.log("Location error:", error);
      }
    };

    startLocationTracking();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  // OSRM ROUTING
  useEffect(() => {
    let mounted = true;

    const fetchRoute = async () => {
      try {
        const url =
          `${OSRM_URL}/` +
          `${pickup.longitude},${pickup.latitude};` +
          `${drop.longitude},${drop.latitude}` +
          "?overview=full&geometries=geojson";

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Routing server unavailable");
        }

        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
          throw new Error("No route found");
        }

        const route = data.routes[0];

        // OSRM returns [longitude, latitude]
        const points: Coordinate[] =
          route.geometry.coordinates.map(
            ([longitude, latitude]: [number, number]) => ({
              latitude,
              longitude,
            })
          );

        if (!mounted) return;

        setRouteCoords(points);

        const minutes = Math.ceil(route.duration / 60);
        const kilometers = (
          route.distance / 1000
        ).toFixed(2);

        setEta(`${minutes} min • ${kilometers} km`);

        setTimeout(() => {
          if (!mounted || points.length === 0) return;

          mapRef.current?.fitToCoordinates(points, {
            edgePadding: {
              top: 120,
              bottom: 180,
              left: 50,
              right: 50,
            },
            animated: true,
          });
        }, 500);

      } catch (error) {
        console.log("OSRM routing error:", error);

        if (!mounted) return;

        setRouteCoords([pickup, drop]);
        setEta("Approximate route");
      }
    };

    fetchRoute();

    return () => {
      mounted = false;
    };
  }, []);

  // MAP READY
  const onMapReady = () => {
    setMapReady(true);
  };

  // OPEN OSM DIRECTIONS
  const openNavigation = () => {
    const url =
      `https://www.openstreetmap.org/directions?` +
      `engine=fossgis_osrm_car&route=` +
      `${pickup.latitude}%2C${pickup.longitude}%3B` +
      `${drop.latitude}%2C${drop.longitude}`;

    Linking.openURL(url);
  };

  return (
    <View style={styles.safe}>

      {/* HEADER */}
      <View
        style={[
          styles.toolbar,
          {
            paddingTop:
              Platform.OS === "android"
                ? insets.top
                : Math.max(insets.top, 10),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace("/common/dashboard1")
          }
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={PRIMARY}
          />
        </TouchableOpacity>

        <Text style={styles.toolbarTitle}>
          Live Map
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* OPENSTREETMAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: pickup.latitude,
          longitude: pickup.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        onMapReady={onMapReady}
        mapType="none"
        loadingEnabled
        showsCompass
        showsUserLocation={false}
      >

        {/* OSM MAP TILES */}
        <UrlTile
          urlTemplate={OSM_TILE_URL}
          maximumZ={19}
          tileSize={256}
          zIndex={-1}
        />

        {/* PICKUP */}
        <Marker
          coordinate={pickup}
          pinColor={SUCCESS}
          title="Pickup"
          description="Pickup Location"
        />

        {/* DESTINATION */}
        <Marker
          coordinate={drop}
          pinColor={PRIMARY}
          title="Destination"
          description="Delivery Destination"
        />

        {/* DRIVER */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Delivery Driver"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <MaterialCommunityIcons
              name="bike-fast"
              size={36}
              color={PRIMARY}
            />
          </Marker>
        )}

        {/* ROUTE */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor={ROUTE}
            lineCap="round"
            lineJoin="round"
          />
        )}

      </MapView>

      {/* MAP LOADING */}
      {!mapReady && (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>
            Loading OpenStreetMap...
          </Text>
        </View>
      )}

      {/* ETA */}
      <View style={styles.etaCard}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={18}
          color={SUCCESS}
        />

        <Text style={styles.etaText}>
          ETA: {eta}
        </Text>
      </View>

      {/* NAVIGATION */}
      <TouchableOpacity
        style={styles.navBtn}
        onPress={openNavigation}
      >
        <MaterialCommunityIcons
          name="navigation"
          size={20}
          color="#fff"
        />

        <Text style={styles.navText}>
          Open in OpenStreetMap
        </Text>
      </TouchableOpacity>

    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: CARD,
  },

  toolbarTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: DARK,
  },

  map: {
    flex: 1,
  },

  loading: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    backgroundColor: CARD,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },

  loadingText: {
    color: DARK,
    fontWeight: "600",
  },

  etaCard: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },

  etaText: {
    marginLeft: 6,
    fontWeight: "600",
    color: SUCCESS,
  },

  navBtn: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 6,
  },

  navText: {
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
  },
});


