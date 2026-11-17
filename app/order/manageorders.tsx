import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ---------------- THEME ---------------- */

const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const BORDER = "#FADADD";
const DARK = "#7F1D1D";
const MUTED = "#9F1239";
const SUCCESS = "#22C55E";

/* ---------------- INITIAL DATA ---------------- */

const INITIAL_ORDERS = [
  {
    id: "ORD-101",
    shop: "Fresh Veg - T Nagar",
    pickup: "Fresh Veg - T Nagar",
    drop: "Customer",
    distance: "3.1 km",
    amount: 80,
    status: "PENDING",
  },
];

const STATUS_FLOW = ["ASSIGNED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"];
const TABS = ["PENDING", "ACTIVE", "COMPLETED"];

/* ---------------- SCREEN ---------------- */

export default function ManageOrders() {
  const router = useRouter();

  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [tab, setTab] = useState("PENDING");

  /* -------- ACTIONS -------- */

  const acceptOrder = (order: any) => {
    if (activeOrder) return;
    setOrders([]);
    setActiveOrder({ ...order, status: "ASSIGNED" });
    setTab("ACTIVE");
  };

  const updateActiveStatus = () => {
    if (!activeOrder) return;

    const index = STATUS_FLOW.indexOf(activeOrder.status);

    if (index < STATUS_FLOW.length - 1) {
      setActiveOrder({
        ...activeOrder,
        status: STATUS_FLOW[index + 1],
      });
    } else {
      setCompletedOrders([{ ...activeOrder, status: "COMPLETED" }]);
      setActiveOrder(null);
      setTab("COMPLETED");
    }
  };

  /* -------- CARD -------- */

  const renderCard = (item: any, showAccept = false, showUpdate = false) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <Text style={styles.statusText}>
          {item.status === "PENDING" ? "Pending" : item.status}
        </Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons
          name="map-marker"
          size={18}
          color={PRIMARY}
        />
        <Text style={styles.infoText}>{item.shop}</Text>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons
          name="account"
          size={18}
          color={MUTED}
        />
        <Text style={styles.infoText}>Suresh</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.distance}>{item.distance}</Text>
        <Text style={styles.online}>Online</Text>
      </View>

      {showAccept && (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => acceptOrder(item)}
        >
          <Text style={styles.btnText}>Accept Order</Text>
        </TouchableOpacity>
      )}

      {showUpdate && (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={updateActiveStatus}
        >
          <Text style={styles.btnText}>
            {activeOrder?.status === "ASSIGNED"
              ? "Picked Up"
              : activeOrder?.status === "PICKED_UP"
              ? "Start Delivery"
              : "Mark Delivered"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar backgroundColor={BG} barStyle="dark-content" />

      {/* -------- TOOLBAR -------- */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: CARD }}>
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.toolbarBtn}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={PRIMARY}
            />
          </TouchableOpacity>

          <Text style={styles.toolbarTitle}>Manage Orders</Text>
          <View style={styles.toolbarBtn} />
        </View>
      </SafeAreaView>

      {/* -------- TABS -------- */}
      <View style={styles.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={tab === t ? styles.tabTextActive : styles.tabText}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* -------- CONTENT -------- */}
      <View style={{ flex: 1 }}>
        {tab === "PENDING" && (
          <FlatList
            data={orders}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => renderCard(item, true)}
            ListEmptyComponent={
              <Text style={styles.empty}>No pending orders</Text>
            }
          />
        )}

        {tab === "ACTIVE" &&
          (activeOrder ? (
            renderCard(activeOrder, false, true)
          ) : (
            <Text style={styles.empty}>No active order</Text>
          ))}

        {tab === "COMPLETED" && (
          <FlatList
            data={completedOrders}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => renderCard(item)}
            ListEmptyComponent={
              <Text style={styles.empty}>No completed orders</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: CARD,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  toolbarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: DARK,
  },
  toolbarBtn: {
    width: 40,
    alignItems: "center",
  },

  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: CARD,
  },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  tabActive: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
  },
  tabText: {
    color: MUTED,
    fontSize: 14,
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  card: {
    backgroundColor: CARD,
    margin: 16,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: {
    fontWeight: "700",
    fontSize: 15,
    color: DARK,
  },
  statusText: {
    color: PRIMARY,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  infoText: {
    marginLeft: 6,
    color: DARK,
  },
  distance: {
    color: DARK,
  },
  online: {
    color: SUCCESS,
    fontWeight: "600",
  },

  primaryBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 14,
  },
  btnText: {
    fontWeight: "700",
    color: "#fff",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: MUTED,
  },
});
