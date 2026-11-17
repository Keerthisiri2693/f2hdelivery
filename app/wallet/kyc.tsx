import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function KycScreen() {
  const [editMode, setEditMode] = useState(false);

  const [aadhaar, setAadhaar] = useState("XXXX-XXXX-1234");
  const [pan, setPan] = useState("ABCDE1234F");
  const [license, setLicense] = useState("DL-0420110149646");

  const saveKyc = () => {
    if (!aadhaar || !pan || !license) {
      Alert.alert("Error", "Please fill all KYC fields");
      return;
    }

    setEditMode(false);
    Alert.alert("KYC Updated", "Your documents are submitted for verification");
  };

  return (
    <View style={styles.safe}>
      {/* ---------- HEADER ---------- */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>KYC Details</Text>

          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <MaterialCommunityIcons
              name={editMode ? "close" : "pencil"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- STATUS ---------- */}
        <View style={styles.statusCard}>
          <MaterialCommunityIcons
            name={editMode ? "shield-alert" : "shield-check"}
            size={40}
            color={editMode ? "#f97316" : "#22c55e"}
          />
          <Text style={styles.statusText}>
            {editMode ? "Editing KYC" : "KYC Verified"}
          </Text>
          <Text style={styles.subText}>
            {editMode
              ? "Update your documents carefully"
              : "Your documents are verified and approved"}
          </Text>
        </View>

        {/* ---------- DOCUMENTS ---------- */}
        <View style={styles.card}>
          <KycField
            label="Aadhaar Number"
            value={aadhaar}
            editable={editMode}
            onChange={setAadhaar}
          />
          <KycField
            label="PAN Number"
            value={pan}
            editable={editMode}
            onChange={setPan}
          />
          <KycField
            label="Driving License"
            value={license}
            editable={editMode}
            onChange={setLicense}
          />
        </View>

        {/* ---------- ACTIONS ---------- */}
        {editMode && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setEditMode(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={saveKyc}>
              <Text style={styles.saveText}>Save & Submit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ---------- INFO ---------- */}
        {!editMode && (
          <View style={styles.infoBox}>
            <MaterialCommunityIcons
              name="information"
              size={18}
              color="#9F1239"
            />
            <Text style={styles.infoText}>
              To update verified documents, click the edit icon above.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

const KycField = ({ label, value, editable, onChange }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>

    {editable ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    ) : (
      <Text style={styles.verified}>Verified</Text>
    )}
  </View>
);

/* ---------- STYLES ---------- */

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

  statusCard: {
    backgroundColor: "#E6FCEB",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    color: "#166534",
  },
  subText: {
    fontSize: 12,
    color: "#166534",
    marginTop: 4,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFF7F9",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FADADD",
  },

  row: {
    paddingVertical: 12,
  },

  label: {
    fontSize: 12,
    color: "#9F1239",
    marginBottom: 6,
  },

  verified: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22c55e",
  },

  input: {
    borderWidth: 1,
    borderColor: "#FADADD",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },

  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FADADD",
    alignItems: "center",
    marginRight: 8,
  },

  cancelText: {
    fontWeight: "600",
    color: "#9F1239",
  },

  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#E63946",
    alignItems: "center",
    marginLeft: 8,
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
  },

  infoBox: {
    flexDirection: "row",
    margin: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFE4E6",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#7F1D1D",
  },
});
