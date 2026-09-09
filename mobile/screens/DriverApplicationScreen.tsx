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
import { submitDriverApplication } from "../api/api";

const vehicleOptions = [
  {
    label: "Motorbike",
    icon: "🏍️",
  },
  {
    label: "Car",
    icon: "🚗",
  },
  {
    label: "Van",
    icon: "🚐",
  },
  {
    label: "Truck",
    icon: "🚚",
  },
];

export default function DriverApplicationScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVehicleOptions, setShowVehicleOptions] =
    useState(false);

  const handleSelectVehicle = (vehicle: string) => {
    setVehicleType(vehicle);
    setShowVehicleOptions(false);
  };

  const handleSubmitApplication = async () => {
    if (
      !vehicleType.trim() ||
      !vehicleNumber.trim() ||
      !licenseNumber.trim()
    ) {
      Alert.alert(
        "Driver Application",
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await submitDriverApplication({
        vehicle_type: vehicleType.trim(),
        vehicle_number: vehicleNumber.trim(),
        license_number: licenseNumber.trim(),
      });

      console.log(
        "✅ Driver application submitted:",
        data
      );

      Alert.alert(
        "Application Submitted",
        "Your driver application has been submitted successfully. Please wait for admin approval.",
        [
          {
            text: "OK",
            onPress: onBack,
          },
        ]
      );

      setVehicleType("");
      setVehicleNumber("");
      setLicenseNumber("");
    } catch (error: any) {
      console.error(
        "❌ Driver application failed:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Application Failed",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
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
          disabled={loading}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Become a Driver
        </Text>

        <Text style={styles.subtitle}>
          Submit your vehicle and license details to
          apply as a SwiftDrop driver.
        </Text>

        <Text style={styles.label}>
          Vehicle Type
        </Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() =>
            setShowVehicleOptions(!showVehicleOptions)
          }
          disabled={loading}
        >
          <Text
            style={
              vehicleType
                ? styles.dropdownText
                : styles.placeholderText
            }
          >
            {vehicleType
              ? vehicleOptions.find(
                  (vehicle) =>
                    vehicle.label === vehicleType
                )?.icon +
                " " +
                vehicleType
              : "Select vehicle type"}
          </Text>

          <Text style={styles.arrow}>
            {showVehicleOptions ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {showVehicleOptions && (
          <View style={styles.optionsContainer}>
            {vehicleOptions.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.label}
                style={styles.option}
                onPress={() =>
                  handleSelectVehicle(
                    vehicle.label
                  )
                }
              >
                <Text style={styles.optionText}>
                  {vehicle.icon} {vehicle.label}
                </Text>

                {vehicleType === vehicle.label && (
                  <Text style={styles.check}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>
          Vehicle Number
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: WP ABC-1234"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>
          Driving License Number
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your license number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmitApplication}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Submitting..."
              : "Submit Application"}
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
    lineHeight: 22,
    marginTop: 7,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  dropdown: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  dropdownText: {
    fontSize: 16,
    color: "#111",
  },

  placeholderText: {
    fontSize: 16,
    color: "#999",
  },

  arrow: {
    fontSize: 12,
    color: "#555",
  },

  optionsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },

  option: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },

  check: {
    fontSize: 18,
    fontWeight: "800",
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