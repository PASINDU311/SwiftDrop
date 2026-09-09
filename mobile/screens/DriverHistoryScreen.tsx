import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getDriverDeliveryHistory } from "../api/api";

type Delivery = {
  id: number;
  pickup_address: string;
  delivery_address: string;
  package_description: string | null;
  package_weight: number | null;
  delivery_fee: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function DriverHistoryScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [deliveries, setDeliveries] =
    useState<Delivery[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data =
        await getDriverDeliveryHistory();

      setDeliveries(
        data.deliveries || []
      );
    } catch (error) {
      console.error(
        "Load driver history error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading history...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backButtonText}>
          ← Back
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Delivery History
      </Text>

      {deliveries.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No completed deliveries yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) =>
            item.id.toString()
          }
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* HEADER */}
              <View style={styles.header}>
                <Text
                  style={styles.deliveryId}
                >
                  Delivery #{item.id}
                </Text>

                <Text style={styles.status}>
                  {item.status
                    .replace("_", " ")
                    .toUpperCase()}
                </Text>
              </View>

              {/* PICKUP */}
              <Text style={styles.label}>
                Pickup
              </Text>

              <Text style={styles.address}>
                {item.pickup_address}
              </Text>

              {/* DELIVERY */}
              <Text style={styles.label}>
                Delivery
              </Text>

              <Text style={styles.address}>
                {item.delivery_address}
              </Text>

              {/* PACKAGE */}
              {item.package_description && (
                <>
                  <Text
                    style={styles.label}
                  >
                    Package
                  </Text>

                  <Text
                    style={styles.address}
                  >
                    {item.package_description}
                  </Text>
                </>
              )}

              {/* WEIGHT */}
              {item.package_weight !== null && (
                <Text style={styles.weight}>
                  Weight:{" "}
                  {item.package_weight} kg
                </Text>
              )}

              {/* DELIVERY FEE */}
              {item.delivery_fee !== null && (
                <View
                  style={
                    styles.feeContainer
                  }
                >
                  <Text
                    style={styles.feeLabel}
                  >
                    Delivery Fee
                  </Text>

                  <Text
                    style={styles.feeText}
                  >
                    Rs.{" "}
                    {Number(
                      item.delivery_fee
                    ).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
    padding: 20,
    paddingTop: 55,
  },

  backButton: {
    marginBottom: 15,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  deliveryId: {
    fontSize: 17,
    fontWeight: "700",
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#777",
    marginTop: 8,
  },

  address: {
    fontSize: 15,
    marginTop: 3,
  },

  weight: {
    fontSize: 13,
    color: "#666",
    marginTop: 12,
  },

  feeContainer: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  feeLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },

  feeText: {
    fontSize: 17,
    fontWeight: "800",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },

  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});