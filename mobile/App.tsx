import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import DriverHomeScreen from "./screens/DriverHomeScreen";

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

function SwiftDropSplash({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const logoOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const logoScale = useRef(
    new Animated.Value(0.75)
  ).current;

  const vehicleX = useRef(
    new Animated.Value(-170)
  ).current;

  const vehicleOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const routeProgress = useRef(
    new Animated.Value(0)
  ).current;

  const shapeOne = useRef(
    new Animated.Value(0)
  ).current;

  const shapeTwo = useRef(
    new Animated.Value(0)
  ).current;

  const splashOpacity = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(shapeOne, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(shapeTwo, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.sequence([
          Animated.delay(250),

          Animated.parallel([
            Animated.timing(logoOpacity, {
              toValue: 1,
              duration: 700,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),

            Animated.spring(logoScale, {
              toValue: 1,
              friction: 7,
              tension: 45,
              useNativeDriver: true,
            }),
          ]),
        ]),

        Animated.sequence([
          Animated.delay(450),

          Animated.parallel([
            Animated.timing(vehicleOpacity, {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }),

            Animated.timing(vehicleX, {
              toValue: 115,
              duration: 1900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),

            Animated.timing(routeProgress, {
              toValue: 1,
              duration: 1900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),

      Animated.delay(450),

      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      onFinish();
    });

    return () => {
      animation.stop();
    };
  }, [
    logoOpacity,
    logoScale,
    vehicleX,
    vehicleOpacity,
    routeProgress,
    shapeOne,
    shapeTwo,
    splashOpacity,
    onFinish,
  ]);

  const shapeOneTranslate =
    shapeOne.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 45],
    });

  const shapeOneRotate =
    shapeOne.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "12deg"],
    });

  const shapeTwoTranslate =
    shapeTwo.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -55],
    });

  const shapeTwoRotate =
    shapeTwo.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "-10deg"],
    });

  // Native Animated does not support animating width.
  // We use scaleX instead.
  const routeScale =
    routeProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

  return (
    <Animated.View
      style={[
        styles.splash,
        {
          opacity: splashOpacity,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.backgroundShapeLarge,
          {
            transform: [
              {
                translateX:
                  shapeOneTranslate,
              },
              {
                rotate: shapeOneRotate,
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.backgroundShapeSmall,
          {
            transform: [
              {
                translateX:
                  shapeTwoTranslate,
              },
              {
                rotate: shapeTwoRotate,
              },
            ],
          },
        ]}
      />

      <View
        style={[
          styles.circle,
          styles.circleOne,
        ]}
      />

      <View
        style={[
          styles.circle,
          styles.circleTwo,
        ]}
      />

      <View style={styles.animationArea}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                {
                  scale: logoScale,
                },
              ],
            },
          ]}
        >
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>
              S
            </Text>
          </View>

          <Text style={styles.logoText}>
            SwiftDrop
          </Text>

          <Text style={styles.tagline}>
            Delivering with speed
          </Text>
        </Animated.View>

        <View style={styles.routeContainer}>
          <View style={styles.routeBase} />

          <Animated.View
            style={[
              styles.routeActive,
              {
                transform: [
                  {
                    scaleX: routeScale,
                  },
                ],
              },
            ]}
          />

          <View
            style={styles.locationDotStart}
          />

          <View
            style={styles.locationDotEnd}
          />
        </View>

        <Animated.View
          style={[
            styles.vehicle,
            {
              opacity: vehicleOpacity,
              transform: [
                {
                  translateX: vehicleX,
                },
              ],
            },
          ]}
        >
          <Text style={styles.vehicleEmoji}>
            🚚
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.bottomTextContainer,
          {
            opacity: logoOpacity,
          },
        ]}
      >
        <Text style={styles.bottomText}>
          Your delivery. Your way.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

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

  splash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#FFF8F1",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  animationArea: {
    width: "100%",
    height: 420,
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
    zIndex: 10,
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F97316",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },

  logoLetter: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
  },

  logoText: {
    marginTop: 14,
    color: "#111827",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  tagline: {
    marginTop: 5,
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  routeContainer: {
    position: "absolute",
    bottom: 78,
    left: 58,
    right: 58,
    height: 34,
    justifyContent: "center",
  },

  routeBase: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 10,
    backgroundColor: "#FDE1C7",
  },

  routeActive: {
    position: "absolute",
    left: 0,
    width: 260,
    height: 4,
    borderRadius: 10,
    backgroundColor: "#F97316",
    transformOrigin: "left center",
  },

  locationDotStart: {
    position: "absolute",
    left: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F97316",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  locationDotEnd: {
    position: "absolute",
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#111827",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  vehicle: {
    position: "absolute",
    bottom: 91,
    left: "50%",
    marginLeft: -30,
    width: 60,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  vehicleEmoji: {
    fontSize: 38,
  },

  backgroundShapeLarge: {
    position: "absolute",
    width: 330,
    height: 330,
    borderRadius: 70,
    backgroundColor: "#FFE7D0",
    top: -130,
    right: -90,
    opacity: 0.8,
  },

  backgroundShapeSmall: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 55,
    backgroundColor: "#FFF0E2",
    bottom: -80,
    left: -90,
    opacity: 0.9,
  },

  circle: {
    position: "absolute",
    borderRadius: 999,
  },

  circleOne: {
    width: 18,
    height: 18,
    backgroundColor: "#F97316",
    top: 150,
    left: 45,
    opacity: 0.3,
  },

  circleTwo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FB923C",
    top: 210,
    right: 55,
    opacity: 0.35,
  },

  bottomTextContainer: {
    position: "absolute",
    bottom: 65,
    alignItems: "center",
  },

  bottomText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});