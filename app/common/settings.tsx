import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DeliverySettingsScreen() {
  const router = useRouter();

  const [online, setOnline] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  /* ---------- NAVIGATION ---------- */
  const goToWallet = () => router.push("/wallet/wallet");
  const goToBank = () => router.push("/wallet/bank");
  const goToPayoutHistory = () => router.push("/wallet/payouthistory");
  const goToGstInfo = () => router.push("/wallet/gstinfo");

  /* ---------- LOGOUT ---------- */
  const confirmLogout = () => {
    if (online) {
      Alert.alert(
        "Go Offline",
        "Please turn off Online Status before logging out."
      );
      return;
    }

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // TODO: clear session here
          // AsyncStorage.clear();
          router.replace("/common/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.safe}>
      {/* ---------- HEADER ---------- */}
      <SafeAreaView edges={["top"]} style={styles.toolbarSafe}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.toolbarTitle}>Settings</Text>
          <View style={{ width: 26 }} />
        </View>
      </SafeAreaView>

      {/* ---------- CONTENT ---------- */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={30} color="#E63946" />
          </View>
          <View>
            <Text style={styles.name}>Keerthana</Text>
            <Text style={styles.sub}>Delivery Partner</Text>
            <Text style={styles.kyc}>KYC: Verified ✅</Text>
          </View>
        </View>

        {/* WORK */}
        <Section title="Work Settings">
          <ToggleItem icon="bike-fast" label="Online Status" value={online} onChange={setOnline} />
          <ToggleItem icon="flash" label="Auto Accept Orders" value={autoAccept} onChange={setAutoAccept} />
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="Notifications">
          <ToggleItem icon="bell" label="All Notifications" value={notifications} onChange={setNotifications} />
        </Section>

        {/* FINANCE */}
        <Section title="Finance">
          <NavItem icon="wallet" label="Wallet" onPress={goToWallet} />
          <NavItem icon="bank" label="My Bank" onPress={goToBank} />
          <NavItem icon="cash-multiple" label="Payout History" onPress={goToPayoutHistory} />
          <NavItem icon="file-document" label="GST / Tax Info" onPress={goToGstInfo} />
        </Section>

        {/* ACCOUNT */}
        <Section title="Account">
          <NavItem icon="account-edit" label="Edit Profile" onPress={() => router.push("/common/profile")} />
          <NavItem icon="shield-check" label="KYC Documents" onPress={() => router.push("/wallet/kyc")} />
          <NavItem icon="translate" label="Language" onPress={() => router.push("/common/language")} />
        </Section>

        {/* APP */}
        <Section title="App Settings">
          <ToggleItem icon="weather-night" label="Dark Mode" value={darkMode} onChange={setDarkMode} />
          <NavItem icon="information" label="App Version 1.0.0" />
        </Section>

        {/* SUPPORT */}
        <Section title="Support">
          <NavItem icon="help-circle" label="Help & Support" />
          <NavItem icon="alert-circle" label="Report Issue" />
          <NavItem icon="lock" label="Privacy Policy" />
          <NavItem icon="file" label="Terms & Conditions" />
        </Section>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ---------- LOGOUT ---------- */}
      <SafeAreaView edges={["bottom"]} style={styles.logoutSafe}>
        <TouchableOpacity
          style={[styles.logoutCard, online && { opacity: 0.5 }]}
          disabled={online}
          onPress={confirmLogout}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="logout" size={22} color="#E63946" />
          <Text style={styles.logoutText}>
            {online ? "Go Offline to Logout" : "Logout"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

const Section = ({ title, children }: any) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

const NavItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.left}>
      <MaterialCommunityIcons name={icon} size={22} color="#E63946" />
      <Text style={styles.itemText}>{label}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={22} color="#9F1239" />
  </TouchableOpacity>
);

const ToggleItem = ({ icon, label, value, onChange }: any) => (
  <View style={styles.item}>
    <View style={styles.left}>
      <MaterialCommunityIcons name={icon} size={22} color="#E63946" />
      <Text style={styles.itemText}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      thumbColor="#fff"
      trackColor={{ false: "#FADADD", true: "#E63946" }}
    />
  </View>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF1F2" },

  toolbarSafe: { backgroundColor: "#E63946" },
  toolbar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#E63946",
  },
  toolbarTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  profileCard: {
    backgroundColor: "#FFE4E6",
    margin: 16,
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FADADD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  name: { fontSize: 16, fontWeight: "700", color: "#7F1D1D" },
  sub: { fontSize: 12, color: "#9F1239" },
  kyc: { fontSize: 11, color: "#22c55e" },

  sectionTitle: {
    marginLeft: 16,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#9F1239",
  },

  card: {
    backgroundColor: "#FFF7F9",
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FADADD",
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FADADD",
  },

  left: { flexDirection: "row", alignItems: "center" },
  itemText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#4A1C2F",
  },

  /* LOGOUT */
  logoutSafe: {
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  logoutCard: {
    backgroundColor: "#FFF7F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#FADADD",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#E63946",
  },
});
