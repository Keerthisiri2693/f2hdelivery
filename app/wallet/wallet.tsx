import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* ---------------- ALL TRANSACTIONS (DUMMY) ---------------- */

const ALL_TRANSACTIONS = Array.from({ length: 25 }).map((_, i) => ({
  id: `TXN${i + 1}`,
  type: i % 3 === 0 ? "debit" : "credit",
  title: i % 3 === 0 ? "Withdrawal" : "Order Earnings",
  amount: Math.floor(Math.random() * 900) + 100,
  date: `${i + 1} Sep`,
  status: i % 3 === 0 ? "Pending" : "Completed",
}));

const PAGE_SIZE = 6;

export default function WalletScreen() {
  const [balance, setBalance] = useState(3450);

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAllTxns, setShowAllTxns] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [showEditBank, setShowEditBank] = useState(false);

  const [amount, setAmount] = useState("");
  const [page, setPage] = useState(1);

  /* ---------- BANK STATE ---------- */
  const [bankName, setBankName] = useState("State Bank of India");
  const [holderName, setHolderName] = useState("Keerthana");
  const [accountNo, setAccountNo] = useState("XXXX-XXXX-1234");
  const [ifsc, setIfsc] = useState("SBIN0001234");

  /* ---------- PAGINATION ---------- */
  const paginatedTxns = ALL_TRANSACTIONS.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedTxns.length < ALL_TRANSACTIONS.length;

  /* ---------- WITHDRAW ---------- */
  const withdraw = () => {
    const value = Number(amount);
    if (!value || value < 500)
      return Alert.alert("Minimum withdrawal is ₹500");
    if (value > balance)
      return Alert.alert("Insufficient balance");

    setBalance(balance - value);
    setAmount("");
    setShowWithdraw(false);
    Alert.alert("Withdrawal Requested", "Amount credited within 24 hours");
  };

  /* ---------- SAVE BANK ---------- */
  const saveBank = () => {
    if (!bankName || !holderName || !accountNo || !ifsc) {
      Alert.alert("Please fill all bank details");
      return;
    }
    setShowEditBank(false);
    Alert.alert("Bank details updated successfully");
  };

  /* ---------- TRANSACTION ITEM ---------- */
  const renderTxn = ({ item }: any) => (
    <View style={styles.txnRow}>
      <View style={styles.txnLeft}>
        <MaterialCommunityIcons
          name={item.type === "credit" ? "arrow-down-circle" : "arrow-up-circle"}
          size={20}
          color={item.type === "credit" ? "#22c55e" : "#ef4444"}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.txnTitle}>{item.title}</Text>
          <Text style={styles.txnDate}>
            {item.date} • {item.status}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.txnAmount,
          { color: item.type === "credit" ? "#22c55e" : "#ef4444" },
        ]}
      >
        {item.type === "credit" ? "+" : "-"}₹{item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.safe}>
      {/* ---------- TOOLBAR ---------- */}
      <SafeAreaView edges={["top"]} style={styles.toolbarSafe}>
        <View style={styles.toolbar}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
          <Text style={styles.toolbarTitle}>Wallet</Text>
          <View style={{ width: 28 }} />
        </View>
      </SafeAreaView>

      {/* ---------- CONTENT ---------- */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- BALANCE ---------- */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceAmount}>₹{balance}</Text>
            <Text style={styles.balanceSub}>Available for withdrawal</Text>
          </View>

          <View style={styles.walletIcon}>
            <MaterialCommunityIcons name="wallet" size={28} color="#E63946" />
          </View>
        </View>

        {/* ---------- ACTIONS ---------- */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowWithdraw(true)}
          >
            <MaterialCommunityIcons name="bank-transfer" size={22} color="#E63946" />
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              setPage(1);
              setShowAllTxns(true);
            }}
          >
            <MaterialCommunityIcons name="history" size={22} color="#E63946" />
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowBank(true)}
          >
            <MaterialCommunityIcons name="bank" size={22} color="#E63946" />
            <Text style={styles.actionText}>My Bank</Text>
          </TouchableOpacity>
        </View>

        {/* ---------- RECENT TRANSACTIONS ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => setShowAllTxns(true)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {ALL_TRANSACTIONS.slice(0, 4).map((item) => (
            <View key={item.id}>{renderTxn({ item })}</View>
          ))}
        </View>
      </ScrollView>

      {/* ---------- ALL TRANSACTIONS MODAL ---------- */}
      <Modal visible={showAllTxns} animationType="slide">
        <SafeAreaView style={styles.safe}>
          <View style={styles.modalToolbar}>
            <TouchableOpacity onPress={() => setShowAllTxns(false)}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.toolbarTitle}>All Transactions</Text>
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            data={paginatedTxns}
            keyExtractor={(i) => i.id}
            renderItem={renderTxn}
            ListFooterComponent={
              hasMore ? (
                <TouchableOpacity
                  style={styles.loadMoreBtn}
                  onPress={() => setPage(page + 1)}
                >
                  <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.endText}>No more transactions</Text>
              )
            }
          />
        </SafeAreaView>
      </Modal>

      {/* ---------- BANK DETAILS MODAL ---------- */}
      <Modal visible={showBank} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.bankHeader}>
              <Text style={styles.modalTitle}>Bank Details</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowBank(false);
                  setShowEditBank(true);
                }}
              >
                <MaterialCommunityIcons name="pencil" size={22} color="#E63946" />
              </TouchableOpacity>
            </View>

            <View style={styles.bankRow}><Text style={styles.label}>Bank</Text><Text style={styles.value}>{bankName}</Text></View>
            <View style={styles.bankRow}><Text style={styles.label}>Holder</Text><Text style={styles.value}>{holderName}</Text></View>
            <View style={styles.bankRow}><Text style={styles.label}>Account</Text><Text style={styles.value}>{accountNo}</Text></View>
            <View style={styles.bankRow}><Text style={styles.label}>IFSC</Text><Text style={styles.value}>{ifsc}</Text></View>

            <TouchableOpacity style={styles.withdrawBtn} onPress={() => setShowBank(false)}>
              <Text style={styles.withdrawText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ---------- EDIT BANK MODAL ---------- */}
      <Modal visible={showEditBank} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Bank Details</Text>

            <TextInput style={styles.input} value={bankName} onChangeText={setBankName} placeholder="Bank Name" />
            <TextInput style={styles.input} value={holderName} onChangeText={setHolderName} placeholder="Account Holder" />
            <TextInput style={styles.input} value={accountNo} onChangeText={setAccountNo} placeholder="Account Number" />
            <TextInput style={styles.input} value={ifsc} onChangeText={setIfsc} placeholder="IFSC Code" />

            <TouchableOpacity style={styles.withdrawBtn} onPress={saveBank}>
              <Text style={styles.withdrawText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEditBank(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ---------- WITHDRAW MODAL ---------- */}
      <Modal visible={showWithdraw} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Withdraw Amount</Text>

            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />

            <TouchableOpacity style={styles.withdrawBtn} onPress={withdraw}>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowWithdraw(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF1F2" },
  toolbarSafe: { backgroundColor: "#E63946" },
  toolbar: {
    height: 56,
    backgroundColor: "#E63946",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  toolbarTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  balanceCard: {
    backgroundColor: "#FFE4E6",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceLabel: { color: "#9F1239" },
  balanceAmount: { fontSize: 32, fontWeight: "bold", color: "#7F1D1D" },
  balanceSub: { fontSize: 12, color: "#BE123C" },

  walletIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FADADD",
    alignItems: "center",
    justifyContent: "center",
  },

  actionsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  actionBtn: {
    backgroundColor: "#FFF7F9",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    width: "28%",
    borderWidth: 1,
    borderColor: "#FADADD",
  },
  actionText: { marginTop: 6, fontSize: 12, fontWeight: "600", color: "#9F1239" },

  card: {
    backgroundColor: "#FFF7F9",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FADADD",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#7F1D1D" },
  viewAllText: { color: "#E63946", fontWeight: "600" },

  txnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FADADD",
  },
  txnLeft: { flexDirection: "row" },
  txnTitle: { fontWeight: "600", color: "#4A1C2F" },
  txnDate: { fontSize: 12, color: "#9F1239" },
  txnAmount: { fontWeight: "700" },

  modalToolbar: {
    height: 56,
    backgroundColor: "#E63946",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  loadMoreBtn: { padding: 14, alignItems: "center" },
  loadMoreText: { color: "#E63946", fontWeight: "600" },
  endText: { textAlign: "center", padding: 16, color: "#9F1239" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(230,57,70,0.35)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#FFF7F9",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#7F1D1D" },

  bankHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  bankRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  label: { color: "#9F1239" },
  value: { fontWeight: "600", color: "#4A1C2F" },

  input: {
    borderWidth: 1,
    borderColor: "#FADADD",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  withdrawBtn: {
    backgroundColor: "#E63946",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  withdrawText: { color: "#fff", fontWeight: "600" },
  cancel: { textAlign: "center", marginTop: 12, color: "#BE123C" },
});
