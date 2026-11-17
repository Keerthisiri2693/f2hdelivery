import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const LANGUAGES = [
  "English",
  "தமிழ் (Tamil)",
  "తెలుగు (Telugu)",
  "हिंदी (Hindi)",
  "ಕನ್ನಡ (Kannada)",
];

export default function LanguageScreen() {
  const [selected, setSelected] = useState("English");

  return (
    <View style={styles.safe}>
      {/* HEADER */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Select Language</Text>
          <View style={{ width: 26 }} />
        </View>
      </SafeAreaView>

      {/* CONTENT */}
      <View style={styles.sheet}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={styles.langRow}
            onPress={() => setSelected(lang)}
          >
            <Text style={styles.langText}>{lang}</Text>
            {selected === lang && (
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color="#E63946"
              />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF1F2" },

  headerSafe: { backgroundColor: "#E63946" },
  header: {
    height: 56,
    backgroundColor: "#E63946",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "600" },

  sheet: {
    backgroundColor: "#FFF7F9",
    margin: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FADADD",
  },

  langRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#FADADD",
  },
  langText: { fontSize: 15, fontWeight: "600", color: "#4A1C2F" },

  saveBtn: {
    backgroundColor: "#E63946",
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
