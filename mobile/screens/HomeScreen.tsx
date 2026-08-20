import { useState } from "react";
import MyDeliveriesScreen from "./MyDeliveriesScreen";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logoutUser } from "../api/api";
import CreateDeliveryScreen from "./CreateDeliveryScreen";
import ProfileScreen from "./ProfileScreen";

export default function HomeScreen({
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
  const [showCreateDelivery, setShowCreateDelivery] =
    useState(false);

  const [showMyDeliveries, setShowMyDeliveries] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  if (showCreateDelivery) {
    return (
      <CreateDeliveryScreen
        onBack={() => setShowCreateDelivery(false)}
      />
    );
  }

  if (showMyDeliveries) {
    return (
        <MyDeliveriesScreen
        onBack={() => setShowMyDeliveries(false)}
        />
    );
  }

  if (showProfile) {
    return (
        <ProfileScreen
        user={user}
        onBack={() => setShowProfile(false)}
        onLogout={async () => {
            await logoutUser();
            onLogout();
        }}
        />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.name}>{user.name}</Text>
        </View>

        <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
                await logoutUser();
                onLogout();
            }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          SwiftDrop Delivery
        </Text>

        <Text style={styles.cardText}>
          Send packages quickly and safely.
        </Text>

        <TouchableOpacity
            style={styles.deliveryButton}
            onPress={() => setShowCreateDelivery(true)}
        >
          <Text style={styles.deliveryButtonText}>
            Create Delivery
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowMyDeliveries(true)}
         >
            <Text style={styles.actionTitle}>
              📦 My Deliveries
            </Text>
            <Text style={styles.actionText}>
              Track your deliveries
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowProfile(true)}
          >
            <Text style={styles.actionTitle}>
              👤 Profile
            </Text>
            <Text style={styles.actionText}>
              Manage your account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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

  card: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 24,
    marginTop: 30,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "800",
  },

  cardText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },

  deliveryButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 22,
  },

  deliveryButtonText: {
    color: "#111",
    fontWeight: "700",
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },

  actions: {
    gap: 12,
  },

  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
  },

  actionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  actionText: {
    color: "#666",
    marginTop: 5,
  },
});