import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import { getStoredUser } from "./api/api";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedUser = await getStoredUser();

        if (storedUser) {
          console.log("✅ Existing session restored");
          setUser(storedUser);
        } else {
          console.log("ℹ️ No active session");
        }
      } catch (error) {
        console.error("❌ Session restore failed:", error);
      } finally {
        setCheckingSession(false);
      }
    }

    restoreSession();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
  };

  if (checkingSession) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {user ? (
        <HomeScreen
          user={user}
          onLogout={handleLogout}
        />
      ) : showRegister ? (
        <RegisterScreen
          onLogin={() => setShowRegister(false)}
        />
      ) : (
        <LoginScreen
          onRegister={() => setShowRegister(true)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});