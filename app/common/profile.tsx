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
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  /* ---------- STATE ---------- */
  const [edit, setEdit] = useState(false);

  const [name, setName] = useState("Keerthana");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("keerthana@gmail.com");
  const [vehicle, setVehicle] = useState("Bike");
  const [city, setCity] = useState("Hyderabad");

  /* ---------- SAVE ---------- */
  const saveProfile = () => {
    if (!name || !phone) {
      Alert.alert("Error", "Name and phone are required");
      return;
    }

    setEdit(false);
    Alert.alert("Success", "Profile updated successfully");
    // 🔥 API call here
  };

  return (
    <View style={styles.safe}>
      {/* ---------- HEADER ---------- */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>My Profile</Text>

          <TouchableOpacity onPress={() => setEdit(!edit)}>
            <MaterialCommunityIcons
              name={edit ? "close" : "pencil"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- AVATAR ---------- */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={44} color="#E63946" />
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>Delivery Partner</Text>
          <Text style={styles.kyc}>KYC: Verified ✅</Text>
        </View>

        {/* ---------- DETAILS ---------- */}
        <View style={styles.card}>
          <ProfileRow
            label="Full Name"
            value={name}
            editable={edit}
            onChange={setName}
          />
          <ProfileRow
            label="Phone Number"
            value={phone}
            editable={edit}
            keyboard="phone-pad"
            onChange={setPhone}
          />
          <ProfileRow
            label="Email"
            value={email}
            editable={edit}
            keyboard="email-address"
            onChange={setEmail}
          />
          <ProfileRow
            label="Vehicle Type"
            value={vehicle}
            editable={edit}
            onChange={setVehicle}
          />
          <ProfileRow
            label="City"
            value={city}
            editable={edit}
            onChange={setCity}
          />
        </View>

        {/* ---------- SAVE BUTTON ---------- */}
        {edit && (
          <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
            <MaterialCommunityIcons
              name="content-save"
              size={20}
              color="#fff"
            />
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ---------- COMPONENT ---------- */

const ProfileRow = ({
  label,
  value,
  editable,
  onChange,
  keyboard,
}: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {editable ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType={keyboard || "default"}
      />
    ) : (
      <Text style={styles.value}>{value}</Text>
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

  avatarCard: {
    backgroundColor: "#FFE4E6",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FADADD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  name: { fontSize: 18, fontWeight: "700", color: "#7F1D1D" },
  role: { fontSize: 12, color: "#9F1239", marginTop: 2 },
  kyc: { fontSize: 11, color: "#22c55e", marginTop: 4 },

  card: {
    backgroundColor: "#FFF7F9",
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FADADD",
    padding: 16,
  },

  row: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: "#9F1239",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A1C2F",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FADADD",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },

  saveBtn: {
    backgroundColor: "#E63946",
    margin: 16,
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
});
