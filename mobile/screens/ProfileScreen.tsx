import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getMyDriverApplication,
} from "../api/api";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
};

type DriverApplication = {
  id: number;
  vehicle_type: string;
  vehicle_number: string;
  license_number: string;
  status:
    | "pending"
    | "approved"
    | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
};

export default function ProfileScreen({
  user,
  onBack,
  onLogout,
  onBecomeDriver,
}: {
  user: User;
  onBack: () => void;
  onLogout: () => void;
  onBecomeDriver: () => void;
}) {
  const [application, setApplication] =
    useState<DriverApplication | null>(
      null
    );

  const [loadingApplication, setLoadingApplication] =
    useState(false);

  const loadApplication = async () => {
    if (user.role !== "customer") {
      return;
    }

    try {
      setLoadingApplication(true);

      const response =
        await getMyDriverApplication();

      setApplication(
        response.application || null
      );
    } catch (error) {
      console.error(
        "Failed to load driver application:",
        error
      );
    } finally {
      setLoadingApplication(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [user.role]);

  const renderDriverApplicationSection = () => {
    if (user.role !== "customer") {
      return null;
    }

    if (loadingApplication) {
      return (
        <View
          style={styles.applicationLoading}
        >
          <ActivityIndicator />

          <Text
            style={styles.loadingText}
          >
            Checking driver application...
          </Text>
        </View>
      );
    }

    if (!application) {
      return (
        <TouchableOpacity
          style={styles.driverButton}
          onPress={onBecomeDriver}
        >
          <Text
            style={styles.driverButtonText}
          >
            🚗 Become a Driver
          </Text>

          <Text
            style={styles.driverButtonSubtext}
          >
            Apply to deliver with SwiftDrop
          </Text>
        </TouchableOpacity>
      );
    }

    if (application.status === "pending") {
      return (
        <View
          style={[
            styles.applicationCard,
            styles.pendingCard,
          ]}
        >
          <View style={styles.statusRow}>
            <Text
              style={styles.applicationIcon}
            >
              🕐
            </Text>

            <View
              style={styles.statusContent}
            >
              <Text
                style={styles.applicationTitle}
              >
                Driver Application Pending
              </Text>

              <Text
                style={styles.applicationText}
              >
                Your application is currently
                under review by the SwiftDrop
                admin team.
              </Text>
            </View>
          </View>

          <View
            style={styles.applicationInfo}
          >
            <Text
              style={styles.infoText}
            >
              Vehicle:{" "}
              {application.vehicle_type}
            </Text>

            <Text
              style={styles.infoText}
            >
              Vehicle Number:{" "}
              {application.vehicle_number}
            </Text>
          </View>
        </View>
      );
    }

    if (application.status === "rejected") {
      return (
        <View
          style={[
            styles.applicationCard,
            styles.rejectedCard,
          ]}
        >
          <View style={styles.statusRow}>
            <Text
              style={styles.applicationIcon}
            >
              ❌
            </Text>

            <View
              style={styles.statusContent}
            >
              <Text
                style={styles.applicationTitle}
              >
                Driver Application Rejected
              </Text>

              <Text
                style={styles.applicationText}
              >
                Your previous application was
                rejected. You can submit a new
                application.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.reapplyButton}
            onPress={onBecomeDriver}
          >
            <Text
              style={styles.reapplyButtonText}
            >
              Apply Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>
        My Profile
      </Text>

      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name
            .charAt(0)
            .toUpperCase()}
        </Text>
      </View>

      {/* Name */}
      <Text style={styles.name}>
        {user.name}
      </Text>

      {/* Role */}
      <Text style={styles.role}>
        {user.role}
      </Text>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>
            Full Name
          </Text>

          <Text style={styles.value}>
            {user.name}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>
            Email
          </Text>

          <Text style={styles.value}>
            {user.email}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>
            Phone
          </Text>

          <Text style={styles.value}>
            {user.phone || "Not provided"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>
            Account Type
          </Text>

          <Text style={styles.value}>
            {user.role}
          </Text>
        </View>
      </View>

      {/* Driver Application */}
      {renderDriverApplicationSection()}

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>
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

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 25,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
  },

  name: {
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 15,
  },

  role: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    textTransform: "capitalize",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginTop: 30,
  },

  row: {
    paddingVertical: 5,
  },

  label: {
    fontSize: 12,
    color: "#888",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },

  driverButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    padding: 17,
    marginTop: 20,
  },

  driverButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },

  driverButtonSubtext: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
  },

  applicationLoading: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
  },

  applicationCard: {
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
  },

  pendingCard: {
    backgroundColor: "#fff9e6",
    borderColor: "#f0d98c",
  },

  rejectedCard: {
    backgroundColor: "#fff0f0",
    borderColor: "#f0b5b5",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  applicationIcon: {
    fontSize: 27,
    marginRight: 12,
  },

  statusContent: {
    flex: 1,
  },

  applicationTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  applicationText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 19,
    marginTop: 5,
  },

  applicationInfo: {
    borderTopWidth: 1,
    borderTopColor: "#eadfbf",
    marginTop: 15,
    paddingTop: 12,
  },

  infoText: {
    fontSize: 13,
    color: "#555",
    marginTop: 3,
  },

  reapplyButton: {
    backgroundColor: "#111",
    borderRadius: 11,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  reapplyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  logoutButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});