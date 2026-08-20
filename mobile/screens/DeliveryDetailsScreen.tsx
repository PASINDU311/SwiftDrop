import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  cancelDelivery,
  getDeliveryById,
} from "../api/api";

type Delivery = {
  id: number;
  pickup_address: string;
  delivery_address: string;
  package_description: string | null;
  package_weight: number | null;
  status: string;
  driver_id: number | null;
  created_at: string;
  updated_at: string;
};

const deliveryStatuses = [
  "pending",
  "accepted",
  "picked_up",
  "in_transit",
  "delivered",
];

export default function DeliveryDetailsScreen({
  deliveryId,
  onBack,
}: {
  deliveryId: number;
  onBack: () => void;
}) {
  const [delivery, setDelivery] =
    useState<Delivery | null>(null);

  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const loadDelivery = async () => {
    try {
      setLoading(true);

      const data = await getDeliveryById(deliveryId);

      setDelivery(data.delivery);

      console.log(
        "✅ Delivery details loaded:",
        data.delivery
      );
    } catch (error: any) {
      console.error(
        "❌ Failed to load delivery:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to load delivery."
      );

      onBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDelivery();
  }, [deliveryId]);

  const handleCancelDelivery = () => {
    Alert.alert(
      "Cancel Delivery",
      "Are you sure you want to cancel this delivery?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelling(true);

              await cancelDelivery(deliveryId);

              console.log(
                "✅ Delivery cancelled successfully"
              );

              Alert.alert(
                "Cancelled",
                "Your delivery has been cancelled."
              );

              await loadDelivery();
            } catch (error: any) {
              console.error(
                "❌ Cancel delivery failed:",
                error.response?.data ||
                  error.message
              );

              Alert.alert(
                "Cancellation Failed",
                error.response?.data?.message ||
                  "Unable to cancel delivery."
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading delivery...
        </Text>
      </View>
    );
  }

  if (!delivery) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Delivery #{delivery.id}
      </Text>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>
          {delivery.status}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Delivery Route
        </Text>

        <Text style={styles.label}>Pickup</Text>

        <Text style={styles.address}>
          {delivery.pickup_address}
        </Text>

        <Text style={styles.arrow}>↓</Text>

        <Text style={styles.label}>Delivery</Text>

        <Text style={styles.address}>
          {delivery.delivery_address}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Package Information
        </Text>

        <Text style={styles.info}>
          Description:{" "}
          {delivery.package_description ||
            "Not specified"}
        </Text>

        <Text style={styles.info}>
          Weight:{" "}
          {delivery.package_weight !== null
            ? `${delivery.package_weight} kg`
            : "Not specified"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
            Delivery Status
        </Text>

        {deliveryStatuses.map((status, index) => {
            const currentIndex =
                deliveryStatuses.indexOf(delivery.status);

            const isCompleted =
                index <= currentIndex;

            return (
                <View
                    key={status}
                    style={styles.statusRow}
                >
                    <View
                        style={[
                            styles.statusCircle,
                            isCompleted &&
                                styles.statusCircleActive,
                        ]}
                    >
                        <Text style={styles.statusCircleText}>
                            {isCompleted ? "✓" : index + 1}
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.statusLabel,
                            isCompleted &&
                                styles.statusLabelActive,
                        ]}
                    >
                        {status.replace("_", " ")}
                    </Text>
                </View>
                );
            })}

            {delivery.status === "cancelled" && (
                <Text style={styles.cancelledText}>
                    This delivery has been cancelled.
                </Text>
            )}

            {delivery.driver_id ? (
                <Text style={styles.statusInfo}>
                    Driver assigned
                </Text>
            ) : (
                <Text style={styles.statusInfo}>
                    Waiting for driver
                </Text>
            )}
         </View>

      {delivery.status === "pending" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelDelivery}
          disabled={cancelling}
        >
          <Text style={styles.cancelButtonText}>
            {cancelling
              ? "Cancelling..."
              : "Cancel Delivery"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
    padding: 24,
    paddingTop: 55,
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

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 25,
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 12,
  },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff3cd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 20,
  },

  statusText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
  },

  address: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },

  arrow: {
    fontSize: 22,
    color: "#888",
    marginVertical: 8,
  },

  info: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
  },

  statusInfo: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  statusCircleActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },

  statusCircleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
  },

  statusLabel: {
    fontSize: 15,
    color: "#888",
    textTransform: "capitalize",
  },

  statusLabelActive: {
    color: "#111",
    fontWeight: "700",
  },

  cancelledText: {
    color: "#d32f2f",
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 12,
  },

  cancelButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#d32f2f",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});