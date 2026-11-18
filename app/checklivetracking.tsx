
import React, { useEffect, useRef, useState } from "react";

import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";



import {
  Text,
  Button,
  Card,
  Chip,
  Divider,
  ActivityIndicator,
  Surface,
} from "react-native-paper";

import * as Location from "expo-location";

import { ref, set, update } from "firebase/database";

import { auth, db } from "../firebase/firebaseConfig";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type RiderCoordinates = {
  latitude: number;
  longitude: number;
};

const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const ACCENT = "#F43F5E";
const SUCCESS = "#22C55E";
const ERROR = "#EF4444";

export default function ActiveRider() {
  const locationSub =
    useRef<Location.LocationSubscription | null>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const [currentLocation, setCurrentLocation] =
    useState<RiderCoordinates | null>(null);

  const [lastUpdated, setLastUpdated] = useState<string>("--");

  const [errorMessage, setErrorMessage] = useState("");

  // Replace with your actual dynamic order ID
  const ORDER_ID = "order_123";

  // --------------------------------------------------
  // STOP LOCATION TRACKING
  // --------------------------------------------------

  const stopLiveTracking = () => {
    if (locationSub.current) {
      locationSub.current.remove();
      locationSub.current = null;
    }

    setIsTracking(false);
  };

  // --------------------------------------------------
  // START LOCATION TRACKING
  // --------------------------------------------------

  const startLiveTracking = async (
    orderId: string,
    riderId: string
  ) => {
    if (locationSub.current) {
      return;
    }

    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      throw new Error(
        "Location permission is required to deliver orders."
      );
    }

    const subscription =
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },

        async (location) => {
          const latitude = location.coords.latitude;
          const longitude = location.coords.longitude;

          try {
            // Update Firebase location
            await update(
              ref(db, `live_locations/${orderId}`),
              {
                lat: latitude,
                lng: longitude,
                riderId: riderId,
                updatedAt: Date.now(),
                status: "active",
              }
            );

            setCurrentLocation({
              latitude,
              longitude,
            });

            setLastUpdated(
              new Date().toLocaleTimeString()
            );

            setErrorMessage("");

            console.log("Rider location updated");
          } catch (error) {
            console.error(
              "Firebase location update failed:",
              error
            );

            setErrorMessage(
              "Unable to update location. Check your internet connection."
            );
          }
        }
      );

    locationSub.current = subscription;

    setIsTracking(true);
  };

  // --------------------------------------------------
  // ASSIGN ORDER AND GO ONLINE
  // --------------------------------------------------

  const assignOrderAndTrack = async () => {
    if (isStarting || isTracking) {
      return;
    }

    const rider = auth.currentUser;

    if (!rider) {
      Alert.alert(
        "Login Required",
        "Please log in as a rider first."
      );
      return;
    }

    const riderId = rider.uid;

    setIsStarting(true);
    setErrorMessage("");

    try {
      // 1. Assign order to rider

      await set(
        ref(db, `riders_active_orders/${riderId}`),
        {
          orderId: ORDER_ID,
          assignedAt: Date.now(),
          status: "active",
        }
      );

      console.log("Order assigned successfully");

      // 2. Start GPS tracking

      await startLiveTracking(
        ORDER_ID,
        riderId
      );

      Alert.alert(
        "Delivery Started",
        "You are online. Your live location is now being shared."
      );
    } catch (error: any) {
      console.error("Rider activation error:", error);

      stopLiveTracking();

      setErrorMessage(
        error?.message || "Unable to start delivery."
      );

      Alert.alert(
        "Unable to Start",
        error?.message || "Something went wrong."
      );
    } finally {
      setIsStarting(false);
    }
  };

  // --------------------------------------------------
  // STOP DELIVERY
  // --------------------------------------------------

  const handleStopTracking = async () => {
    const rider = auth.currentUser;

    stopLiveTracking();

    try {
      if (rider) {
        await update(
          ref(db, `live_locations/${ORDER_ID}`),
          {
            status: "stopped",
            updatedAt: Date.now(),
          }
        );

        await update(
          ref(
            db,
            `riders_active_orders/${rider.uid}`
          ),
          {
            status: "stopped",
            stoppedAt: Date.now(),
          }
        );
      }

      Alert.alert(
        "Tracking Stopped",
        "Your live location sharing has stopped."
      );
    } catch (error) {
      console.error("Stop tracking error:", error);

      Alert.alert(
        "Warning",
        "GPS tracking stopped, but Firebase status could not be updated."
      );
    }
  };

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (locationSub.current) {
        locationSub.current.remove();
        locationSub.current = null;
      }
    };
  }, []);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Rider Dashboard
          </Text>

          <Text style={styles.headerSubtitle}>
            Manage your delivery activity
          </Text>
        </View>

        <Surface style={styles.headerIcon} elevation={0}>
          <Text style={styles.bikeIcon}>🚴</Text>
        </Surface>
      </View>

      {/* RIDER STATUS */}

      <Card style={styles.statusCard} mode="elevated">
        <Card.Content>

          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.smallLabel}>
                RIDER STATUS
              </Text>

              <Text style={styles.statusTitle}>
                {isTracking ? "You're Online" : "You're Offline"}
              </Text>
            </View>

            <Chip
              icon={isTracking ? "check-circle" : "power"}
              style={[
                styles.statusChip,
                {
                  backgroundColor: isTracking
                    ? BG
                    : BG,
                },
              ]}
              textStyle={{
                color: isTracking ? SUCCESS : ACCENT,
                fontWeight: "700",
              }}
            >
              {isTracking ? "ONLINE" : "OFFLINE"}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.statusDescription}>
            {isTracking
              ? "Your location is being shared with the customer."
              : "Start your delivery to share your live location."}
          </Text>

        </Card.Content>
      </Card>

      {/* ORDER INFORMATION */}

      <Text style={styles.sectionTitle}>
        Current Delivery
      </Text>

      <Card style={styles.orderCard} mode="elevated">
        <Card.Content>

          <View style={styles.orderHeader}>
            <View style={styles.orderIcon}>
              <Text style={styles.orderEmoji}>📦</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.orderLabel}>
                ORDER ID
              </Text>

              <Text style={styles.orderId}>
                {ORDER_ID}
              </Text>
            </View>

            <Chip
              compact
              style={styles.orderChip}
              textStyle={styles.orderChipText}
            >
              {isTracking ? "In Progress" : "Assigned"}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Rider
            </Text>

            <Text style={styles.infoValue}>
              {auth.currentUser?.displayName || "Rider"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Tracking
            </Text>

            <Text style={styles.infoValue}>
              {isTracking ? "Active" : "Inactive"}
            </Text>
          </View>

        </Card.Content>
      </Card>

      {/* LIVE LOCATION */}

      <Text style={styles.sectionTitle}>
        Live Location
      </Text>

      <Card style={styles.locationCard} mode="elevated">
        <Card.Content>

          <View style={styles.locationHeader}>
            <Text style={styles.locationTitle}>
              GPS Coordinates
            </Text>

            <Chip
              compact
              icon="crosshairs-gps"
              style={styles.gpsChip}
              textStyle={styles.gpsChipText}
            >
              GPS
            </Chip>
          </View>

          {currentLocation ? (
            <>
              <View style={styles.coordinateBox}>
                <Text style={styles.coordinateLabel}>
                  LATITUDE
                </Text>

                <Text style={styles.coordinateValue}>
                  {currentLocation.latitude.toFixed(6)}
                </Text>
              </View>

              <View style={styles.coordinateBox}>
                <Text style={styles.coordinateLabel}>
                  LONGITUDE
                </Text>

                <Text style={styles.coordinateValue}>
                  {currentLocation.longitude.toFixed(6)}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyLocation}>
              <Text style={styles.emptyLocationText}>
                Location not available yet
              </Text>
            </View>
          )}

          <Divider style={styles.divider} />

          <View style={styles.lastUpdatedRow}>
            <Text style={styles.infoLabel}>
              Last updated
            </Text>

            <Text style={styles.updatedValue}>
              {lastUpdated}
            </Text>
          </View>

        </Card.Content>
      </Card>

      {/* ERROR MESSAGE */}

      {!!errorMessage && (
        <Surface style={styles.errorBox} elevation={0}>
          <Text style={styles.errorText}>
            ⚠ {errorMessage}
          </Text>
        </Surface>
      )}

      {/* ACTION BUTTONS */}

      <Text style={styles.sectionTitle}>
        Delivery Actions
      </Text>

      {!isTracking ? (
        <Button
          mode="contained"
          icon="bike-fast"
          onPress={assignOrderAndTrack}
          loading={isStarting}
          disabled={isStarting}
          style={styles.startButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {isStarting
            ? "Starting Delivery..."
            : "Assign Order & Go Online"}
        </Button>
      ) : (
        <Button
          mode="contained"
          icon="stop-circle-outline"
          onPress={handleStopTracking}
          style={styles.stopButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Stop Live Tracking
        </Button>
      )}

      {isTracking && (
        <View style={styles.trackingIndicator}>
          <ActivityIndicator
            size="small"
            color={SUCCESS}
          />

          <Text style={styles.trackingText}>
            Sending location updates every 5 seconds or after 5 meters of movement
          </Text>
        </View>
      )}

      {/* FOOTER */}

      <Text style={styles.footer}>
        F2H Delivery • Rider Location Management
      </Text>

    </ScrollView>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    padding: 18,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 8,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: PRIMARY,
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#8A6269",
    marginTop: 5,
  },

  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: CARD,
    justifyContent: "center",
    alignItems: "center",
  },

  bikeIcon: {
    fontSize: 27,
  },

  statusCard: {
    backgroundColor: CARD,
    borderRadius: 18,
  },

  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  smallLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: ACCENT,
    letterSpacing: 1,
  },

  statusTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: PRIMARY,
    marginTop: 7,
  },

  statusChip: {
    borderRadius: 10,
  },

  divider: {
    marginVertical: 16,
    backgroundColor: "#F8D8DE",
  },

  statusDescription: {
    color: "#805C64",
    fontSize: 13,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: PRIMARY,
    marginTop: 24,
    marginBottom: 12,
  },

  orderCard: {
    borderRadius: 17,
    backgroundColor: CARD,
  },

  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
  },

  orderEmoji: {
    fontSize: 23,
  },

  orderLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: ACCENT,
  },

  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: PRIMARY,
    marginTop: 4,
  },

  orderChip: {
    backgroundColor: BG,
  },

  orderChipText: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: "700",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  infoLabel: {
    color: "#98777D",
    fontSize: 13,
  },

  infoValue: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: "700",
  },

  locationCard: {
    backgroundColor: CARD,
    borderRadius: 17,
  },

  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  locationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: PRIMARY,
  },

  gpsChip: {
    backgroundColor: BG,
  },

  gpsChipText: {
    color: SUCCESS,
    fontWeight: "700",
    fontSize: 11,
  },

  coordinateBox: {
    backgroundColor: BG,
    borderRadius: 11,
    padding: 13,
    marginBottom: 10,
  },

  coordinateLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#819087",
    letterSpacing: 1,
  },

  coordinateValue: {
    fontSize: 18,
    fontWeight: "800",
    color: PRIMARY,
    marginTop: 5,
    fontVariant: ["tabular-nums"],
  },

  emptyLocation: {
    padding: 20,
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 12,
  },

  emptyLocationText: {
    color: "#98777D",
    fontSize: 13,
  },

  lastUpdatedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  updatedValue: {
    fontSize: 12,
    fontWeight: "700",
    color: SUCCESS,
  },

  errorBox: {
    padding: 13,
    borderRadius: 11,
    marginTop: 16,
    backgroundColor: BG,
  },

  errorText: {
    color: ERROR,
    fontSize: 12,
    lineHeight: 19,
  },

  startButton: {
    backgroundColor: SUCCESS,
    borderRadius: 13,
  },

  stopButton: {
    backgroundColor: ERROR,
    borderRadius: 13,
  },

  buttonContent: {
    height: 54,
  },

  buttonLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: CARD,
  },

  trackingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 15,
    paddingHorizontal: 8,
  },

  trackingText: {
    fontSize: 11,
    color: SUCCESS,
    flex: 1,
    lineHeight: 17,
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#A17D84",
    marginTop: 28,
  },
});
