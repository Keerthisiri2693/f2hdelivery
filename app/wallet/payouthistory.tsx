import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ---------------- DUMMY PAYOUT DATA ---------------- */

const ALL_PAYOUTS = Array.from({ length: 22 }).map((_, i) => ({
  id: `PAYOUT_${i + 1}`,
  amount: Math.floor(Math.random() * 2000) + 500,
  date: `${i + 1} Sep 2025`,
  status: i % 3 === 0 ? "Pending" : "Completed",
  bank: "SBI •••• 1234",
}));

const PAGE_SIZE = 6;

export default function PayoutHistoryScreen() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  /* ---------- PAGINATION ---------- */
  const payouts = ALL_PAYOUTS.slice(0, page * PAGE_SIZE);
  const hasMore = payouts.length < ALL_PAYOUTS.length;

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <View>
        <Text style={styles.amount}>₹{item.amount}</Text>
        <Text style={styles.meta}>
          {item.date} • {item.bank}
        </Text>
      </View>

      <View style={styles.statusWrap}>
        <MaterialCommunityIcons
          name={item.status === "Completed" ? "check-circle" : "clock-outline"}
          size={18}
          color={item.status === "Completed" ? "#22c55e" : "#f97316"}
        />
        <Text
          style={[
            styles.status,
            item.status === "Completed"
              ? styles.completed
              : styles.pending,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.safe}>
      {/* ---------- HEADER ---------- */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Payout History</Text>
          <View style={{ width: 26 }} />
        </View>
      </SafeAreaView>

      {/* ---------- LIST ---------- */}
      <FlatList
        data={payouts}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons
              name="cash-multiple"
              size={32}
              color="#E63946"
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.summaryTitle}>Total Payouts</Text>
              <Text style={styles.summaryValue}>₹48,750</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => setPage(page + 1)}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.endText}>No more payouts</Text>
          )
        }
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

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

  summaryCard: {
    backgroundColor: "#FFE4E6",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  summaryTitle: { fontSize: 12, color: "#9F1239" },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7F1D1D",
    marginTop: 2,
  },

  row: {
    backgroundColor: "#FFF7F9",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FADADD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A1C2F",
  },
  meta: {
    fontSize: 12,
    color: "#9F1239",
    marginTop: 4,
  },

  statusWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  completed: { color: "#22c55e" },
  pending: { color: "#f97316" },

  loadMoreBtn: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#FFF7F9",
    borderWidth: 1,
    borderColor: "#FADADD",
  },
  loadMoreText: {
    fontWeight: "700",
    color: "#E63946",
  },

  endText: {
    textAlign: "center",
    padding: 16,
    color: "#9F1239",
    fontSize: 12,
  },
});
