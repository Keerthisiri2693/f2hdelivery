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

export default function BankScreen() {
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);

  const [bankName, setBankName] = useState("State Bank of India");
  const [holderName, setHolderName] = useState("Keerthana");
  const [accountNo, setAccountNo] = useState("123456789012");
  const [ifsc, setIfsc] = useState("SBIN0001234");

  const saveBank = () => {
    if (!bankName || !holderName || !accountNo || !ifsc) {
      Alert.alert("Error", "Please fill all bank details");
      return;
    }

    setEditMode(false);
    Alert.alert(
      "Bank Updated",
      "Your bank details have been saved successfully"
    );
  };

  return (
    <View style={styles.safe}>
      {/* ---------- HEADER ---------- */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>My Bank</Text>

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
        {/* ---------- BANK STATUS ---------- */}
        <View style={styles.statusCard}>
          <MaterialCommunityIcons
            name={editMode ? "shield-lock" : "bank-check"}
            size={38}
            color={editMode ? "#f97316" : "#22c55e"}
          />
          <Text style={styles.statusText}>
            {editMode ? "Editing Bank Details" : "Bank Account Verified"}
          </Text>
          <Text style={styles.subText}>
            {editMode
              ? "Ensure details are correct before saving"
              : "Payments will be credited to this account"}
          </Text>
        </View>

        {/* ---------- BANK DETAILS ---------- */}
        <View style={styles.card}>
          <BankField
            label="Bank Name"
            value={bankName}
            editable={editMode}
            onChange={setBankName}
          />
          <BankField
            label="Account Holder Name"
            value={holderName}
            editable={editMode}
            onChange={setHolderName}
          />
          <BankField
            label="Account Number"
            value={accountNo}
            editable={editMode}
            onChange={setAccountNo}
            keyboardType="numeric"
          />
          <BankField
            label="IFSC Code"
            value={ifsc}
            editable={editMode}
            onChange={setIfsc}
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

            <TouchableOpacity style={styles.saveBtn} onPress={saveBank}>
              <Text style={styles.saveText}>Save Bank</Text>
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
              To change your bank account, tap the edit icon above.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- COMPONENT ---------- */

const BankField = ({
  label,
  value,
  editable,
  onChange,
  keyboardType = "default",
}: any) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>

    {editable ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={styles.input}
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

  field: {
    marginBottom: 14,
  },

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
