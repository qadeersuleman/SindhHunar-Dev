import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { fonts } from '../../utils/fonts';
import { images } from '../../utils/images';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  accent: '#002366',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  dark: '#1A1A1A',
  gray: '#757575',
};

const HERITAGE_STORIES = [
  {
    id: '1',
    title: 'The Art of Ajrak',
    description: 'A 4,000-year-old tradition of block printing using natural dyes. Each pattern tells a story of the Indus Valley.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
    tag: 'Legacy',
  },
  {
    id: '2',
    title: 'Ghotki’s Golden Peda',
    description: 'Made from pure buffalo milk, this sweet has been the pride of Ghotki for generations.',
    image: 'https://images.unsplash.com/photo-1589113103503-49673c683669?q=80&w=1000&auto=format&fit=crop',
    tag: 'Taste',
  },
  {
    id: '3',
    title: 'Ralli: Stitched Dreams',
    description: 'Women of Sindh stitch together scraps of fabric to create masterpieces of geometric art.',
    image: 'https://images.unsplash.com/photo-1528459801416-a7e99a0dce3a?q=80&w=1000&auto=format&fit=crop',
    tag: 'Craft',
  },
];

const ARTISANS = [
  { id: '1', name: 'Mai Ghulam', craft: 'Embroidery', location: 'Ghotki', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Saeed Ahmed', craft: 'Ajrak Master', location: 'Bhit Shah', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Fatima Bai', craft: 'Ralli Artist', location: 'Umerkot', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
];

import { Card, Chip, Button as PaperButton } from 'react-native-paper';
import { useSindhiArtisans } from '../../hooks/useSindhiCrafts';

const CultureScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  
  // Use React Query for artisans
  const { data: artisans, isLoading: artisansLoading } = useSindhiArtisans({ limit: 10, active: true });

  const renderStory = ({ item, index }: { item: typeof HERITAGE_STORIES[0]; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 200).springify()}
      className="mr-5 shadow-lg"
    >
      <Card className="w-[300px] h-[250px] rounded-[25px] overflow-hidden elevation-5">
        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          className="absolute inset-0 p-5 justify-end"
        >
          <View className={`self-start mb-2 ${isRTL ? 'self-end' : ''}`}>
            <Chip 
              className="bg-[#C5A059] h-6 justify-center" 
              textStyle={{ color: 'white', fontFamily: fonts.poppins.bold, fontSize: 10, marginVertical: 0 }}
            >
              {item.tag}
            </Chip>
          </View>
          <Text className={`text-white text-[18px] ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.bold }}>{item.title}</Text>
          <Text className={`text-white/80 text-[12px] ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.regular }} numberOfLines={2}>
            {item.description}
          </Text>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  const renderArtisan = ({ item, index }: { item: any; index: number }) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 150).springify()}
      className="w-[120px] items-center mr-5"
    >
      <Image 
        source={{ uri: item.logo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.shop_name}` }} 
        className="w-[100px] h-[100px] rounded-full mb-3 border-2 border-[#C5A059] bg-white" 
      />
      <Text className="text-[13px] text-[#1A1A1A] text-center" style={{ fontFamily: fonts.poppins.bold }} numberOfLines={1}>{item.shop_name}</Text>
      <Text className="text-[11px] text-[#800000] text-center" style={{ fontFamily: fonts.poppins.medium }} numberOfLines={1}>
        {item.specialty && item.specialty.length > 0 ? item.specialty[0] : 'Artisan'}
      </Text>
      <View className="flex-row items-center mt-1">
        <Icon name="location-outline" size={10} color={COLORS.secondary} />
        <Text className="text-[10px] text-[#757575] ml-1" style={{ fontFamily: fonts.poppins.regular }}>{item.address || 'Sindh'}</Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FAF9F6]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-5 mb-8">
          <Text className={`text-[36px] text-[#800000] tracking-widest uppercase ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.bebasNeue.bold }}>
            {t('culture.title')}
          </Text>
          <Text className={`text-[14px] text-[#757575] -mt-1 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: fonts.poppins.regular }}>
            {t('culture.subtitle')}
          </Text>
        </View>

        {/* Heritage Stories */}
        <View className="mb-8">
          <View className={`flex-row justify-between items-center px-5 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Text className="text-[24px] text-[#1A1A1A] tracking-wider uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>
              {t('culture.heritageStories')}
            </Text>
            <TouchableOpacity>
              <Text className="text-[13px] text-[#C5A059]" style={{ fontFamily: fonts.poppins.medium }}>{t('culture.readAll')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={HERITAGE_STORIES}
            renderItem={renderStory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
            snapToInterval={320}
            decelerationRate="fast"
            inverted={isRTL}
          />
        </View>

        {/* Artisans Section */}
        <View className="mb-8">
          <View className={`flex-row justify-between items-center px-5 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Text className="text-[24px] text-[#1A1A1A] tracking-wider uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>
              {t('culture.meetArtisans')}
            </Text>
          </View>
          <FlatList
            data={artisans}
            renderItem={renderArtisan}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
            inverted={isRTL}
          />
        </View>

        {/* Culture Quote Card */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          className="mx-5 mb-8 rounded-[25px] overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.primary, '#4A0000']}
            className="p-8 items-center"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="quote" size={30} color="rgba(255,255,255,0.2)" className="mb-3" />
            <Text className="text-white text-[16px] text-center italic leading-6" style={{ fontFamily: fonts.poppins.medium }}>
              {t('culture.quote')}
            </Text>
            <View className="w-10 h-0.5 bg-[#C5A059] my-4" />
            <Text className="text-[#C5A059] text-[16px] tracking-wider uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>{t('culture.quoteAuthor')}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Gallery Grid Preview */}
        <View className="mb-8">
          <View className={`flex-row justify-between items-center px-5 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Text className="text-[24px] text-[#1A1A1A] tracking-wider uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>
              {t('culture.visualGallery')}
            </Text>
          </View>
          <View className="flex-row flex-wrap px-4 justify-between">
            {[
              'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format',
              'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format',
              'https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=400&auto=format',
              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format'
            ].map((url, index) => (
              <Animated.View 
                key={index} 
                entering={FadeInDown.delay(700 + (index * 100)).springify()}
                className="w-[48%] h-[150px] rounded-2xl overflow-hidden mb-4"
              >
                <Image 
                  source={{ uri: url }} 
                  className="w-full h-full" 
                  resizeMode="cover"
                />
              </Animated.View>
            ))}
          </View>
        </View>

        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // NativeWind handles the styles
});

export default CultureScreen;
