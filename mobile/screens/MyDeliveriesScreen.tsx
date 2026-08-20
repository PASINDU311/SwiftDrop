import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMyDeliveries } from "../api/api";
import DeliveryDetailsScreen from "./DeliveryDetailsScreen";

type Delivery = {
  id: number;
  pickup_address: string;
  delivery_address: string;
  package_description: string | null;
  package_weight: number | null;
  status: string;
  driver_id: number | null;
  created_at: string;
};

export default function MyDeliveriesScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDeliveryId, setSelectedDeliveryId] =
    useState<number | null>(null);

  const loadDeliveries = async () => {
    try {
      setLoading(true);

      const data = await getMyDeliveries();

      setDeliveries(data.deliveries || []);

      console.log(
        "✅ My deliveries loaded:",
        data.deliveries
      );
    } catch (error: any) {
      console.error(
        "❌ Failed to load deliveries:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  // Open Delivery Details
  if (selectedDeliveryId !== null) {
    return (
      <DeliveryDetailsScreen
        deliveryId={selectedDeliveryId}
        onBack={() => setSelectedDeliveryId(null)}
      />
    );
  }

  const renderDelivery = ({
    item,
  }: {
    item: Delivery;
  }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedDeliveryId(item.id)}
        activeOpacity={0.8}
      >
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

        <View style={styles.locationSection}>
          <Text style={styles.label}>Pickup</Text>

          <Text style={styles.address}>
            {item.pickup_address}
          </Text>

          <Text style={styles.arrow}>↓</Text>

          <Text style={styles.label}>Delivery</Text>

          <Text style={styles.address}>
            {item.delivery_address}
          </Text>
        </View>

        {item.package_description && (
          <Text style={styles.packageText}>
            📦 {item.package_description}
          </Text>
        )}

        {item.package_weight !== null && (
          <Text style={styles.packageText}>
            ⚖️ {item.package_weight} kg
          </Text>
        )}

        <Text style={styles.viewDetails}>
          Tap to view details →
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Deliveries</Text>

        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Loading deliveries...
          </Text>
        </View>
      ) : deliveries.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📦</Text>

          <Text style={styles.emptyTitle}>
            No deliveries yet
          </Text>

          <Text style={styles.emptyText}>
            Your created deliveries will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDelivery}
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
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 45,
  },

  list: {
    padding: 24,
    paddingTop: 5,
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

  locationSection: {
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
  },

  address: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },

  arrow: {
    fontSize: 20,
    color: "#888",
    marginVertical: 6,
  },

  packageText: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },

  viewDetails: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 15,
    color: "#111",
    textAlign: "right",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
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