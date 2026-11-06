import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
  FadeInDown,
  FadeIn,
  ZoomIn,
  Layout,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { hapticFeedback } from '../utils/haptics';
import { useCart } from '../store/cartStore';


import HomeScreen from '../screens/home/HomeScreen';
import CultureScreen from '../screens/culture/CultureScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import OrderScreen from '../screens/order/OrderScreen';
import MapScreen from '../screens/map/MapScreen';

const { width, height } = Dimensions.get('window');
const TAB_BAR_WIDTH = width;
const TAB_WIDTH = TAB_BAR_WIDTH / 5;

const COLORS = {
  primary: '#800000',
  primaryDark: '#4A0000',
  secondary: '#C5A059',
  accent: '#FF6B35',
  white: '#FFFFFF',
  background: '#FAF9F6',
  glass: 'rgba(255, 255, 255, 0.7)',
};

// Futuristic Loader with Floating Elements
const TabScreenLoader = () => (
  <View style={loaderStyles.container}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={loaderStyles.text}>Jhuldi kar rahyo aahe...</Text>
  </View>
);

type MainTabParamList = {
  Bazaar: undefined;
  Saqafat: undefined;
  Jholi: undefined;
  Dukan: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom SVG Icons for Unique Look
interface TabIconProps {
  route: keyof MainTabParamList;
  focused: boolean;
}

const TabIcon = ({ route, focused }: TabIconProps) => {
  const { totalItems } = useCart();
  const icons = {
    Bazaar: 'storefront',
    Saqafat: 'color-palette',
    Jholi: 'bag-handle',
    Dukan: 'map',
    Profile: 'person',
  };

  return (
    <View style={iconStyles.container}>
      <Icon
        name={focused ? icons[route] : `${icons[route]}-outline`}
        size={20}
        color={focused ? '#FFFFFF' : '#666666'}
      />
      {route === 'Jholi' && totalItems > 0 && (
        <View style={iconStyles.badge}>
          <Text style={iconStyles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </View>
  );
};


const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const translateX = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  // Get the current route name
  const currentRouteName = state.routes[state.index].name;

  useEffect(() => {
    const targetValue = isRTL
      ? (state.routes.length - 1 - state.index) * TAB_WIDTH
      : state.index * TAB_WIDTH;

    translateX.value = withSpring(targetValue, {
      stiffness: 150,
      damping: 15,
      mass: 0.8,
    });

    scaleAnim.value = withSpring(1.05, {}, () => {
      scaleAnim.value = withSpring(1);
    });
  }, [state.index, isRTL]);


  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scaleAnim.value },
    ],
  }));

  // HIDE TAB BAR ON MAP SCREEN (Dukan)
  // Moved after ALL hooks to prevent "Rendered fewer hooks" error
  if (currentRouteName === 'Dukan') {
    return null;
  }

  // Floating particles effect
  const ParticleEffect = () => {
    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2000,
    }));

    return (
      <View style={particleStyles.container}>
        {particles.map((particle) => (
          <Animated.View
            key={particle.id}
            entering={FadeIn.duration(1000).delay(particle.delay)}
            style={[
              particleStyles.particle,
              {
                left: `${particle.x}%`,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.tabBarWrapper}>

      <Animated.View
        style={[styles.tabBarContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      >
        {/* Premium Glass Morphism Effect */}
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFillObject}
            blurType="light"
            blurAmount={15}
            reducedTransparencyFallbackColor="white"
          />
        ) : (
          <View
            style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: 35 }]}
          />
        )}

        {/* Subtle Border with Gradient */}
        <View style={styles.glassBorder}>
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        {/* Animated Particle Indicator with Trail Effect */}
        <Animated.View style={[styles.activePillContainer, indicatorStyle]}>
          <View style={styles.activePill}>
            <LinearGradient
              colors={['#800000', '#A52A2A', '#800000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pillGradient}
            >
              <View style={styles.innerGlow} />
              <View style={styles.highlight} />
            </LinearGradient>
          </View>

          {/* Trail dots */}
          <View style={styles.trailContainer}>
            {[0.3, 0.5, 0.7].map((opacity, index) => (
              <View
                key={index}
                style={[
                  styles.trailDot,
                  {
                    opacity,
                    transform: [
                      { scale: 1 - index * 0.2 },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Tab Items */}
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const labels: { [key: string]: string } = {
            Bazaar: t('nav.bazaar'),
            Saqafat: t('nav.saqafat'),
            Jholi: t('nav.jholi'),
            Dukan: t('nav.dukan'),
            Profile: t('nav.profile'),
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              hapticFeedback.light(); // Trigger subtle vibration
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Animated.View style={styles.tabContent}>
                <TabIcon route={route.name} focused={isFocused} />

                {isFocused && (
                  <Animated.Text
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.tabLabelActive}
                  >
                    {labels[route.name as keyof typeof labels]}
                  </Animated.Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props: any) => <CustomTabBar {...props} />}
      initialRouteName="Bazaar"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Bazaar"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Bazaar',
        }}
      />
      <Tab.Screen
        name="Saqafat"
        component={CultureScreen}
        options={{
          tabBarLabel: 'Saqafat',
        }}
      />
      <Tab.Screen
        name="Jholi"
        component={OrderScreen}
        options={{
          tabBarLabel: 'Jholi',
        }}
      />
      <Tab.Screen
        name="Dukan"
        component={MapScreen}
        options={{
          tabBarLabel: 'Dukan',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 25 : 15,
    width: width,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  tabBarContainer: {
    width: TAB_BAR_WIDTH,
    height: Platform.OS === 'ios' ? 75 : 65,
    backgroundColor: 'transparent',
    shadowColor: '#800000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  glassBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  activePillContainer: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  activePill: {
    width: '85%',
    height: Platform.OS === 'ios' ? 55 : 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#800000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  pillGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerGlow: {
    position: 'absolute',
    top: 5,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
  },
  highlight: {
    position: 'absolute',
    bottom: 5,
    left: 15,
    right: 15,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
  },
  trailContainer: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 3,
    opacity: 0.6,
  },
  trailDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C5A059',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  tabLabelActive: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginTop: -2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

const iconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 24,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Poppins-Bold',
    lineHeight: 12,
  },
  glowDot: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
});

const particleStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -20,
    width: TAB_BAR_WIDTH,
    height: 40,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    bottom: 0,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#C5A059',
    opacity: 0.3,
  },
});

const loaderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  outerRing: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  dotGradient: {
    flex: 1,
  },
  text: {
    marginTop: 25,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Regular',
    color: '#800000',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default TabNavigator;