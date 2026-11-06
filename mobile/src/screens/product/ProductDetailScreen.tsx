import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  StatusBar,
  I18nManager,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { RESPONSIVE } from '../../utils/responsive';
import { fonts } from '../../utils/fonts';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';


const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = RESPONSIVE.GET_HEIGHT(45);

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F5F5F5',
  accent: '#002366',
  success: '#2E7D32',
};

import { useCulturalInfo } from '../../hooks/useSindhiCrafts';

const ProductDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { item } = route.params;
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const isRTL = i18n.language === 'sd';
  const scrollY = useSharedValue(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Fetch cultural significance for this category
  const { data: culturalInfo, isLoading: cultureLoading } = useCulturalInfo(item.category);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const navBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 100, HEADER_HEIGHT - 50],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      borderBottomWidth: opacity > 0.5 ? 0.5 : 0,
      borderBottomColor: '#EEE',
    };
  });

  const navIconStyle = useAnimatedStyle(() => {
    const colorValue = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 100, HEADER_HEIGHT - 50],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      backgroundColor: colorValue > 0.5 ? 'transparent' : 'rgba(0,0,0,0.3)',
    };
  });

  const navTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 70, HEADER_HEIGHT - 50],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity: opacity,
    };
  });

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item, quantity);


    
    showToast({
      message: `${quantity} ${item.name} ${t('common.addedToCart', { defaultValue: 'added to Jholi!' })}`,
      type: 'success'
    });
  };

  const { user } = useAuth();

  const handleBuyNow = () => {
    if (!user) {
      showToast({ message: t('common.pleaseLogin', { defaultValue: 'Please login to continue' }), type: 'info' });
      return;
    }

    // Add to cart first so checkout has items
    addToCart(item, quantity);
    
    // Navigate to Checkout
    navigation.navigate('Checkout' as never);
  };

  const discountedPrice = (item.price || 0) * 0.9; // Example 10% discount

  // Robust Image Logic
  const productImage = item.image_url || 
                       (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 
                       (typeof item.images === 'string' ? item.images : 
                       (typeof item.image === 'string' ? item.image : item.image)));

  // Robust Artisan Logic
  const artisanObj = Array.isArray(item.artisans) ? item.artisans[0] : item.artisans;
  
  // Try to get a valid name from various sources
  const rawArtisanName = (artisanObj?.profiles?.name) || 
                         (artisanObj?.shop_name) || 
                         (item.artisan_name) || 
                         (typeof item.artisan === 'string' ? item.artisan : item.artisan?.name);

  const artisanName = rawArtisanName || (item.artisanKey ? t(item.artisanKey) : 'Sindhi Artisan');

  // Use profile avatar if available, then shop logo, then fallback
  const artisanAvatar = (artisanObj?.profiles?.avatar_url) || 
                        (artisanObj?.logo_url) || 
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=Artisan';

  console.log('Rendering Product Detail Debug V2:', { 
    id: item.id, 
    rawName: rawArtisanName,
    artisanKey: item.artisanKey,
    finalName: artisanName,
    hasAvatar: !!artisanAvatar
  });




  return (

    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Animated.View 
        style={[navBarStyle]}
        className="absolute top-0 left-0 right-0 z-10 h-[100px]"
      >
        <SafeAreaView edges={['top']} className="flex-1 flex-row items-center justify-between px-5">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white/80 justify-center items-center"
          >
            <Icon name="chevron-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Animated.Text 
            className="text-[16px] text-[#1A1A1A]"
            style={[{ fontFamily: fonts.poppins.bold }, navTitleStyle]}
          >
            {item.nameKey ? t(item.nameKey) : item.name}
          </Animated.Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/80 justify-center items-center">
            <Icon name="share-outline" size={22} color={COLORS.dark} />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: RESPONSIVE.GET_HEIGHT(15) }}
      >
        {/* Hero Image Section */}
        <View style={{ height: HEADER_HEIGHT }} className="w-full overflow-hidden">
          <Animated.Image
            source={productImage ? (typeof productImage === 'string' ? { uri: productImage } : productImage) : { uri: 'https://via.placeholder.com/400' }}
            style={[headerImageStyle]}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.1)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
             <View className="flex-row justify-between items-center pt-2.5">
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                  className="w-10 h-10 rounded-full bg-black/30 justify-center items-center"
                >
                  <Icon name={isRTL ? "chevron-forward" : "chevron-back"} size={22} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="w-10 h-10 rounded-full bg-black/30 justify-center items-center"
                  onPress={() => setIsLiked(!isLiked)}
                >
                  <Icon name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? '#FF4B4B' : COLORS.white} />
                </TouchableOpacity>
             </View>
          </SafeAreaView>

          <View className="absolute bottom-8 left-5">
            <Animated.View entering={FadeInUp.delay(300)} className="bg-[#C5A059] px-3 py-1.5 rounded-lg">
              <Text className="text-white text-[12px]" style={{ fontFamily: fonts.poppins.bold }}>SAVE 10%</Text>
            </Animated.View>
          </View>
        </View>

        {/* Content Section */}
        <View className="-mt-6 bg-white rounded-t-[30px] p-6 shadow-2xl elevation-5">
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View className={`flex-row justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Text className="text-[14px] text-[#800000] uppercase tracking-[1px]" style={{ fontFamily: fonts.poppins.medium }}>
                {item.category}
              </Text>
              <View className="flex-row items-center bg-[#F5F5F5] px-2.5 py-1 rounded-full">
                <Icon name="star" size={14} color={COLORS.secondary} />
                <Text className="ml-1 text-[12px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.medium }}>
                  {item.rating} ({item.reviews} {t('common.reviews', { defaultValue: 'Reviews' })})
                </Text>
              </View>
            </View>

            <Text 
              className={`text-[32px] text-[#1A1A1A] leading-[36px] mb-3 ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ fontFamily: fonts.bebasNeue.bold }}
            >
              {item.nameKey ? t(item.nameKey) : item.name}
            </Text>

            <View className={`flex-row justify-between items-center mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <View className={`flex-row items-baseline ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Text className="text-[28px] text-[#800000]" style={{ fontFamily: fonts.bebasNeue.bold }}>Rs. {discountedPrice}</Text>
                <Text className={`text-[16px] text-[#757575] line-through mb-1 ${isRTL ? 'mr-2.5' : 'ml-2.5'}`} style={{ fontFamily: fonts.poppins.regular }}>Rs. {item.price}</Text>
              </View>

              <View className="flex-row items-center bg-[#E8F5E9] px-2.5 py-1.5 rounded-lg">
                <View className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mr-1.5" />
                <Text className="text-[10px] text-[#2E7D32] font-bold uppercase" style={{ fontFamily: fonts.poppins.bold }}>
                  {t('common.inStock', { defaultValue: 'In Stock' })}
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-[#F0F0F0] mb-5" />

            <View className={`flex-row items-center bg-[#FAF9F6] p-3 rounded-[15px] mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Image 
                source={{ uri: artisanAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artisan' }} 
                className="w-[45px] h-[45px] rounded-full bg-[#DDD]" 
              />

              <View className={`flex-1 mx-3 ${isRTL ? 'items-end' : 'items-start'}`}>
                <Text className="text-[12px] text-[#757575]" style={{ fontFamily: fonts.poppins.regular }}>{t('common.by')}</Text>
                <Text className="text-[15px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>
                  {artisanName || 'Sindhi Artisan'}
                </Text>



              </View>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm elevation-2">
                <Icon name="chatbubble-ellipses-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className={`text-[18px] text-[#1A1A1A] mb-2.5 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.bold }}>
                {t('common.description', { defaultValue: 'Product Description' })}
              </Text>
              <Text className={`text-[14px] text-[#757575] leading-[22px] ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.regular }}>
                {item.description || t('common.noDescription', { defaultValue: 'No description available for this authentic piece.' })}
              </Text>
            </View>

            {/* Cultural Significance Section */}
            {(culturalInfo || cultureLoading) && (
              <Animated.View 
                entering={FadeInDown.delay(200)}
                className="mb-8 p-5 rounded-[25px] bg-[#FAF9F6] border border-[#C5A059]/20"
              >
                <View className={`flex-row items-center mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <View className="w-10 h-10 rounded-full bg-[#C5A059] justify-center items-center">
                    <Icon name="library-outline" size={20} color="white" />
                  </View>
                  <Text className={`flex-1 text-[18px] text-[#1A1A1A] mx-3 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.bold }}>
                    {isRTL ? 'ثقافتي اهميت' : 'Cultural Significance'}
                  </Text>
                </View>
                
                {cultureLoading ? (
                  <ActivityIndicator size="small" color={COLORS.secondary} />
                ) : (
                  <>
                    <Text className={`text-[14px] text-[#800000] mb-2 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.bold }}>
                      {culturalInfo?.description}
                    </Text>
                    <Text className={`text-[13px] text-[#555] leading-[20px] ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.regular }}>
                      {culturalInfo?.significance}
                    </Text>
                    <View className="mt-3 pt-3 border-t border-[#C5A059]/10">
                       <Text className={`text-[11px] text-[#C5A059] italic ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.medium }}>
                        {t('common.materials', { defaultValue: 'Materials' })}: {culturalInfo?.materials.join(', ')}
                       </Text>
                    </View>
                  </>
                )}
              </Animated.View>
            )}

            <View className="mb-6">
              <Text className={`text-[18px] text-[#1A1A1A] mb-2.5 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.bold }}>
                {t('home.popularCollections', { defaultValue: 'Related Products' })}
              </Text>
              <FlatList 
                data={[1, 2, 3]}
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 15 }}
                inverted={isRTL}
                keyExtractor={(i) => i.toString()}
                renderItem={({ item: i }) => (
                  <View className="w-[140px] bg-[#FAF9F6] rounded-[15px] p-2.5">
                    <Image 
                      source={{ uri: `https://picsum.photos/seed/${i + 10}/200/200` }} 
                      className="w-full h-[100px] rounded-xl mb-2" 
                    />
                    <Text className="text-[12px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>Sindhi Item {i}</Text>
                    <Text className="text-[14px] text-[#800000]" style={{ fontFamily: fonts.bebasNeue.bold }}>Rs. {1000 + (i * 200)}</Text>
                  </View>
                )}
              />
            </View>

            <View className="h-5" />
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Bottom Actions */}
      <Animated.View 
        entering={FadeInDown.delay(500).duration(800)}
        className="absolute bottom-0 left-0 right-0 bg-white pt-[15px] px-5 border-t border-[#F0F0F0]"
        style={{ paddingBottom: Platform.OS === 'ios' ? 30 : 20 }}
      >
        <View className={`flex-row items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <View className={`flex-row items-center bg-[#F5F5F5] rounded-xl px-2 h-[50px] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <TouchableOpacity 
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 justify-center items-center"
            >
              <Icon name="remove" size={20} color={COLORS.dark} />
            </TouchableOpacity>
            <Text className="text-[16px] text-[#1A1A1A] mx-3" style={{ fontFamily: fonts.poppins.bold }}>{quantity}</Text>
            <TouchableOpacity 
              onPress={() => setQuantity(quantity + 1)}
              className="w-8 h-8 justify-center items-center"
            >
              <Icon name="add" size={20} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={handleAddToCart}
            className="flex-[1.2] h-[50px] rounded-[15px] border-[1.5px] border-[#800000] justify-center items-center"
          >
            <Text className="text-[14px] text-[#800000]" style={{ fontFamily: fonts.poppins.bold }}>{t('common.addToCart', { defaultValue: 'Add to Cart' })}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleBuyNow}
            className="flex-[1.5] h-[50px] rounded-[15px] overflow-hidden"
          >
            <LinearGradient
              colors={[COLORS.primary, '#A00000']}
              className="flex-1 justify-center items-center"
            >
              <Text className="text-[14px] text-white" style={{ fontFamily: fonts.poppins.bold }}>{t('common.buyNow', { defaultValue: 'Buy Now' })}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: RESPONSIVE.GET_HEIGHT(12),
  },
  // Reanimated specific styles that can't be purely Tailwind yet
});

export default ProductDetailScreen;
