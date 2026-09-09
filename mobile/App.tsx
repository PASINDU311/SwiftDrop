import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import DriverHomeScreen from "./screens/DriverHomeScreen";

import SwiftDropSplash from "./SwiftDropSplash";

import {
  getStoredUser,
  logoutUser,
} from "./api/api";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export default function App() {
  const [showRegister, setShowRegister] =
    useState(false);

  const [user, setUser] =
    useState<User | null>(null);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [showSplash, setShowSplash] =
    useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedUser =
          await getStoredUser();

        if (storedUser) {
          console.log(
            "✅ Existing session restored"
          );

          setUser(storedUser);
        } else {
          console.log(
            "ℹ️ No active session"
          );
        }
      } catch (error) {
        console.error(
          "❌ Session restore failed:",
          error
        );
      } finally {
        setCheckingSession(false);
      }
    }

    restoreSession();
  }, []);

  const handleLoginSuccess = (
    loggedInUser: User
  ) => {
    setUser(loggedInUser);
    setShowRegister(false);
  };

  const handleLogout = useCallback(
    async () => {
      try {
        await logoutUser();

        setUser(null);
        setShowRegister(false);

        console.log(
          "✅ User logged out successfully"
        );
      } catch (error) {
        console.error(
          "❌ Logout failed:",
          error
        );
      }
    },
    []
  );

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.container}>
        <SwiftDropSplash
          onFinish={handleSplashFinish}
        />

        <StatusBar style="dark" />
      </View>
    );
  }

  if (checkingSession) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        user.role === "driver" ? (
          <DriverHomeScreen
            user={user}
            onLogout={handleLogout}
          />
        ) : (
          <HomeScreen
            user={user}
            onLogout={handleLogout}
          />
        )
      ) : showRegister ? (
        <RegisterScreen
          onLogin={() =>
            setShowRegister(false)
          }
        />
      ) : (
        <LoginScreen
          onRegister={() =>
            setShowRegister(true)
          }
          onLoginSuccess={
            handleLoginSuccess
          }
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});