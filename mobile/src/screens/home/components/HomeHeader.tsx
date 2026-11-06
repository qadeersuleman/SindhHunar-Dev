import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { fonts } from '../../../utils/fonts';
import { images } from '../../../utils/images';
import { RESPONSIVE } from '../../../utils/responsive';

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
};

interface HomeHeaderProps {
  t: any;
  i18n: any;
  isRTL: boolean;
  toggleLanguage: () => void;
  scrollY: any;
  onSearchPress: () => void;
  userName?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ 
  t, 
  i18n,
  isRTL, 
  toggleLanguage, 
  scrollY, 
  onSearchPress,
  userName = 'Sindh Hunar'
}) => {
  const MAX_HEADER_HEIGHT = RESPONSIVE.GET_HEIGHT(25);
  const MIN_HEADER_HEIGHT = RESPONSIVE.GET_HEIGHT(15);

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value, 
      [0, 100], 
      [MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT], 
      'clamp'
    );
    return { height };
  });

  return (
    <Animated.View 
      style={[headerStyle]} 
      className="w-full z-10 overflow-hidden rounded-b-[35px]"
    >
      <LinearGradient
        colors={[COLORS.primary, '#4A0000']}
        style={StyleSheet.absoluteFillObject}
      />
      <Image 
        source={images.background} 
        className="absolute inset-0 w-full h-full opacity-15"
        resizeMode="cover"
      />
      
      <SafeAreaView className="px-5 pt-3" edges={['top']}>
        <View className={`flex-row justify-between items-center mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <View className={isRTL ? 'items-end' : 'items-start'}>
            <Text className="text-[13px] text-white/70" style={{ fontFamily: fonts.poppins.regular }}>
              {t('common.welcome')} ✨
            </Text>
            <Text className="text-[26px] text-white tracking-[1.5px]" style={{ fontFamily: fonts.bebasNeue.bold }}>
              {userName}
            </Text>
          </View>

          <View className={`flex-row items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <TouchableOpacity 
              className="bg-white/20 px-3 py-2 rounded-xl border border-white/30"
              onPress={toggleLanguage}
            >
              <Text className="text-[11px] font-bold text-white tracking-[0.5px]" style={{ fontFamily: fonts.poppins.bold }}>
                {i18n.language === 'en' ? 'سنڌي' : 'ENG'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-10 h-10 rounded-xl bg-white/15 justify-center items-center"
              onPress={onSearchPress}
            >
              <Icon name="search-outline" size={RESPONSIVE.GET_FONT_SIZE(20)} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity className="w-10 h-10 rounded-xl bg-white/15 justify-center items-center">
              <Icon name="notifications-outline" size={RESPONSIVE.GET_FONT_SIZE(22)} color={COLORS.white} />
              <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#C5A059] border-[1.5px] border-[#800000]" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Search Bar */}
        <View className="mt-1">
          <TouchableOpacity 
            className={`flex-row items-center bg-white/95 rounded-[15px] px-4 h-11 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
            activeOpacity={0.9}
            onPress={onSearchPress}
          >
            <Icon name="location" size={RESPONSIVE.GET_FONT_SIZE(18)} color={COLORS.primary} />
            <Text 
              className={`flex-1 ml-2 text-[12px] text-[#1A1A1A] ${isRTL ? 'text-right mr-2 ml-0' : 'text-left'}`}
              style={{ fontFamily: fonts.poppins.medium }}
            >
              {t('home.location')}
            </Text>
            <Icon name="chevron-down" size={RESPONSIVE.GET_FONT_SIZE(16)} color="#757575" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Kept empty or minimal as NativeWind handles most styling
});

export default memo(HomeHeader);
