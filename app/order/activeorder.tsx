import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* 💖 VALENTINE COLORS */
const PRIMARY = "#E63946";
const BG = "#FFF1F2";
const CARD = "#FFF7F9";
const BORDER = "#FADADD";
const DARK = "#7F1D1D";
const MUTED = "#9F1239";
const SUCCESS = "#22C55E";
const INFO = "#3B82F6";
const WARNING = "#F59E0B";

export default function ActiveOrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [status, setStatus] = useState<
    "Pickup" | "On the Way" | "Delivered"
  >("Pickup");

  const order = {
    id: "FD2451",
    shop: {
      name: "Meat Shop – Anna Nagar",
      phone: "9876543210",
      address: "Anna Nagar, Chennai",
    },
    customer: {
      name: "Ramesh Kumar",
      phone: "9123456789",
      address: "12, MG Street, Chennai",
    },
    items: [
      { name: "Chicken Curry Cut", qty: 2, price: 180 },
      { name: "Mutton Boneless", qty: 1, price: 650 },
    ],
    deliveryFee: 40,
    paymentMode: "Cash on Delivery",
    instructions: "Call before delivery",
  };

  const subtotal = order.items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );
  const total = subtotal + order.deliveryFee;

  const nextStatus = () => {
    if (status === "Pickup") setStatus("On the Way");
    else if (status === "On the Way") setStatus("Delivered");
    else {
      Alert.alert("Order Completed", "Delivery marked as completed");
      router.replace("/common/dashboard1");
    }
  };

  return (
    <View style={styles.safe}>
      {/* HEADER */}
      <View style={[styles.toolbar, { paddingTop: insets.top }]}>
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

        <Text style={styles.toolbarTitle}>Active Order</Text>
        <View style={styles.toolbarBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* MAP */}
        <TouchableOpacity
          style={styles.mapBox}
          activeOpacity={0.85}
          onPress={() => router.push("/order/livemap")}
        >
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>

          <MaterialCommunityIcons
            name="map-marker-path"
            size={34}
            color={SUCCESS}
          />

          <Text style={styles.mapText}>Live Map Tracking</Text>
          <Text style={styles.mapSub}>Pickup → Customer route</Text>

          <View style={styles.routeRow}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>
        </TouchableOpacity>

        {/* ORDER CARD */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <StatusBadge status={status} />
          </View>

          <Section title="Pickup From">
            <Text style={styles.info}>{order.shop.name}</Text>
            <Text style={styles.subInfo}>{order.shop.address}</Text>
            <ContactRow label="Call Shop" phone={order.shop.phone} />
          </Section>

          <Section title="Deliver To">
            <Text style={styles.info}>{order.customer.name}</Text>
            <Text style={styles.subInfo}>{order.customer.address}</Text>
            <ContactRow label="Call Customer" phone={order.customer.phone} />
          </Section>

          <Section title="Order Items">
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.name} × {item.qty}
                </Text>
                <Text style={styles.itemPrice}>
                  ₹{item.price * item.qty}
                </Text>
              </View>
            ))}
          </Section>

          <Section title="Payment Summary">
            <BillRow label="Subtotal" value={`₹${subtotal}`} />
            <BillRow label="Delivery Fee" value={`₹${order.deliveryFee}`} />
            <BillRow label="Total" value={`₹${total}`} bold />
            <Text style={styles.paymentMode}>
              Payment Mode: {order.paymentMode}
            </Text>
          </Section>

          {order.instructions && (
            <Section title="Instructions">
              <Text style={styles.subInfo}>{order.instructions}</Text>
            </Section>
          )}

          <TouchableOpacity style={styles.actionBtn} onPress={nextStatus}>
            <Text style={styles.actionText}>
              {status === "Pickup"
                ? "Picked Up Order"
                : status === "On the Way"
                ? "Reached Customer"
                : "Complete Order"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Pickup"
      ? WARNING
      : status === "On the Way"
      ? INFO
      : SUCCESS;

  return (
    <View style={[styles.statusBadge, { backgroundColor: color }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ContactRow({ label, phone }: any) {
  return (
    <TouchableOpacity style={styles.contactBtn}>
      <MaterialCommunityIcons name="phone" size={18} color={SUCCESS} />
      <Text style={styles.contactText}>
        {label} ({phone})
      </Text>
    </TouchableOpacity>
  );
}

function BillRow({ label, value, bold }: any) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.billValue, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  toolbarTitle: { fontSize: 16, fontWeight: "700", color: DARK },
  toolbarBtn: { width: 40, alignItems: "center" },

  mapBox: {
    height: 200,
    backgroundColor: CARD,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    elevation: 4,
  },

  liveBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FFE4E6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: { color: PRIMARY, fontSize: 12, fontWeight: "700" },

  mapText: { fontSize: 18, fontWeight: "700", color: DARK, marginTop: 10 },
  mapSub: { color: MUTED, marginTop: 4, fontSize: 13 },

  routeRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: SUCCESS },
  line: {
    width: 40,
    height: 2,
    backgroundColor: "#BBF7D0",
    marginHorizontal: 6,
  },

  card: {
    backgroundColor: CARD,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    elevation: 3,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontWeight: "700", fontSize: 16, color: DARK },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  section: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  sectionTitle: { fontWeight: "700", marginBottom: 8, color: DARK },

  info: { color: MUTED, marginBottom: 6 },
  subInfo: { color: MUTED, marginBottom: 4 },

  itemRow: { flexDirection: "row", justifyContent: "space-between" },
  itemName: { color: MUTED },
  itemPrice: { fontWeight: "700", color: DARK },

  billRow: { flexDirection: "row", justifyContent: "space-between" },
  billLabel: { color: MUTED },
  billValue: { color: MUTED },
  bold: { fontWeight: "700", color: DARK },

  paymentMode: {
    marginTop: 8,
    color: PRIMARY,
    fontWeight: "600",
  },

  contactBtn: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  contactText: {
    marginLeft: 8,
    fontWeight: "600",
    color: SUCCESS,
  },

  actionBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  actionText: { fontWeight: "700", fontSize: 16, color: "#fff" },
});
