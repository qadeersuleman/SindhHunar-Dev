import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated as RNAnimated,
  StatusBar,
  I18nManager,
  Platform,
  ActivityIndicator,
} from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import LottieAnimation from '../../components/LottieAnimation';
import { fonts, typography } from '../../utils/fonts';
import { images } from '../../utils/images';
import { useTranslation } from 'react-i18next';
import { RESPONSIVE } from '../../utils/responsive';

// Components
import HomeHeader from './components/HomeHeader';
import CategoryList from './components/CategoryList';
import ProductCard from './components/ProductCard';
import SearchOverlay from './components/SearchOverlay';
import { useToast } from '../../context/ToastContext';


const { width } = Dimensions.get('window');

// Authentic Sindhi Color Palette
const COLORS = {
  primary: '#800000', // Deep Maroon (Madder Red / Ajrak Red)
  secondary: '#C5A059', // Antique Gold
  accent: '#002366', // Royal Indigo Blue
  dark: '#1A1A1A',
  lightDark: '#2D2D2D',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  gray: '#757575',
  lightGray: '#F0F0F0',
  success: '#2E7D32',
};

const CATEGORIES = [
  { id: 'all', name: 'all', filterKey: null, icon: 'apps-outline' },
  { id: 'ajrak', name: 'ajrak', filterKey: 'Ajrak', icon: 'shirt-outline' },
  { id: 'topi', name: 'topi', filterKey: 'Topi', icon: 'ribbon-outline' },
  { id: 'ralli', name: 'ralli', filterKey: 'Rilli', icon: 'grid-outline' },
  { id: 'mirror', name: 'mirrorWork', filterKey: 'Mirror Work', icon: 'sparkles-outline' },
  { id: 'crafts', name: 'traditionalCrafts', filterKey: 'Block Printing', icon: 'basket-outline' },
];

const OFFERS = [
  {
    id: '1',
    title: 'Authentic Sindhi Ajrak',
    subtitle: 'Pure Hand-Blocked Heritage',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/ajrak.jpg',
    color: ['#800000', '#4A0000'],
  },
  {
    id: '2',
    title: 'Royal Embroidered Topi',
    subtitle: 'Intricate Mirror & Thread Craft',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_topi.jpg',
    color: ['#C5A059', '#8B6B23'],
  },
  {
    id: '3',
    title: 'Handcrafted Ralli Quilt',
    subtitle: 'Traditional Geometric Patchwork',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_quilt.jpg',
    color: ['#002366', '#001233'],
  },
  {
    id: '4',
    title: 'Sindhi Cultural Kurta',
    subtitle: 'Hand-Embroidered Artisanal Dress',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/female_dress.jpg',
    color: ['#4A0000', '#800000'],
  },
  {
    id: '5',
    title: 'Handmade Sindhi Bag',
    subtitle: 'Block Printed Cultural Style',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/embroidered_bag.jpg',
    color: ['#002366', '#C5A059'],
  }
];

const FALLBACK_PRODUCTS = [
  {
    id: 'fb-1',
    name: 'Authentic Sindhi Ajrak',
    category: 'Ajrak Printing',
    price: 3500,
    rating: 5.0,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/ajrak.jpg'],
    artisans: { shop_name: 'Ustad Ismail Ajrak' },
  },
  {
    id: 'fb-2',
    name: 'Royal Embroidered Sindhi Topi',
    category: 'Sindhi Topi',
    price: 2200,
    rating: 4.9,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_topi.jpg'],
    artisans: { shop_name: 'Bhit Shah Cap House' },
  },
  {
    id: 'fb-3',
    name: 'Handcrafted Sindhi Ralli Quilt',
    category: 'Rilli Work',
    price: 8500,
    rating: 5.0,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_quilt.jpg'],
    artisans: { shop_name: 'Sindhi Ralli Artisans' },
  },
  {
    id: 'fb-4',
    name: 'Hand-Embroidered Sindhi Kurta',
    category: 'Mirror Work',
    price: 6500,
    rating: 4.8,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/traditional_dress.jpg'],
    artisans: { shop_name: 'Ghotki Crafts Hub' },
  },
  {
    id: 'fb-5',
    name: 'Sindhi Cultural Female Dress',
    category: 'Mirror Work',
    price: 7800,
    rating: 4.9,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/female_dress.jpg'],
    artisans: { shop_name: 'Hunar Embroidery Center' },
  },
  {
    id: 'fb-6',
    name: 'Handmade Sindhi Tote Bag',
    category: 'Block Printing',
    price: 1800,
    rating: 4.8,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/embroidered_bag.jpg'],
    artisans: { shop_name: 'Hunar Handicrafts' },
  },
  {
    id: 'fb-7',
    name: 'Sindhi Heritage & Crafts Book',
    category: 'Block Printing',
    price: 1200,
    rating: 4.7,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_art_book.jpg'],
    artisans: { shop_name: 'Sindh Literature Society' },
  },
  {
    id: 'fb-8',
    name: 'Handmade Sindhi Keychain',
    category: 'Mirror Work',
    price: 450,
    rating: 4.9,
    images: ['https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/handmade_keychain.jpg'],
    artisans: { shop_name: 'Local Hunar Artisans' },
  },
];

