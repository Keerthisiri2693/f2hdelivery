
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function LiveMap() {
  const mapUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=79.10%2C10.75%2C79.18%2C10.83&layer=mapnik";

  const openFullMap = () => {
    window.open(
      "https://www.openstreetmap.org/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Live Order Tracking
        </Text>

        <Text style={styles.subtitle}>
          OpenStreetMap
        </Text>
      </View>

      {/* MAP */}

      <View style={styles.mapContainer}>
        {React.createElement("iframe", {
          title: "OpenStreetMap Live Map",
          src: mapUrl,
          style: {
            width: "100%",
            height: "100%",
            border: 0,
          },
          allowFullScreen: true,
          loading: "lazy",
        })}
      </View>

      {/* BOTTOM PANEL */}

      <View style={styles.bottomCard}>
        <Text style={styles.statusTitle}>
          Map loaded successfully
        </Text>

        <Text style={styles.statusSubtitle}>
          View your delivery area on OpenStreetMap.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={openFullMap}
        >
          <Text style={styles.buttonText}>
            Open Full Map
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F6",
  },

  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#202020",
  },

  subtitle: {
    fontSize: 13,
    color: "#777777",
    marginTop: 4,
  },

  mapContainer: {
    flex: 1,
    minHeight: 300,
    overflow: "hidden",
  },

  bottomCard: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16A36A",
  },

  statusSubtitle: {
    fontSize: 13,
    color: "#666666",
    marginTop: 5,
  },

  button: {
    marginTop: 14,
    backgroundColor: "#16A36A",
    padding: 13,
    borderRadius: 9,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
