/**
 * SwiftDropSplash.tsx
 * Advanced animated SwiftDrop intro splash
 */

import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Circle,
} from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

// ----------------------------------------------------
// Layout
// ----------------------------------------------------

const TRACK_W = 300;
const TRACK_H = 140;
const ICON_SIZE = 44;

// Curved route points
const P0 = { x: 20, y: 110 };
const P1 = { x: 150, y: 20 };
const P2 = { x: 280, y: 90 };

function bezier(t: number) {
  const mt = 1 - t;

  return {
    x:
      mt * mt * P0.x +
      2 * mt * t * P1.x +
      t * t * P2.x,

    y:
      mt * mt * P0.y +
      2 * mt * t * P1.y +
      t * t * P2.y,
  };
}

const SAMPLE_TS = [0, 0.25, 0.5, 0.75, 1];

const SAMPLE_PTS = SAMPLE_TS.map(bezier);

const X_RANGE = SAMPLE_PTS.map(
  (point) => point.x - ICON_SIZE / 2
);

const Y_RANGE = SAMPLE_PTS.map(
  (point) => point.y - ICON_SIZE / 2
);

// Dust positions
const PUFF_TS = [0.15, 0.4, 0.65, 0.85];

const PUFF_PTS = PUFF_TS.map(bezier);

// SVG route
const SVG_PATH_D =
  `M${P0.x},${P0.y} ` +
  `Q${P1.x},${P1.y} ${P2.x},${P2.y}`;

const PATH_LEN = 320;

// Logo letters
const LETTERS = "SwiftDrop".split("");

// Confetti
const CONFETTI_COLORS = [
  "#F97316",
  "#FB923C",
  "#111827",
  "#FBBF24",
  "#FDBA74",
];

const CONFETTI = Array.from({ length: 10 }).map((_, index) => {
  const angle =
    (Math.PI * 2 * index) / 10 +
    Math.random() * 0.3;

  const distance =
    55 + Math.random() * 35;

  return {
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    color:
      CONFETTI_COLORS[
        index % CONFETTI_COLORS.length
      ],
    size:
      6 + Math.round(Math.random() * 4),
  };
});

// ----------------------------------------------------
// Component
// ----------------------------------------------------

