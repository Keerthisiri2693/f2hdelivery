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
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase/firebaseConfig";

/* 💖 VALENTINE COLORS */
const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const BORDER = "#FADADD";
const MUTED = "#9F1239";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid =
    name.length > 0 &&
    email.length > 0 &&
    password.length >= 6 &&
    password === confirmPassword;

  /* 🔐 FIREBASE SIGNUP */
  const onSignup = async () => {
    if (!isValid) return;

    try {
      setLoading(true);

      // 1️⃣ Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      // 2️⃣ Update display name
      await updateProfile(user, {
        displayName: name,
      });

      // 3️⃣ Save rider profile in Realtime DB
      await set(ref(db, `users/riders/${user.uid}`), {
        uid: user.uid,
        name,
        email,
        role: "rider",
        createdAt: Date.now(),
      });

      Alert.alert("Success", "Account created successfully 🚴");

      // 4️⃣ Go to login
      router.replace("/common/login");
    } catch (error: any) {
      let message = "Signup failed";

      if (error.code === "auth/email-already-in-use") {
        message = "Email already registered";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters";
      }

      Alert.alert("Signup Error", message);
    } finally {
      setLoading(false);
    }
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
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Text style={styles.title}>Join as Delivery Partner ❤️</Text>
            <Text style={styles.subtitle}>
              Sign up to deliver fresh orders and start earning
            </Text>

            {/* Name */}
            <View style={styles.inputBox}>
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color={MUTED}
              />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={MUTED}
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View style={styles.inputBox}>
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
              />
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
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
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={MUTED}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputBox}>
              <MaterialCommunityIcons
                name="lock-check-outline"
                size={20}
                color={MUTED}
              />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={MUTED}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupBtn, !isValid && styles.disabledBtn]}
              onPress={onSignup}
              disabled={!isValid || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Login */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/common/login")}>
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
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
    flexGrow: 1,
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

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#4A1C2F",
  },

  signupBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },

  disabledBtn: {
    opacity: 0.5,
  },

  signupText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "#fff",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  loginText: {
    color: MUTED,
  },

  loginLink: {
    color: PRIMARY,
    fontWeight: "700",
  },
});
