import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* 🌹 VALENTINE THEME COLORS */
const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const ACCENT = "#F43F5E";
const SUCCESS = "#22C55E";
const ERROR = "#EF4444";

export default function DashboardScreen() {
  const router = useRouter();

  const [online, setOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const activeOrder = true;
  const orderStatus: "Pickup" | "On the Way" | "Delivered" = "Pickup";

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 💖";
    if (hour < 17) return "Good Afternoon 🌹";
    return "Good Evening ❤️";
  };

  const onLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/common/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ❤️ HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.name}>Delivery Partner</Text>
          </View>

          <View style={styles.headerRight}>
          

            <View style={styles.onlineBox}>
              <Text
                style={[
                  styles.onlineText,
                  { color: online ? SUCCESS : ERROR },
                ]}
              >
                {online ? "Online" : "Offline"}
              </Text>
              <Switch
                value={online}
                onValueChange={setOnline}
                thumbColor="#fff"
                trackColor={{ true: SUCCESS, false: "#FCA5A5" }}
              />
            </View>
          </View>
        </View>

        {/* 💌 NOTIFICATION */}
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>
            💘 New orders waiting nearby
          </Text>
        </View>

        {!online && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              You’re offline 💔 Go online to receive orders
            </Text>
          </View>
        )}

        {/* 💖 STATS */}
        <View style={styles.statsRow}>
          <StatCard icon="cash-multiple" value="₹850" label="Today Earnings" />
          <StatCard icon="calendar-week" value="₹4,320" label="This Week" />
        </View>

        {/* ❤️ ACTIVE ORDER */}
        <Text style={styles.sectionTitle}>Active Order</Text>

        {activeOrder ? (
          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderId}>Order #FD2451</Text>
              <Text style={styles.orderStatus}>{orderStatus}</Text>
            </View>

            <Text style={styles.orderInfo}>📍 Meat Shop – Anna Nagar</Text>
            <Text style={styles.orderInfo}>🏠 Customer – 2.4 km away</Text>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push("/checklivetracking")}
            >
              <Text style={styles.actionText}>View Live Tracking ❤️</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyOrder}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={40}
              color="#FCA5A5"
            />
            <Text style={styles.emptyText}>
              No active orders right now 💗
            </Text>
          </View>
        )}

        {/* 💝 QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsRow}>
          <ActionCard icon="bike-fast" label="Active Order" onPress={() => router.push("/order/activeorder")} />
          <ActionCard icon="clipboard-list" label="Manage Orders" onPress={() => router.push("/order/manageorders")} />
          <ActionCard icon="cash-multiple" label="Earnings" onPress={() => router.push("/earning/earnings")} />
          <ActionCard icon="wallet" label="Wallet" onPress={() => router.push("/wallet/wallet")} />
          <ActionCard icon="cog" label="Settings" onPress={() => router.push("/common/settings")} />
          <ActionCard icon="account-heart" label="Profile" onPress={() => router.push("/common/profile")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 💗 COMPONENTS */

function StatCard({ icon, value, label }: any) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <MaterialCommunityIcons name={icon} size={26} color={PRIMARY} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={28} color={PRIMARY} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/* 🌸 STYLES */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerRight: { alignItems: "flex-end" },
  greeting: { color: "#9F1239", fontSize: 14 },
  name: { fontSize: 20, fontWeight: "bold", color: "#7F1D1D" },

  logoutBtn: { marginBottom: 8 },
  onlineBox: { flexDirection: "row", alignItems: "center" },
  onlineText: { marginRight: 8, fontWeight: "600" },

  notificationBanner: {
    backgroundColor: "#FFE4E6",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  notificationText: { color: "#9F1239", fontWeight: "600" },

  offlineBanner: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  offlineText: { color: ERROR, textAlign: "center", fontWeight: "600" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: CARD,
    flex: 1,
    marginHorizontal: 6,
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FADADD",
  },

  statIcon: {
    backgroundColor: "#FADADD",
    padding: 10,
    borderRadius: 30,
    marginBottom: 6,
  },

  statValue: { fontSize: 20, fontWeight: "bold", color: "#7F1D1D" },
  statLabel: { color: "#9F1239" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#7F1D1D",
  },

  orderCard: {
    backgroundColor: CARD,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FADADD",
    marginBottom: 20,
  },

  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderId: { fontWeight: "bold", color: "#7F1D1D" },
  orderStatus: { fontWeight: "700", color: PRIMARY },
  orderInfo: { color: "#9F1239", marginTop: 4 },

  actionBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },

  actionText: { fontWeight: "700", color: "#fff" },

  emptyOrder: {
    backgroundColor: CARD,
    padding: 30,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FADADD",
    marginBottom: 20,
  },

  emptyText: { marginTop: 10, color: "#9F1239" },

  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    backgroundColor: CARD,
    width: "48%",
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FADADD",
  },

  actionLabel: {
    marginTop: 8,
    fontWeight: "600",
    color: "#7F1D1D",
  },
});