export default function SwiftDropSplash({
  onFinish,
}: {
  onFinish: () => void;
}) {
  // Background
  const bgFade = useRef(
    new Animated.Value(0)
  ).current;

  const gradientCross = useRef(
    new Animated.Value(0)
  ).current;

  const shapeOne = useRef(
    new Animated.Value(0)
  ).current;

  const shapeTwo = useRef(
    new Animated.Value(0)
  ).current;

  // Logo
  const logoOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const logoScale = useRef(
    new Animated.Value(0.6)
  ).current;

  const logoRotateY = useRef(
    new Animated.Value(1)
  ).current;

  const ringScale = useRef(
    new Animated.Value(0.8)
  ).current;

  const ringOpacity = useRef(
    new Animated.Value(0)
  ).current;

  // Letters
  const letterAnims = useMemo(
    () =>
      LETTERS.map(
        () => new Animated.Value(0)
      ),
    []
  );

  // Vehicle + route
  const routeProgress = useRef(
    new Animated.Value(0)
  ).current;

  const vehicleProgress = useRef(
    new Animated.Value(0)
  ).current;

  const vehicleOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const puffAnims = useMemo(
    () =>
      PUFF_TS.map(
        () => new Animated.Value(0)
      ),
    []
  );

  // Arrival
  const pinDrop = useRef(
    new Animated.Value(0)
  ).current;

  const rippleScale = useRef(
    new Animated.Value(0)
  ).current;

  const rippleOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const confettiAnims = useMemo(
    () =>
      CONFETTI.map(
        () => new Animated.Value(0)
      ),
    []
  );

  // Bottom tagline
  const taglineOpacity = useRef(
    new Animated.Value(0)
  ).current;

  // Exit
  const splashOpacity = useRef(
    new Animated.Value(1)
  ).current;

  const splashScale = useRef(
    new Animated.Value(1)
  ).current;

  // --------------------------------------------------
  // Animation timeline
  // --------------------------------------------------

  useEffect(() => {
    const gradientLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(
          gradientCross,
          {
            toValue: 1,
            duration: 2600,
            easing: Easing.inOut(
              Easing.ease
            ),
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          gradientCross,
          {
            toValue: 0,
            duration: 2600,
            easing: Easing.inOut(
              Easing.ease
            ),
            useNativeDriver: true,
          }
        ),
      ])
    );

    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(
            ringScale,
            {
              toValue: 1.35,
              duration: 1100,
              easing: Easing.out(
                Easing.ease
              ),
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            ringOpacity,
            {
              toValue: 0,
              duration: 1100,
              easing: Easing.out(
                Easing.ease
              ),
              useNativeDriver: true,
            }
          ),
        ]),

        Animated.timing(
          ringScale,
          {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          ringOpacity,
          {
            toValue: 0.35,
            duration: 0,
            useNativeDriver: true,
          }
        ),
      ])
    );

    gradientLoop.start();
    ringLoop.start();

    // Dust animations
    const puffSequence = puffAnims.map(
      (value, index) =>
        Animated.sequence([
          Animated.delay(
            650 +
              PUFF_TS[index] * 1750
          ),

          Animated.timing(
            value,
            {
              toValue: 1,
              duration: 480,
              easing: Easing.out(
                Easing.ease
              ),
              useNativeDriver: true,
            }
          ),
        ])
    );

    // Confetti animations
    const confettiSequence =
      confettiAnims.map((value) =>
        Animated.timing(
          value,
          {
            toValue: 1,
            duration: 750,
            easing: Easing.out(
              Easing.cubic
            ),
            useNativeDriver: true,
          }
        )
      );

    // Main timeline
    const timeline = Animated.sequence([
      // ----------------------------------------------
      // 1. Background
      // ----------------------------------------------

      Animated.parallel([
        Animated.timing(
          bgFade,
          {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shapeOne,
          {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(
              Easing.ease
            ),
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shapeTwo,
          {
            toValue: 1,
            duration: 2600,
            easing: Easing.inOut(
              Easing.ease
            ),
            useNativeDriver: true,
          }
        ),
      ]),

      // ----------------------------------------------
      // 2. Logo
      // ----------------------------------------------

      Animated.sequence([
        Animated.delay(200),

        Animated.parallel([
          Animated.timing(
            logoOpacity,
            {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            logoRotateY,
            {
              toValue: 0,
              duration: 650,
              easing: Easing.out(
                Easing.cubic
              ),
              useNativeDriver: true,
            }
          ),

          Animated.spring(
            logoScale,
            {
              toValue: 1,
              friction: 6,
              tension: 50,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            ringOpacity,
            {
              toValue: 0.35,
              duration: 400,
              useNativeDriver: true,
            }
          ),
        ]),
      ]),

      // ----------------------------------------------
      // 3. Letter reveal
      // ----------------------------------------------

      Animated.sequence([
        Animated.delay(500),

        Animated.stagger(
          45,
          letterAnims.map(
            (value) =>
              Animated.spring(
                value,
                {
                  toValue: 1,
                  friction: 7,
                  tension: 60,
                  useNativeDriver: true,
                }
              )
          )
        ),
      ]),

      // ----------------------------------------------
      // 4. Truck route
      // ----------------------------------------------

      Animated.sequence([
        Animated.delay(650),

        Animated.parallel([
          Animated.timing(
            vehicleOpacity,
            {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            vehicleProgress,
            {
              toValue: 1,
              duration: 1750,
              easing: Easing.inOut(
                Easing.ease
              ),
              useNativeDriver: true,
            }
          ),

          // IMPORTANT:
          // SVG strokeDashoffset requires JS driver.
          Animated.timing(
            routeProgress,
            {
              toValue: 1,
              duration: 1750,
              easing: Easing.inOut(
                Easing.ease
              ),
              useNativeDriver: false,
            }
          ),

          ...puffSequence,
        ]),
      ]),

      // ----------------------------------------------
      // 5. Arrival
      // ----------------------------------------------

      Animated.parallel([
        Animated.spring(
          pinDrop,
          {
            toValue: 1,
            friction: 5,
            tension: 80,
            useNativeDriver: true,
          }
        ),

        Animated.sequence([
          Animated.timing(
            rippleOpacity,
            {
              toValue: 0.5,
              duration: 100,
              useNativeDriver: true,
            }
          ),

          Animated.parallel([
            Animated.timing(
              rippleScale,
              {
                toValue: 3,
                duration: 700,
                easing: Easing.out(
                  Easing.ease
                ),
                useNativeDriver: true,
              }
            ),

            Animated.timing(
              rippleOpacity,
              {
                toValue: 0,
                duration: 700,
                easing: Easing.out(
                  Easing.ease
                ),
                useNativeDriver: true,
              }
            ),
          ]),
        ]),

        Animated.stagger(
          20,
          confettiSequence
        ),

        Animated.timing(
          taglineOpacity,
          {
            toValue: 1,
            duration: 450,
            delay: 150,
            useNativeDriver: true,
          }
        ),
      ]),

      // ----------------------------------------------
      // 6. Hold
      // ----------------------------------------------

      Animated.delay(500),

      // ----------------------------------------------
      // 7. Exit
      // ----------------------------------------------

      Animated.parallel([
        Animated.timing(
          splashOpacity,
          {
            toValue: 0,
            duration: 450,
            easing: Easing.out(
              Easing.ease
            ),
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          splashScale,
          {
            toValue: 1.12,
            duration: 450,
            easing: Easing.out(
              Easing.ease
            ),
            useNativeDriver: true,
          }
        ),
      ]),
    ]);

    timeline.start(({ finished }) => {
      gradientLoop.stop();
      ringLoop.stop();

      if (finished) {
        onFinish();
      }
    });

    return () => {
      timeline.stop();
      gradientLoop.stop();
      ringLoop.stop();
    };

    // Animation refs intentionally stay stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // Interpolations
  // --------------------------------------------------

  const shapeOneTranslate =
    shapeOne.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 45],
    });

  const shapeOneRotate =
    shapeOne.interpolate({
      inputRange: [0, 1],
      outputRange: [
        "0deg",
        "25deg",
      ],
  });

  const shapeTwoTranslate =
    shapeTwo.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -55],
    });

  const shapeTwoRotate =
    shapeTwo.interpolate({
      inputRange: [0, 1],
      outputRange: [
        "0deg",
        "-18deg",
      ],
    });

  const vehicleLeft =
    vehicleProgress.interpolate({
      inputRange: SAMPLE_TS,
      outputRange: X_RANGE,
    });

  const vehicleTop =
    vehicleProgress.interpolate({
      inputRange: SAMPLE_TS,
      outputRange: Y_RANGE,
    });

  const vehicleTilt =
    vehicleProgress.interpolate({
      inputRange: [
        0,
        0.25,
        0.5,
        0.75,
        1,
      ],
      outputRange: [
        "-4deg",
        "10deg",
        "-8deg",
        "6deg",
        "0deg",
      ],
    });

  const vehicleBounce =
    vehicleProgress.interpolate({
      inputRange: [
        0,
        0.12,
        0.25,
        0.37,
        0.5,
        0.62,
        0.75,
        0.87,
        1,
      ],
      outputRange: [
        0,
        -4,
        0,
        -4,
        0,
        -4,
        0,
        -4,
        0,
      ],
    });

  const strokeDashoffset =
    routeProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [
        PATH_LEN,
        0,
      ],
    });

  const logoRotateYDeg =
    logoRotateY.interpolate({
      inputRange: [0, 1],
      outputRange: [
        "0deg",
        "90deg",
      ],
    });

  const pinTranslateY =
    pinDrop.interpolate({
      inputRange: [0, 1],
      outputRange: [-24, 0],
    });

  const pinOpacity = pinDrop;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Animated.View
      style={[
        styles.splash,
        {
          opacity:
            Animated.multiply(
              bgFade,
              splashOpacity
            ),
          transform: [
            {
              scale: splashScale,
            },
          ],
        },
      ]}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={[
          "#FFF8F1",
          "#FFE7D0",
        ]}
        style={
          StyleSheet.absoluteFill
        }
      />

      {/* Cross fading gradient */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: gradientCross,
          },
        ]}
      >
        <LinearGradient
          colors={[
            "#FFEFE0",
            "#FFD9B3",
          ]}
          style={
            StyleSheet.absoluteFill
          }
        />
      </Animated.View>

      {/* Background shapes */}
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
                rotate:
                  shapeOneRotate,
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
                rotate:
                  shapeTwoRotate,
              },
            ],
          },
        ]}
      />

      <View style={styles.animationArea}>
        {/* ------------------------------------------ */}
        {/* Logo */}
        {/* ------------------------------------------ */}

        <View style={styles.logoWrap}>
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity:
                  ringOpacity,
                transform: [
                  {
                    scale: ringScale,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity:
                  logoOpacity,

                transform: [
                  {
                    perspective: 600,
                  },
                  {
                    rotateY:
                      logoRotateYDeg,
                  },
                  {
                    scale: logoScale,
                  },
                ],
              },
            ]}
          >
            <View style={styles.logoBox}>
              <Text
                style={styles.logoLetter}
              >
                S
              </Text>
            </View>

            <View style={styles.wordRow}>
              {LETTERS.map(
                (character, index) => {
                  const animation =
                    letterAnims[index];

                  const translateY =
                    animation.interpolate(
                      {
                        inputRange: [0, 1],
                        outputRange: [
                          16,
                          0,
                        ],
                      }
                    );

                  const rotateX =
                    animation.interpolate(
                      {
                        inputRange: [0, 1],
                        outputRange: [
                          "70deg",
                          "0deg",
                        ],
                      }
                    );

                  return (
                    <Animated.Text
                      key={`${character}-${index}`}
                      style={[
                        styles.logoText,
                        {
                          opacity:
                            animation,

                          transform: [
                            {
                              perspective:
                                400,
                            },
                            {
                              translateY,
                            },
                            {
                              rotateX,
                            },
                          ],
                        },
                      ]}
                    >
                      {character}
                    </Animated.Text>
                  );
                }
              )}
            </View>

            <Text
              style={styles.tagline}
            >
              Delivering with speed
            </Text>
          </Animated.View>
        </View>

        {/* ------------------------------------------ */}
        {/* Route */}
        {/* ------------------------------------------ */}

        <View style={styles.trackArea}>
          <Svg
            width={TRACK_W}
            height={TRACK_H}
            viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
          >
            {/* Base route */}
            <Path
              d={SVG_PATH_D}
              stroke="#FDE1C7"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />

            {/* Animated route */}
            <AnimatedPath
              d={SVG_PATH_D}
              stroke="#F97316"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={[
                PATH_LEN,
                PATH_LEN,
              ]}
              strokeDashoffset={
                strokeDashoffset
              }
            />

            {/* Start point */}
            <Circle
              cx={P0.x}
              cy={P0.y}
              r={6}
              fill="#F97316"
              stroke="#FFFFFF"
              strokeWidth={3}
            />
          </Svg>

          {/* Dust */}
          {puffAnims.map(
            (value, index) => {
              const opacity =
                value.interpolate({
                  inputRange: [
                    0,
                    0.5,
                    1,
                  ],
                  outputRange: [
                    0,
                    0.6,
                    0,
                  ],
                });

              const scale =
                value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    0.3,
                    1.4,
                  ],
                });

              return (
                <Animated.View
                  key={index}
                  pointerEvents="none"
                  style={[
                    styles.dustPuff,
                    {
                      left:
                        PUFF_PTS[index]
                          .x - 6,
                      top:
                        PUFF_PTS[index]
                          .y - 6,
                      opacity,
                      transform: [
                        {
                          scale,
                        },
                      ],
                    },
                  ]}
                />
              );
            }
          )}

          {/* Truck */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.vehicle,
              {
                opacity:
                  vehicleOpacity,

                transform: [
                  {
                    translateX: vehicleLeft,
                  },
                  {
                    translateY: Animated.add(
                      vehicleTop,
                      vehicleBounce
                    ),
                  },
                  {
                    rotate: vehicleTilt,
                  },
                ],
              },
            ]}
          >
            <Text
              style={styles.vehicleEmoji}
            >
              🚚
            </Text>
          </Animated.View>

          {/* Ripple */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ripple,
              {
                left: P2.x - 16,
                top: P2.y - 16,
                opacity:
                  rippleOpacity,

                transform: [
                  {
                    scale:
                      rippleScale,
                  },
                ],
              },
            ]}
          />

          {/* Destination pin */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pin,
              {
                left: P2.x - 7,
                top: P2.y - 22,
                opacity: pinOpacity,

                transform: [
                  {
                    translateY:
                      pinTranslateY,
                  },
                ],
              },
            ]}
          />

          {/* Confetti */}
          {CONFETTI.map(
            (confetti, index) => {
              const value =
                confettiAnims[index];

              const translateX =
                value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    0,
                    confetti.dx,
                  ],
                });

              const translateY =
                value.interpolate({
                  inputRange: [
                    0,
                    0.5,
                    1,
                  ],
                  outputRange: [
                    0,
                    confetti.dy - 18,
                    confetti.dy + 20,
                  ],
                });

              const opacity =
                value.interpolate({
                  inputRange: [
                    0,
                    0.15,
                    1,
                  ],
                  outputRange: [
                    0,
                    1,
                    0,
                  ],
                });

              const scale =
                value.interpolate({
                  inputRange: [
                    0,
                    0.2,
                    1,
                  ],
                  outputRange: [
                    0,
                    1,
                    0.6,
                  ],
                });

              const rotate =
                value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    "0deg",
                    `${180 + index * 30}deg`,
                  ],
                });

              return (
                <Animated.View
                  key={index}
                  pointerEvents="none"
                  style={{
                    position:
                      "absolute",

                    left:
                      P2.x -
                      confetti.size /
                        2,

                    top:
                      P2.y -
                      confetti.size /
                        2,

                    width:
                      confetti.size,

                    height:
                      confetti.size,

                    borderRadius:
                      confetti.size /
                      3,

                    backgroundColor:
                      confetti.color,

                    opacity,

                    transform: [
                      {
                        translateX,
                      },
                      {
                        translateY,
                      },
                      {
                        scale,
                      },
                      {
                        rotate,
                      },
                    ],
                  }}
                />
              );
            }
          )}
        </View>
      </View>

      {/* Bottom text */}
      <Animated.View
        style={[
          styles.bottomTextContainer,
          {
            opacity:
              taglineOpacity,
          },
        ]}
      >
        <Text
          style={styles.bottomText}
        >
          Your delivery. Your way.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ----------------------------------------------------
// Styles
// ----------------------------------------------------

const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFill,
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

  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  glowRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F97316",
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

  wordRow: {
    flexDirection: "row",
    marginTop: 14,
  },

  logoText: {
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

  trackArea: {
    width: TRACK_W,
    height: TRACK_H,
  },

  dustPuff: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D1D5DB",
  },

  vehicle: {
    position: "absolute",
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  vehicleEmoji: {
    fontSize: 34,
  },

  ripple: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#F97316",
  },

  pin: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#111827",
    borderWidth: 3,
    borderColor: "#FFFFFF",
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