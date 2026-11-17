import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ SVG import (case + path must match)
import OnboardingSvg from "../../assets/images/OnboardingScreen.svg";

const { width } = Dimensions.get("window");

/* 💖 VALENTINE COLORS */
const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const BORDER = "#FADADD";
const MUTED = "#9F1239";
const DARK = "#7F1D1D";

export default function OnboardingScreen() {
  const router = useRouter();

  const onStart = async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    router.replace("/common/login"); // prevent going back
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Illustration */}
      <OnboardingSvg
        width={width * 0.85}
        height={width * 0.85}
      />

      {/* Title */}
      <Text style={styles.title}>
        Freshness <Text style={styles.highlight}>Delivered</Text>
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        From shops and restaurants, straight to your door
      </Text>

      {/* CTA */}
      <TouchableOpacity
        style={styles.startBtn}
        onPress={onStart}
        activeOpacity={0.85}
      >
        <Text style={styles.startText}>Get Started ❤️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* 💗 STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 30,
    color: DARK,
  },

  highlight: {
    color: PRIMARY,
  },

  subtitle: {
    textAlign: "center",
    color: MUTED,
    marginTop: 10,
    fontSize: 14,
    paddingHorizontal: 20,
  },

  startBtn: {
    backgroundColor: CARD,
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 30,
    marginTop: 40,
    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  startText: {
    fontWeight: "700",
    fontSize: 16,
    color: PRIMARY,
    letterSpacing: 0.4,
  },
});
