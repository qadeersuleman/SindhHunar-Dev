import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../utils/images';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';

interface SplashScreenProps {
  /**
   * Called once all intro animations have finished (~3.5 s).
   * The parent should use this to mark the splash as "seen" in AsyncStorage
   * and unmount this component, so it never shows again.
   */
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const bgScale = useSharedValue(1.1);
  const bgRotate = useSharedValue(0);
  const lineScale = useSharedValue(0);
  const textSpacing = useSharedValue(2);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Background slow pan & zoom
    bgScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 10000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1.1, { duration: 10000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    );

    bgRotate.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 15000, easing: Easing.linear }),
        withTiming(-2, { duration: 15000, easing: Easing.linear })
      ),
      -1,
      true
    );

    // Decorative line scale (snappy entrance)
    lineScale.value = withDelay(400, withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) }));

    // Text letter spacing animation
    textSpacing.value = withDelay(250, withTiming(8, { duration: 1200, easing: Easing.out(Easing.exp) }));

    // Pulse effect
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );

    // ─── AUTO-DISMISS ────────────────────────────────────────────────────────
    // Snappy auto-dismiss so the app doesn't block startup unnecessarily
    const timer = setTimeout(() => {
      onFinish?.();
    }, 1800);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bgScale.value },
      { rotate: `${bgRotate.value}deg` },
    ],
  }));

  const animatedLineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: lineScale.value }],
    opacity: lineScale.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    letterSpacing: textSpacing.value,
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Immersive Background */}
      <Animated.View style={[styles.bgContainer, animatedBgStyle]}>
        <Image source={images.ajrakBg} style={styles.bgImage} />
      </Animated.View>

      {/* Dark Gradient Overlay */}
      <LinearGradient
        colors={['rgba(74, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.95)', 'rgba(26, 26, 26, 1)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Animated Decorative Circle */}
        <Animated.View
          entering={FadeIn.delay(300).duration(1000)}
          style={[styles.decorativeCircle, animatedPulseStyle]}
        >
          <View style={styles.innerCircle}>
            <View style={styles.dot} />
            <View style={[styles.ring, { opacity: 0.3 }]} />
            <View style={[styles.ring, { transform: [{ scale: 1.2 }], opacity: 0.1 }]} />
          </View>
        </Animated.View>

        <View style={styles.titleWrapper}>
          <Animated.Text
            entering={FadeInUp.delay(600).duration(1000).springify()}
            style={[styles.appName, animatedTextStyle]}
          >
            SINDHHUNAR
          </Animated.Text>

          <Animated.View style={[styles.accentLine, animatedLineStyle]} />

          <Animated.Text
            entering={FadeInDown.delay(1200).duration(1000)}
            style={styles.tagline}
          >
            HANDCRAFTED HERITAGE OF SINDH
          </Animated.Text>
        </View>
      </View>

      {/* Bottom Loading Indicator */}
      <Animated.View
        entering={FadeIn.delay(2000)}
        style={styles.loaderContainer}
      >
        <Text style={styles.loaderText}>BHALE KARI AAYA</Text>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[styles.loadingProgress, {
              width: '100%',
              backgroundColor: colors.primary,
            }]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.6,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  decorativeCircle: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(197, 160, 89, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C41E3A',
    shadowColor: '#C41E3A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#C5A059',
  },
  titleWrapper: {
    alignItems: 'center',
  },
  appName: {
    fontFamily: fonts.bebasNeue.bold,
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(196, 30, 58, 0.5)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 15,
  },
  accentLine: {
    width: 150,
    height: 2,
    backgroundColor: '#C5A059',
    marginVertical: 15,
  },
  tagline: {
    fontFamily: fonts.poppins.medium,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 4,
    textAlign: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  loaderText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 3,
    marginBottom: 10,
  },
  loadingBar: {
    width: 100,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
  },
});

export default SplashScreen;