const RECENT_SEARCHES = ['Ajrak Shawl', 'Ralli Quilt', 'Silver Jhumka', 'Handmade Pot'];
const TRENDING_KEYWORDS = ['Embroidery', 'Textiles', 'Pottery', 'Artisan', 'Jewelry'];

import { useSindhiProducts, useSindhiArtisans } from '../../hooks/useSindhiCrafts';
import { subscribeToSindhiProducts } from '../../services/supabase/sindhi-crafts';
import { useQueryClient } from '@tanstack/react-query';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL } from '../../config/env';

const HomeScreen: React.FC<any> = ({ navigation }) => {
  useEffect(() => {
    console.log('Supabase Config Check - URL:', SUPABASE_URL);
  }, []);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { showToast } = useToast();
  const scrollY = useSharedValue(0);

  const searchAnim = useSharedValue(0);


  // Fetch real-time products from Supabase via React Query
  const { data: products, isLoading: productsLoading, error: productsError } = useSindhiProducts({});

  useEffect(() => {
    console.log('HomeScreen Products Update:', { 
      count: products?.length, 
      isLoading: productsLoading,
      error: productsError,
      data: products
    });
  }, [products, productsLoading, productsError]);

  const handleProductPress = useCallback((item: any) => {
    navigation.navigate('ProductDetail', { item });
  }, [navigation]);

  // Use QueryClient to invalidate and refetch on real-time updates
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to real-time changes
    const subscription = subscribeToSindhiProducts(() => {
      queryClient.invalidateQueries({ queryKey: ['sindhi-products'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  useEffect(() => {
    const checkWelcome = async () => {
      try {
        const hasShown = await AsyncStorage.getItem('has_shown_welcome_toast');
        if (!hasShown) {
          setTimeout(() => {
            showToast({
              message: t('common.welcomeBazaar', { defaultValue: 'Khush Amdeed to Bazaar!' }),
              type: 'success'
            });
          }, 1500);
          await AsyncStorage.setItem('has_shown_welcome_toast', 'true');
        }
      } catch (e) {
        console.error('AsyncStorage error:', e);
      }
    };
    checkWelcome();
  }, []);

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'sd' : 'en';
    await i18n.changeLanguage(newLang);
    
    try {
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'language_alerts',
        name: 'Language Alerts',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.displayNotification({
        title: newLang === 'sd' ? 'ٻولي تبديل ٿي وئي' : 'Language Changed',
        body: newLang === 'sd' 
          ? 'توهان جي ايپ هاڻي سنڌي ٻولي ۾ آهي.' 
          : 'Your app is now in English.',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          color: COLORS.primary,
          pressAction: { id: 'default' },
        },
      });
    } catch (error) {
      console.log('Notification error:', error);
    }
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const toggleSearch = (visible: boolean) => {
    setShowSearch(visible);
    searchAnim.value = withTiming(visible ? 1 : 0, { duration: 300 });
  };

  const searchOverlayStyle = useAnimatedStyle(() => ({
    opacity: searchAnim.value,
    transform: [{ translateY: interpolate(searchAnim.value, [0, 1], [50, 0]) }],
    zIndex: showSearch ? 1000 : -1,
  }));

  const renderOffer = useCallback(({ item, index }: { item: typeof OFFERS[0]; index: number }) => (
    <TouchableOpacity 
      className="w-full rounded-[20px] overflow-hidden shadow-xl elevation-8" 
      style={{ height: RESPONSIVE.GET_HEIGHT(22) }}
      activeOpacity={0.9}
      onPress={() => {
        const matchingProduct = (products || FALLBACK_PRODUCTS).find(
          (p: any) => p.name?.toLowerCase().includes(item.title.toLowerCase()) || 
                      item.title.toLowerCase().includes(p.name?.toLowerCase())
        );
        if (matchingProduct) {
          handleProductPress(matchingProduct);
        }
      }}
    >
      <Image
        source={{ uri: item.image }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']}
        className="absolute inset-0"
      />
      <View className="flex-1 px-6 py-4 justify-center">
        <View className={`w-full ${isRTL ? 'items-end' : 'items-start'}`}>
          <Text className="bg-[#800000] px-3 py-1 rounded-lg text-white text-[10px] uppercase mb-1" style={{ fontFamily: fonts.poppins.bold }}>
            {t('common.trending')}
          </Text>
          <Text className={`text-white text-[26px] leading-[30px] shadow-sm ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.bebasNeue.bold }}>
            {item.title}
          </Text>
          <Text className={`text-white/90 text-[13px] mt-1 mb-2 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.medium }}>
            {item.subtitle}
          </Text>
          <View className="bg-white px-5 py-2 rounded-xl shadow-sm">
            <Text className="text-[#800000] text-[12px]" style={{ fontFamily: fonts.poppins.bold }}>{t('common.shopNow')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [isRTL, t, products, handleProductPress]);

  const listHeaderComponent = useMemo(() => (
    <View>
      {/* Categories Section */}
      <View className={`flex-row justify-between items-center px-5 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Text className="text-[22px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>
          {t('home.categories')}
        </Text>
      </View>
      <CategoryList
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isRTL={isRTL}
        t={t}
      />

      {/* Offers Banner */}
      <View className={`flex-row justify-between items-center px-5 mb-3 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Text className="text-[22px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>
          {t('home.exclusive')}
        </Text>
      </View>

      <View className="items-center">
        <Carousel
          loop
          width={width}
          height={RESPONSIVE.GET_HEIGHT(22) + 20}
          autoPlay={true}
          autoPlayInterval={3000}
          data={OFFERS}
          scrollAnimationDuration={1000}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          renderItem={renderOffer}
        />
      </View>

      {/* Bazaar Section Title */}
      <View className={`flex-row justify-between items-center px-5 mb-3 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Text className="text-[22px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>
          {t('nav.bazaar')}
        </Text>
        <TouchableOpacity onPress={() => setSelectedCategory('all')}>
          <Text className="text-[13px] text-[#800000]" style={{ fontFamily: fonts.poppins.medium }}>{t('common.viewAll')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [isRTL, selectedCategory, t, renderOffer]);

  const displayProducts = useMemo(() => {
    const list = (products && products.length > 0) ? products : FALLBACK_PRODUCTS;
    let filtered = list;

    if (selectedCategory !== 'all') {
      const cat = CATEGORIES.find(c => c.id === selectedCategory);
      if (cat && cat.filterKey) {
        const key = cat.filterKey.toLowerCase();
        filtered = filtered.filter((p: any) => 
          (p.category && p.category.toLowerCase().includes(key)) ||
          (p.name && p.name.toLowerCase().includes(cat.name.toLowerCase()))
        );
      }
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter((p: any) => 
        (p.name && p.name.toLowerCase().includes(query)) || 
        (p.category && p.category.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [products, selectedCategory, searchText]);

  const renderProduct = useCallback(({ item }: { item: any }) => {
    // Map Supabase fields to ProductCard format
    const mappedItem = {
      ...item,
      name: item.name || item.nameKey,
      image: item.image ? item.image : (item.images && item.images.length > 0 ? item.images[0] : null),
      artisanKey: item.artisans?.shop_name || item.artisanKey || 'Sindhi Hunar',
    };

    return (
      <ProductCard
        item={mappedItem}
        t={t}
        isRTL={isRTL}
        onPress={() => handleProductPress(mappedItem)}
      />
    );
  }, [t, isRTL, handleProductPress]);

  const keyExtractor = useCallback((item: any) => item.id, []);
  const ITEM_HEIGHT = RESPONSIVE.GET_HEIGHT(32);
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <View className="flex-1 bg-[#FAF9F6]">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <HomeHeader
        t={t}
        i18n={i18n}
        isRTL={isRTL}
        toggleLanguage={toggleLanguage}
        scrollY={scrollY}
        onSearchPress={() => toggleSearch(true)}
      />

      {productsLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <Animated.FlatList
          data={displayProducts}
          renderItem={renderProduct}
          keyExtractor={keyExtractor}
          numColumns={2}
          ListHeaderComponent={listHeaderComponent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: RESPONSIVE.GET_HEIGHT(2), paddingBottom: RESPONSIVE.GET_HEIGHT(15) }}
          columnWrapperStyle={{ paddingHorizontal: RESPONSIVE.GET_WIDTH(5), justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
          getItemLayout={getItemLayout}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Icon name="basket-outline" size={60} color="#E5E7EB" />
              <Text className="text-gray-400 mt-4 text-[16px]" style={{ fontFamily: fonts.poppins.medium }}>
                {t('home.noProducts', { defaultValue: 'No products found in Bazaar yet' })}
              </Text>
            </View>
          }
          ListFooterComponent={<View className="h-10" />}
        />
      )}

      <SearchOverlay
        visible={showSearch}
        isRTL={isRTL}
        t={t}
        searchText={searchText}
        setSearchText={setSearchText}
        onClose={() => toggleSearch(false)}
        searchOverlayStyle={searchOverlayStyle}
        recentSearches={RECENT_SEARCHES}
        trendingKeywords={TRENDING_KEYWORDS}
      />

      <Animated.View
        entering={FadeInDown.delay(1000).springify()}
        className="absolute bottom-[100px] right-5 z-[100]"
      >
        <TouchableOpacity 
          className="w-14 h-14 rounded-full overflow-hidden shadow-xl elevation-8"
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Chat')}
        >
          <LinearGradient
            colors={[COLORS.primary, '#4A0000']}
            className="flex-1 justify-center items-center"
          >
            <Icon name="chatbubble-ellipses" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>


    </View>
  );
};

const styles = StyleSheet.create({
  // NativeWind handles the styles
});

export default memo(HomeScreen);
