import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        navigation.navigate("Login");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const response = await fetch(
        `https://foodiehub-backend-production.up.railway.app/getOrdersByUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data.payments || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Order fetch error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderOrder = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.tokenContainer}>
          <FontAwesome name="ticket" size={16} color="#E67E22" />
          <Text style={styles.tokenText}>Token #{item.tokenNumber || "N/A"}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Items Ordered:</Text>
      {item.cartItems?.map((food, i) => (
        <View key={i} style={styles.itemRow}>
          <Text style={styles.itemName}>• {food.foodName}</Text>
          <Text style={styles.itemDetail}>
            x{food.quantity} — PKR {food.price}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Paid:</Text>
        <Text style={styles.totalAmount}>PKR {item.totalPrice}</Text>
      </View>

      <View style={styles.paymentRow}>
        <FontAwesome name="credit-card" size={14} color="#666" />
        <Text style={styles.paymentInfo}>
          {item.paymentInfo?.cardType || "N/A"} **** {item.paymentInfo?.cardNumber || "N/A"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E67E22" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="history" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No orders yet!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate("Main")}
          >
            <Text style={styles.shopButtonText}>Start Ordering</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tokenContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E67E22",
    marginLeft: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#999",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  itemDetail: {
    fontSize: 14,
    color: "#666",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E67E22",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentInfo: {
    fontSize: 13,
    color: "#888",
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#E67E22",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderHistoryScreen;