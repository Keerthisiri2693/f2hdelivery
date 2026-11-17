import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function GstInfoScreen() {
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);

  const [gstNumber, setGstNumber] = useState("29ABCDE1234F1Z5");
  const [businessName, setBusinessName] = useState("Keerthana Delivery Services");
  const [address, setAddress] = useState(
    "Bangalore, Karnataka - 560001"
  );

  const saveGst = () => {
    if (!gstNumber || !businessName || !address) {
      Alert.alert("Error", "Please fill all GST details");
      return;
    }

    setEditMode(false);
    Alert.alert("GST Updated", "GST information saved successfully");
  };

  return (
    <View style={styles.safe}>
      {/* ---------- HEADER ---------- */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>GST / Tax Info</Text>

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
            name={editMode ? "file-document-edit" : "file-check"}
            size={38}
            color={editMode ? "#f97316" : "#22c55e"}
          />
          <Text style={styles.statusText}>
            {editMode ? "Editing GST Details" : "GST Information Saved"}
          </Text>
          <Text style={styles.subText}>
            {editMode
              ? "Make sure GST details are accurate"
              : "Used for invoices and tax reporting"}
          </Text>
        </View>

        {/* ---------- GST DETAILS ---------- */}
        <View style={styles.card}>
          <GstField
            label="GST Number"
            value={gstNumber}
            editable={editMode}
            onChange={setGstNumber}
            autoCapitalize="characters"
          />

          <GstField
            label="Business / Trade Name"
            value={businessName}
            editable={editMode}
            onChange={setBusinessName}
          />

          <GstField
            label="Business Address"
            value={address}
            editable={editMode}
            onChange={setAddress}
            multiline
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

            <TouchableOpacity style={styles.saveBtn} onPress={saveGst}>
              <Text style={styles.saveText}>Save GST</Text>
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
              GST details are required only if applicable. You can edit anytime.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- COMPONENT ---------- */

const GstField = ({
  label,
  value,
  editable,
  onChange,
  multiline = false,
  autoCapitalize = "none",
}: any) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>

    {editable ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        style={[styles.input, multiline && { height: 80 }]}
      />
    ) : (
      <Text style={styles.readonly}>{value}</Text>
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
    backgroundColor: "#FFE4E6",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    color: "#7F1D1D",
  },
  subText: {
    fontSize: 12,
    color: "#9F1239",
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

  field: { marginBottom: 14 },

  label: {
    fontSize: 12,
    color: "#9F1239",
    marginBottom: 6,
  },

  readonly: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A1C2F",
  },

  input: {
    borderWidth: 1,
    borderColor: "#FADADD",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    textAlignVertical: "top",
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
