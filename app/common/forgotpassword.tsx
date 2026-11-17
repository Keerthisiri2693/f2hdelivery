import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* 🌹 VALENTINE COLORS */
const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const MUTED = "#9F1239";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = email.length > 0;

  const onSubmit = () => {
    if (!isValid) return;

    setLoading(true);

    // 🔹 simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace("/common/login");
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {/* ❤️ HEADER */}
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="lock-reset"
                size={48}
                color={PRIMARY}
              />
            </View>

            <Text style={styles.title}>Forgot Password 💖</Text>
            <Text style={styles.subtitle}>
              Enter your registered email to receive a reset link
            </Text>

            {/* 💌 EMAIL INPUT */}
            <View style={styles.inputBox}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={MUTED}
              />
              <TextInput
                placeholder="Email address"
                placeholderTextColor={MUTED}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* ❤️ SUBMIT */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                !isValid && styles.disabledBtn,
              ]}
              onPress={onSubmit}
              disabled={!isValid || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Send Reset Link 💌</Text>
              )}
            </TouchableOpacity>

            {/* 🌹 BACK */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace("/common/login")}
            >
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* 🌸 STYLES */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },

  headerIcon: {
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#7F1D1D",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    color: MUTED,
    textAlign: "center",
    marginBottom: 30,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FADADD",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#4A1C2F",
  },

  submitBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",

    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  disabledBtn: {
    opacity: 0.5,
  },

  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  backBtn: {
    marginTop: 30,
    alignItems: "center",
  },

  backText: {
    color: MUTED,
    fontWeight: "600",
  },
});
