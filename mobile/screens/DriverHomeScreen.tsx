import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getAvailableDeliveries,
  acceptDelivery,
} from "../api/api";

type Delivery = {
  id: number;
  customer_id: number;
  pickup_address: string;
  delivery_address: string;
  package_description: string | null;
  package_weight: number | null;
  status: string;
  created_at: string;
};

export default function DriverHomeScreen({
  user,
  onLogout,
}: {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  onLogout: () => void;
}) {
  const [deliveries, setDeliveries] =
    useState<Delivery[]>([]);

  const [loading, setLoading] = useState(true);

  const loadDeliveries = async () => {
    try {
      setLoading(true);

      const data =
        await getAvailableDeliveries();

      setDeliveries(data.deliveries || []);

      console.log(
        "✅ Available deliveries:",
        data.deliveries
      );
    } catch (error: any) {
      console.error(
        "❌ Failed to load available deliveries:",
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to load deliveries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Driver Dashboard 🚗
          </Text>

          <Text style={styles.name}>
            {user.name}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Available Deliveries
      </Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Loading deliveries...
          </Text>
        </View>
      ) : deliveries.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>
            📦
          </Text>

          <Text style={styles.emptyTitle}>
            No deliveries available
          </Text>

          <Text style={styles.emptyText}>
            New delivery requests will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.deliveryId}>
                  Delivery #{item.id}
                </Text>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.label}>
                PICKUP
              </Text>

              <Text style={styles.address}>
                {item.pickup_address}
              </Text>

              <Text style={styles.arrow}>
                ↓
              </Text>

              <Text style={styles.label}>
                DELIVERY
              </Text>

              <Text style={styles.address}>
                {item.delivery_address}
              </Text>

              {item.package_description && (
                <Text style={styles.package}>
                  📦 {item.package_description}
                </Text>
              )}

              {item.package_weight !== null && (
                <Text style={styles.package}>
                  ⚖️ {item.package_weight} kg
                </Text>
              )}
                <TouchableOpacity
                style={styles.acceptButton}
                onPress={async () => {
                    try {
                    await acceptDelivery(item.id);

                    Alert.alert(
                        "Success",
                        "Delivery accepted successfully."
                    );

                    loadDeliveries();
                    } catch (error: any) {
                    console.error(
                        "❌ Accept delivery failed:",
                        error.response?.data ||
                        error.message
                    );

                    Alert.alert(
                        "Accept Failed",
                        error.response?.data?.message ||
                        "Failed to accept delivery."
                    );
                    }
                }}
                >
                <Text style={styles.acceptText}>
                    Accept Delivery
                </Text>
                </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={loadDeliveries}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
    padding: 24,
  },

  header: {
    marginTop: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 15,
    color: "#666",
  },

  name: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4,
  },

  logoutButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#111",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 35,
    marginBottom: 15,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  deliveryId: {
    fontSize: 17,
    fontWeight: "800",
  },

  statusBadge: {
    backgroundColor: "#fff3cd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#888",
    marginTop: 5,
  },

  address: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 5,
  },

  arrow: {
    fontSize: 20,
    color: "#888",
    marginVertical: 6,
  },

  package: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },

  acceptButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  acceptText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});