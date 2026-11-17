import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem("onboardingSeen");

        setRoute(
          seen === "true"
            ? "/common/login"
            : "/common/onboardingscreen"
        );
      } catch (error) {
        // fallback safety
        setRoute("/common/onboardingscreen");
      }
    };

    checkOnboarding();
  }, []);

  // 🔹 Prevent blank screen
  if (!route) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={route} />;
}
