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
  getMyDriverDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
} from "../api/api";

type Delivery = {
  id: number;
  customer_id: number;
  pickup_address: string;
  delivery_address: string;
  package_description: string | null;
  package_weight: number | null;
  status: string;
  driver_id?: number;
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

  const [myDeliveries, setMyDeliveries] =
    useState<Delivery[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadDeliveries = async () => {
    try {
      const data =
        await getAvailableDeliveries();

      setDeliveries(
        data.deliveries || []
      );

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
    }
  };

  const loadMyDeliveries = async () => {
    try {
      const data =
        await getMyDriverDeliveries();

      setMyDeliveries(
        data.deliveries || []
      );

      console.log(
        "✅ My driver deliveries:",
        data.deliveries
      );
    } catch (error: any) {
      console.error(
        "❌ Failed to load my deliveries:",
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to load your deliveries."
      );
    }
  };

  const loadAllDeliveries = async () => {
    try {
      setLoading(true);

      await Promise.all([
        loadDeliveries(),
        loadMyDeliveries(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDeliveries();
  }, []);

  const handleAcceptDelivery = async (
    deliveryId: number
  ) => {
    try {
      await acceptDelivery(deliveryId);

      Alert.alert(
        "Success",
        "Delivery accepted successfully."
      );

      await loadAllDeliveries();
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
  };

  const handleUpdateStatus = async (
    deliveryId: number,
    status:
      | "picked_up"
      | "in_transit"
      | "delivered"
  ) => {
    try {
      await updateDeliveryStatus(
        deliveryId,
        status
      );

      let message = "";

      if (status === "picked_up") {
        message =
          "Delivery marked as picked up.";
      }

      if (status === "in_transit") {
        message =
          "Delivery is now in transit.";
      }

      if (status === "delivered") {
        message =
          "Delivery marked as delivered.";
      }

      Alert.alert(
        "Updated",
        message
      );

      await loadAllDeliveries();
    } catch (error: any) {
      console.error(
        "❌ Update status failed:",
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update delivery."
      );
    }
  };

  const renderDeliveryCard = (
    item: Delivery,
    isMyDelivery: boolean
  ) => {
    return (
      <View style={styles.card}>
        {/* CARD HEADER */}
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

        {/* PICKUP */}
        <Text style={styles.label}>
          PICKUP
        </Text>

        <Text style={styles.address}>
          {item.pickup_address}
        </Text>

        <Text style={styles.arrow}>
          ↓
        </Text>

        {/* DELIVERY */}
        <Text style={styles.label}>
          DELIVERY
        </Text>

        <Text style={styles.address}>
          {item.delivery_address}
        </Text>

        {/* PACKAGE */}
        {item.package_description && (
          <Text style={styles.package}>
            📦 {item.package_description}
          </Text>
        )}

        {/* WEIGHT */}
        {item.package_weight !== null && (
          <Text style={styles.package}>
            ⚖️ {item.package_weight} kg
          </Text>
        )}

        {/* AVAILABLE DELIVERY */}
        {!isMyDelivery &&
          item.status === "pending" && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() =>
                handleAcceptDelivery(
                  item.id
                )
              }
            >
              <Text
                style={styles.acceptText}
              >
                Accept Delivery
              </Text>
            </TouchableOpacity>
          )}

        {/* ACCEPTED */}
        {isMyDelivery &&
          item.status === "accepted" && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() =>
                handleUpdateStatus(
                  item.id,
                  "picked_up"
                )
              }
            >
              <Text
                style={styles.acceptText}
              >
                Mark as Picked Up
              </Text>
            </TouchableOpacity>
          )}

        {/* PICKED UP */}
        {isMyDelivery &&
          item.status === "picked_up" && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() =>
                handleUpdateStatus(
                  item.id,
                  "in_transit"
                )
              }
            >
              <Text
                style={styles.acceptText}
              >
                Start Delivery
              </Text>
            </TouchableOpacity>
          )}

        {/* IN TRANSIT */}
        {isMyDelivery &&
          item.status === "in_transit" && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() =>
                handleUpdateStatus(
                  item.id,
                  "delivered"
                )
              }
            >
              <Text
                style={styles.acceptText}
              >
                Mark as Delivered
              </Text>
            </TouchableOpacity>
          )}

        {/* DELIVERED */}
        {isMyDelivery &&
          item.status === "delivered" && (
            <View
              style={styles.completedBox}
            >
              <Text
                style={styles.completedText}
              >
                ✓ Delivery Completed
              </Text>
            </View>
          )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
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
          <Text
            style={styles.logoutText}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
          />

          <Text
            style={styles.loadingText}
          >
            Loading deliveries...
          </Text>
        </View>
      ) : (
        <FlatList
          data={[]}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.list
          }
          refreshing={loading}
          onRefresh={
            loadAllDeliveries
          }
          ListHeaderComponent={
            <>
              {/* MY ACTIVE DELIVERIES */}
              <Text
                style={styles.sectionTitle}
              >
                My Active Deliveries
              </Text>

              {myDeliveries.length === 0 ? (
                <View
                  style={styles.emptyActive}
                >
                  <Text
                    style={
                      styles.emptyActiveIcon
                    }
                  >
                    🚚
                  </Text>

                  <Text
                    style={
                      styles.emptyActiveTitle
                    }
                  >
                    No active deliveries
                  </Text>

                  <Text
                    style={
                      styles.emptyActiveText
                    }
                  >
                    Accept a delivery to see
                    it here.
                  </Text>
                </View>
              ) : (
                myDeliveries.map(
                  (item) => (
                    <View
                      key={`my-${item.id}`}
                    >
                      {renderDeliveryCard(
                        item,
                        true
                      )}
                    </View>
                  )
                )
              )}

              {/* AVAILABLE DELIVERIES */}
              <Text
                style={[
                  styles.sectionTitle,
                  styles.availableTitle,
                ]}
              >
                Available Deliveries
              </Text>

              {deliveries.length === 0 ? (
                <View
                  style={styles.emptyActive}
                >
                  <Text
                    style={
                      styles.emptyActiveIcon
                    }
                  >
                    📦
                  </Text>

                  <Text
                    style={
                      styles.emptyActiveTitle
                    }
                  >
                    No deliveries available
                  </Text>

                  <Text
                    style={
                      styles.emptyActiveText
                    }
                  >
                    New delivery requests
                    will appear here.
                  </Text>
                </View>
              ) : (
                deliveries.map(
                  (item) => (
                    <View
                      key={`available-${item.id}`}
                    >
                      {renderDeliveryCard(
                        item,
                        false
                      )}
                    </View>
                  )
                )
              )}
            </>
          }
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
    justifyContent:
      "space-between",
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
    marginTop: 30,
    marginBottom: 15,
  },

  availableTitle: {
    marginTop: 35,
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
    justifyContent:
      "space-between",
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
    textTransform:
      "capitalize",
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
    justifyContent:
      "center",
    marginTop: 18,
  },

  acceptText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  completedBox: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent:
      "center",
    marginTop: 18,
  },

  completedText: {
    fontSize: 15,
    fontWeight: "700",
  },

  emptyActive: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginBottom: 10,
  },

  emptyActiveIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyActiveTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  emptyActiveText: {
    color: "#666",
    textAlign: "center",
    marginTop: 6,
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
});