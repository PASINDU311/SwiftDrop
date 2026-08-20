import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createDelivery } from "../api/api";

export default function CreateDeliveryScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [packageDescription, setPackageDescription] =
    useState("");
  const [packageWeight, setPackageWeight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateDelivery = async () => {
    if (!pickupAddress || !deliveryAddress) {
      Alert.alert(
        "Create Delivery",
        "Pickup and delivery addresses are required."
      );
      return;
    }

    if (packageWeight) {
        const weight = Number(packageWeight);

        if (isNaN(weight) || weight <= 0) {
            Alert.alert(
                "Create Delivery",
                "Please enter a valid package weight."
            );
            return;
        }
    }

    try {
      setLoading(true);

      const data = await createDelivery({
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        package_description:
          packageDescription || undefined,
        package_weight: packageWeight
          ? Number(packageWeight)
          : undefined,
      });

      console.log(
        "✅ Delivery created:",
        data.delivery
      );

      Alert.alert(
        "Success",
        "Your delivery has been created successfully."
      );

      setPickupAddress("");
      setDeliveryAddress("");
      setPackageDescription("");
      setPackageWeight("");

      onBack();
    } catch (error: any) {
      console.error(
        "❌ Create delivery failed:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Delivery Failed",
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Create Delivery
        </Text>

        <Text style={styles.subtitle}>
          Enter the details of your package
        </Text>

        <Text style={styles.label}>
          Pickup Address
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter pickup address"
          value={pickupAddress}
          onChangeText={setPickupAddress}
        />

        <Text style={styles.label}>
          Delivery Address
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter delivery address"
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
        />

        <Text style={styles.label}>
          Package Description
        </Text>

        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Example: Documents, clothes..."
          value={packageDescription}
          onChangeText={setPackageDescription}
          multiline
        />

        <Text style={styles.label}>
          Package Weight (kg)
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: 2.5"
          value={packageWeight}
          onChangeText={setPackageWeight}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateDelivery}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Creating..."
              : "Create Delivery"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  content: {
    padding: 24,
    paddingTop: 55,
    paddingBottom: 40,
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
  },

  subtitle: {
    color: "#666",
    fontSize: 15,
    marginTop: 7,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },

  multiline: {
    height: 90,
    paddingTop: 15,
    textAlignVertical: "top",
  },

  button: {
    height: 54,
    borderRadius: 13,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});