import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { ref, update, onValue, off } from "firebase/database";
import { auth, db } from "../../f2hdelivery/app/firebase/firebaseConfig";

export default function RiderHome() {
  const locationSub = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    fetchActiveOrderAndStartTracking();

    return () => {
      stopLiveTracking();
    };
  }, []);

  /* 🔍 GET RIDER ACTIVE ORDER */
  const fetchActiveOrderAndStartTracking = () => {
    const riderId = auth.currentUser?.uid;

    if (!riderId) {
      Alert.alert("Error", "Rider not logged in");
      return;
    }

    // 🔴 This node must be set when order is assigned to rider
    const activeOrderRef = ref(db, `riders_active_orders/${riderId}`);

    onValue(activeOrderRef, (snapshot) => {
      if (snapshot.exists()) {
        const { orderId } = snapshot.val();
        startLiveTracking(orderId, riderId);
      }
    });
  };

  /* 📍 START LIVE TRACKING */
  const startLiveTracking = async (orderId: string, riderId: string) => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Location access is required to deliver orders"
      );
      return;
    }

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // every 5 seconds
        distanceInterval: 5, // or every 5 meters
      },
      async (location) => {
        const { latitude, longitude } = location.coords;

        await update(ref(db, `live_locations/${orderId}`), {
          lat: latitude,
          lng: longitude,
          riderId: riderId,
          updatedAt: Date.now(),
        });

        console.log("📍 Rider live location updated");
      }
    );
  };

  /* ⛔ STOP LIVE TRACKING */
  const stopLiveTracking = () => {
    if (locationSub.current) {
      locationSub.current.remove();
      locationSub.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚴 Live tracking active</Text>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3FAF6",
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B4332",
  },
});
