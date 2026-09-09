import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Profile</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{user.name}</Text>

      <Text style={styles.role}>
        {user.role}
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>
            {user.phone || "Not provided"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.value}>
            {user.role}
          </Text>
        </View>
      </View>

      {user.role === "customer" && (
        <TouchableOpacity
          style={styles.driverButton}
          onPress={onBecomeDriver}
        >
          <Text style={styles.driverButtonText}>
            🚗 Become a Driver
          </Text>

          <Text style={styles.driverButtonSubtext}>
            Apply to deliver with SwiftDrop
          </Text>
        </TouchableOpacity>
      )}

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