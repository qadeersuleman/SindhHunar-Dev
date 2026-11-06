import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Animated, {
  SlideInUp,
  FadeOutDown,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../utils/fonts';
import { Card as PaperCard, IconButton, Button as PaperButton } from 'react-native-paper';
import { config } from '../../config/env';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  black: '#1A1A1A',
  grey: '#F5F5F5',
  textGrey: '#666666',
};

const shops = [
  { id: 1, name: "Ghotki Hunar Handicrafts", latitude: 28.0050, longitude: 69.3140, address: "Station Road, Ghotki" },
  { id: 2, name: "Traditional Ajrak & Rilli Center", latitude: 28.0082, longitude: 69.3185, address: "Shahi Bazaar, Ghotki" },
  { id: 3, name: "Original Ghotki Peda Store", latitude: 28.0025, longitude: 69.3100, address: "Deviri Road, Ghotki" },
  { id: 4, name: "Sindhi Embroidery Artisans Hub", latitude: 28.0120, longitude: 69.3220, address: "Bypass Road, Ghotki" },
];

const MapScreen = () => {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number, duration: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number, longitude: number}[]>([]);
  const [isFetchingRoute, setIsFetchingRoute] = useState(false);
  const mapRef = useRef<MapView>(null);
  const watchIdRef = useRef<number | null>(null);
  const navigation = useNavigation<any>();

  // Hide bottom tab bar
  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({ tabBarStyle: { display: 'none' } });
      }
      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: { 
              display: 'flex', backgroundColor: '#FFFFFF', height: 65, position: 'absolute',
              bottom: 25, left: 20, right: 20, borderRadius: 20, borderTopWidth: 0,
              elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1, shadowRadius: 10, paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            },
          });
        }
      };
    }, [navigation])
  );

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setIsLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    } catch (err) {
      console.warn(err);
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    console.log('[MapScreen] Requesting current location...');
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('[MapScreen] Location acquired successfully:', position.coords);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
        
        // Center map on user
        mapRef.current?.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      },
      (error) => {
        console.error('[MapScreen] Error getting location (high accuracy):', error);
        // Fallback to low accuracy
        console.log('[MapScreen] Trying again with low accuracy...');
        Geolocation.getCurrentPosition(
          (posLow) => {
            console.log('[MapScreen] Location acquired (low accuracy):', posLow.coords);
            setUserLocation({
              latitude: posLow.coords.latitude,
              longitude: posLow.coords.longitude,
            });
            setIsLoading(false);
            mapRef.current?.animateToRegion({
              latitude: posLow.coords.latitude,
              longitude: posLow.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
          },
          (errorLow) => {
            console.error('[MapScreen] Error getting location (low accuracy):', errorLow);
            setIsLoading(false);
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    return () => {
      stopLocationWatch();
    };
  }, []);

  const stopLocationWatch = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log('[MapScreen] Location watch stopped.');
    }
  };

  const startTracking = () => {
    console.log('[MapScreen] Starting Tracking...');
    if (!userLocation) {
      console.log('[MapScreen] Cannot start tracking: userLocation is null');
      return;
    }
    if (!selectedShop) {
      console.log('[MapScreen] Cannot start tracking: selectedShop is null');
      return;
    }
    setIsTracking(true);
    
    console.log('[MapScreen] Fetching route from OSRM...');
    fetchRoute(userLocation, { latitude: selectedShop.latitude, longitude: selectedShop.longitude });

    // Start watching position for live tracking
    stopLocationWatch(); // Clear previous watch if any
    console.log('[MapScreen] Initiating watchPosition...');
    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        console.log('[MapScreen] Live position update:', position.coords);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        
        // If moving, we might want to update route, but for now just update user location
      },
      (error) => console.error('[MapScreen] watchPosition error:', error),
      { enableHighAccuracy: false, distanceFilter: 10 } // Changed to false for better emulator support
    );
  };

  const fetchRoute = async (origin: {latitude: number, longitude: number}, dest: {latitude: number, longitude: number}) => {
    setIsFetchingRoute(true);
    try {
      const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}?overview=full&geometries=geojson`);
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        
        setRouteCoordinates(coordinates);
        // OSRM returns distance in meters and duration in seconds
        setRouteInfo({
          distance: route.distance / 1000, // km
          duration: route.duration / 60, // mins
        });
        
        // Fit map to route
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 150, right: 50, bottom: 350, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error('[MapScreen] Error fetching route:', error);
    } finally {
      setIsFetchingRoute(false);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setRouteInfo(null);
    setRouteCoordinates([]);
    stopLocationWatch();
    
    if (selectedShop) {
      mapRef.current?.animateToRegion({
        latitude: selectedShop.latitude,
        longitude: selectedShop.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleShopPress = (shop: any) => {
    setSelectedShop(shop);
    setIsTracking(false);
    setRouteInfo(null);
    setRouteCoordinates([]);
    stopLocationWatch();
    
    // Animate to shop without drawing route yet
    mapRef.current?.animateToRegion({
      latitude: shop.latitude,
      longitude: shop.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleCloseModal = () => {
    setSelectedShop(null);
    setIsTracking(false);
    setRouteInfo(null);
    setRouteCoordinates([]);
    stopLocationWatch();
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 28.0050,
          longitude: 69.3140,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        showsPointsOfInterests={false}
        onPress={() => handleCloseModal()}
      >
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
            onPress={(e) => {
              e.stopPropagation();
              handleShopPress(shop);
            }}
          >
            <View className="w-10 h-10 bg-[#800000] rounded-full justify-center items-center border-2 border-white shadow-lg">
              <Text className="text-white text-lg">🏪</Text>
            </View>
          </Marker>
        ))}

        {userLocation && selectedShop && isTracking && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor={COLORS.primary}
          />
        )}
      </MapView>

      {/* Floating Creative Header */}
      <Animated.View entering={SlideInUp.delay(200).duration(800)} className="absolute top-12 left-4 right-4 z-10">
        <PaperCard className="bg-white/90 rounded-[24px] overflow-hidden shadow-xl elevation-10 border border-white/20">
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
            className="p-3 flex-row items-center"
          >
            <IconButton
              icon="arrow-left"
              size={22}
              iconColor="#1A1A1A"
              onPress={() => navigation.goBack()}
              className="bg-gray-100/80 mr-2"
            />
            <View className="w-10 h-10 rounded-xl bg-[#800000] justify-center items-center shadow-sm">
              <Icon name="map" size={20} color="white" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-[18px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>Sindh Bazaar Map</Text>
              <Text className="text-[10px] text-[#800000] uppercase tracking-widest" style={{ fontFamily: fonts.poppins.bold }}>Explore Local Shops</Text>
            </View>
            {userLocation && (
              <TouchableOpacity 
                className={`p-2 rounded-full ${isTracking ? 'bg-green-100' : 'bg-[#800000]/10'}`}
                onPress={() => mapRef.current?.animateToRegion({
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                })}
              >
                <Icon name="locate" size={20} color={isTracking ? '#16A34A' : COLORS.primary} />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </PaperCard>
      </Animated.View>

      {/* Bottom Sheet Shop Details */}
      {selectedShop && (
        <Animated.View
          entering={SlideInDown.duration(400)}
          exiting={FadeOutDown.duration(200)}
          className="absolute bottom-0 left-0 right-0 z-[100]"
        >
          <View className="bg-white rounded-t-[40px] p-6 pb-12 shadow-2xl elevation-20 border-t border-gray-100">
            <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-6" />

            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 rounded-3xl bg-[#800000]/5 justify-center items-center border border-[#800000]/10">
                <Text className="text-[#800000] text-[28px]" style={{ fontFamily: fonts.bebasNeue.bold }}>
                  {selectedShop.name.charAt(0)}
                </Text>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-[22px] text-[#1A1A1A] leading-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>{selectedShop.name}</Text>
                <View className="flex-row items-center mt-1">
                  <Icon name="location" size={12} color="#C5A059" />
                  <Text className="text-[12px] text-[#757575] ml-1" style={{ fontFamily: fonts.poppins.regular }} numberOfLines={1}>{selectedShop.address}</Text>
                </View>
              </View>

              <IconButton 
                icon="close-circle" 
                size={28} 
                iconColor="#E5E7EB" 
                onPress={handleCloseModal}
                className="m-0"
              />
            </View>

            {/* Uber-like Route Info Box */}
            {isTracking && routeInfo && (
              <View className="bg-gray-50 rounded-2xl p-4 mb-6 flex-row items-center justify-between border border-gray-100">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center">
                    <Icon name="car" size={20} color="#2563EB" />
                  </View>
                  <View>
                    <Text className="text-[12px] text-gray-500" style={{ fontFamily: fonts.poppins.regular }}>Estimated Time</Text>
                    <Text className="text-[16px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>
                      {Math.ceil(routeInfo.duration)} mins
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-[12px] text-gray-500" style={{ fontFamily: fonts.poppins.regular }}>Distance</Text>
                  <Text className="text-[16px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>
                    {routeInfo.distance.toFixed(1)} km
                  </Text>
                </View>
              </View>
            )}

            <View className="flex-row gap-3">
              {!isTracking ? (
                <PaperButton 
                  mode="contained" 
                  onPress={startTracking}
                  buttonColor={COLORS.primary}
                  className="flex-1 rounded-2xl py-1"
                  labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
                  icon={!userLocation ? "map-marker-radius" : "navigation"}
                  loading={!userLocation || isFetchingRoute}
                  disabled={!userLocation || isFetchingRoute}
                >
                  {!userLocation ? "Locating..." : isFetchingRoute ? "Drawing Route..." : "Track Route"}
                </PaperButton>
              ) : (
                <PaperButton 
                  mode="contained" 
                  onPress={stopTracking}
                  buttonColor="#1A1A1A"
                  className="flex-1 rounded-2xl py-1"
                  labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 14 }}
                  icon="close-circle"
                >
                  Cancel Tracking
                </PaperButton>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default MapScreen;