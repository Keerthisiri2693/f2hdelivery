import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets, // ✅ IMPORT
} from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* ---------------- THEME ---------------- */

const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const BORDER = "#FADADD";
const DARK = "#7F1D1D";
const MUTED = "#9F1239";

/* ---------------- DATA ---------------- */

const TODAY_EARNINGS = [{ label: "Now", earnings: 1250 }];

const WEEKLY_EARNINGS = [
  { label: "Mon", earnings: 800 },
  { label: "Tue", earnings: 1100 },
  { label: "Wed", earnings: 950 },
  { label: "Thu", earnings: 1300 },
  { label: "Fri", earnings: 1200 },
  { label: "Sat", earnings: 1500 },
  { label: "Sun", earnings: 900 },
];

const MONTH_EARNINGS = [
  { label: "W1", earnings: 5200 },
  { label: "W2", earnings: 6100 },
  { label: "W3", earnings: 7400 },
  { label: "W4", earnings: 6800 },
];

const ORDERS = [
  { id: "ORD101", distance: "2.5 km", amount: 120, tip: 20 },
  { id: "ORD102", distance: "4.1 km", amount: 160, tip: 0 },
  { id: "ORD103", distance: "1.8 km", amount: 90, tip: 10 },
  { id: "ORD104", distance: "3.2 km", amount: 140, tip: 0 },
];

export default function EarningsScreen() {
   const insets = useSafeAreaInsets(); 
  const [tab, setTab] = useState<"Today" | "Week" | "Month">("Today");

  const earningsMap = {
    Today: TODAY_EARNINGS,
    Week: WEEKLY_EARNINGS,
    Month: MONTH_EARNINGS,
  };

  const currentData = earningsMap[tab];
  const maxEarning = Math.max(...currentData.map((i) => i.earnings));
  const totalEarning = currentData.reduce((sum, i) => sum + i.earnings, 0);

  return (
    <View style={styles.safe}>
      {/* ✅ NOTCH SAFE TOOLBAR */}
      <SafeAreaView edges={["top"]} style={styles.toolbarSafe}>
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarBtn}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.toolbarTitle}>Earnings</Text>

          <View style={styles.toolbarBtn} />
        </View>
      </SafeAreaView>

      {/* ✅ CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={{
    paddingBottom: insets.bottom + 24, 
  }} >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.amount}>₹{totalEarning}</Text>
          <Text style={styles.subText}>{tab} Earnings</Text>

          <View style={styles.headerRow}>
            <Text style={styles.headerItem}>🛵 12 Orders</Text>
            <Text style={styles.headerItem}>⏱️ 6h 30m</Text>
            <Text style={styles.headerItem}>⭐ 4.8</Text>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          {["Today", "Week", "Month"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.activeTab]}
              onPress={() => setTab(t as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === t && styles.activeTabText,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* EARNINGS BREAKDOWN */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Earnings Breakdown</Text>

          {[
            ["Base Pay", 600],
            ["Distance Pay", 250],
            ["Peak Bonus", 200],
            ["Tips", 150],
            ["Incentives", 50],
          ].map(([label, value]) => (
            <View key={label as string} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>₹{value}</Text>
            </View>
          ))}

          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>₹{totalEarning}</Text>
          </View>
        </View>

        {/* GRAPH */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{tab} Earnings</Text>

          {currentData.map((item) => (
            <View key={item.label} style={styles.barRow}>
              <Text style={styles.dayLabel}>{item.label}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(item.earnings / maxEarning) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.amountLabel}>₹{item.earnings}</Text>
            </View>
          ))}
        </View>

        {/* INCENTIVES */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incentives</Text>
          <Text style={styles.incentiveText}>
            Complete 20 orders today & earn ₹300
          </Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "70%" }]} />
          </View>
          <Text style={styles.progressText}>14 / 20 completed</Text>
        </View>

        {/* ORDERS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Earnings</Text>

          <FlatList
            data={ORDERS}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <View>
                  <Text style={styles.orderId}>{item.id}</Text>
                  <Text style={styles.distance}>{item.distance}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.orderAmount}>₹{item.amount}</Text>
                  {item.tip > 0 && (
                    <Text style={styles.tip}>+ ₹{item.tip} Tip</Text>
                  )}
                </View>
              </View>
            )}
          />
        </View>

        {/* WALLET */}
        <View style={styles.card}>
          <View style={styles.walletHeader}>
            <View>
              <Text style={styles.cardTitle}>Wallet</Text>
              <Text style={styles.walletSub}>Available Balance</Text>
            </View>
            <View style={styles.walletIcon}>
              <MaterialCommunityIcons name="bank" size={20} color={PRIMARY} />
            </View>
          </View>

          <Text style={styles.walletAmount}>₹3,450</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  /* 🔹 TOOLBAR (COMPACT + NOTCH SAFE) */
  toolbarSafe: {
    backgroundColor: PRIMARY,
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12, 
    backgroundColor: PRIMARY,
  },

  toolbarTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  toolbarBtn: {
    width: 32,
    alignItems: "center",
  },

  
  header: {
    backgroundColor: PRIMARY,
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  amount: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },

  subText: {
    color: "#FFE4E6",
    marginTop: 4,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12, 
  },

  headerItem: {
    color: "#fff",
    fontSize: 13,
  },

  /* 🔹 TABS */
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },

  activeTab: {
    backgroundColor: PRIMARY,
  },

  tabText: {
    color: MUTED,
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },

  /* 🔹 CARD */
  card: {
    backgroundColor: CARD,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: DARK,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: MUTED,
  },

  value: {
    fontWeight: "600",
    color: DARK,
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 8,
  },

  total: {
    fontWeight: "bold",
    fontSize: 16,
    color: DARK,
  },

  /* 🔹 INCENTIVES */
  incentiveText: {
    marginBottom: 8,
    color: MUTED,
  },

  progressBar: {
    height: 8,
    backgroundColor: "#FFE4E6",
    borderRadius: 8,
  },

  progressFill: {
    height: "100%",
    backgroundColor: PRIMARY,
  },

  progressText: {
    fontSize: 12,
    color: MUTED,
  },

  /* 🔹 ORDERS */
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  orderId: {
    fontWeight: "600",
    color: DARK,
  },

  distance: {
    color: MUTED,
    fontSize: 12,
  },

  orderAmount: {
    fontWeight: "700",
    color: DARK,
  },

  tip: {
    color: PRIMARY,
    fontSize: 12,
  },

  /* 🔹 WALLET */
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  walletSub: {
    fontSize: 12,
    color: MUTED,
  },

  walletAmount: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
    color: DARK,
  },

  walletIcon: {
    backgroundColor: "#FADADD",
    padding: 10,
    borderRadius: 50,
  },

  /* 🔹 BAR GRAPH */
  barRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dayLabel: {
    width: 40,
    fontSize: 12,
    color: MUTED,
  },

  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "#FFE4E6",
    borderRadius: 8,
    marginHorizontal: 8,
  },

  barFill: {
    height: "100%",
    backgroundColor: PRIMARY,
  },

  amountLabel: {
    width: 70,
    fontSize: 12,
    fontWeight: "600",
    color: DARK,
  },
});
