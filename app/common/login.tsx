import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const { width } = Dimensions.get("window");

/* 💖 VALENTINE COLORS */
const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const MUTED = "#9F1239";
const BORDER = "#FADADD";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid = email.length > 0 && password.length >= 6;

  /* 🔐 FIREBASE LOGIN */
  const onLogin = async () => {
    if (!isValid) return;

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // ✅ SUCCESS
      router.replace("/common/dashboard1");
    } catch (error: any) {
      let message = "Login failed";

      if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      }

      Alert.alert("Login Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <Text style={styles.title}>Welcome Back ❤️</Text>
        <Text style={styles.subtitle}>
          Order fresh meat & meals from trusted shops
        </Text>

        {/* Email */}
        <View
          style={[
            styles.inputBox,
            focused === "email" && styles.focusedBox,
          ]}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            color={MUTED}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={MUTED}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
          />
        </View>

        {/* Password */}
        <View
          style={[
            styles.inputBox,
            focused === "password" && styles.focusedBox,
          ]}
        >
          <MaterialCommunityIcons
            name="lock-outline"
            size={20}
            color={MUTED}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={MUTED}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={MUTED}
            />
          </TouchableOpacity>
        </View>

        {/* Forgot password */}
        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => router.push("/common/forgotpassword")}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginBtn, (!isValid || loading) && styles.disabledBtn]}
          onPress={onLogin}
          disabled={!isValid || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.orText}>OR</Text>

        {/* Signup */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/common/signup")}>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* 💗 STYLES */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 30,
    color: "#7F1D1D",
  },

  subtitle: {
    color: MUTED,
    marginTop: 6,
    marginBottom: 30,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  focusedBox: {
    borderColor: PRIMARY,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#4A1C2F",
  },

  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },

  forgotText: {
    color: PRIMARY,
    fontWeight: "600",
  },

  loginBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },

  disabledBtn: {
    opacity: 0.5,
  },

  loginText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  orText: {
    textAlign: "center",
    color: MUTED,
    marginVertical: 20,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  signupText: {
    color: MUTED,
  },

  signupLink: {
    color: PRIMARY,
    fontWeight: "700",
  },
});
