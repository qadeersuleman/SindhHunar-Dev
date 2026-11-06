import React, { memo } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../../utils/fonts';
import { RESPONSIVE } from '../../../utils/responsive';
import LottieAnimation from '../../../components/LottieAnimation';
import scrolldownAnimation from '../../../assets/animations/scrolldown.json';

const COLORS = {
  primary: '#800000',
  white: '#FFFFFF',
  gray: '#757575',
  lightGray: '#F0F0F0',
};

interface CategoryListProps {
  categories: any[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  isRTL: boolean;
  t: any;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  isRTL,
  t
}) => {
  const renderCategoryItem = ({ item }: { item: any }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity
        className={`flex-row items-center px-4 py-2.5 rounded-full mr-3 shadow-sm ${
          isSelected ? 'bg-[#800000]' : 'bg-white'
        } ${isRTL ? 'flex-row-reverse' : ''}`}
        onPress={() => onSelectCategory(item.id)}
        activeOpacity={0.7}
      >
        <View 
          className={`w-8 h-8 rounded-xl justify-center items-center ${
            isSelected ? 'bg-white/20' : 'bg-[#800000]/10'
          }`}
        >
          <Icon 
            name={item.icon} 
            size={RESPONSIVE.GET_FONT_SIZE(18)} 
            color={isSelected ? COLORS.white : COLORS.primary} 
          />
        </View>
        <Text 
          className={`mx-2 text-[13px] ${
            isSelected ? 'text-white font-bold' : 'text-[#757575] font-medium'
          }`}
          style={{ fontFamily: isSelected ? fonts.poppins.bold : fonts.poppins.medium }}
        >
          {t(`home.${item.name.toLowerCase()}`, { defaultValue: item.name })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: RESPONSIVE.GET_WIDTH(5), paddingBottom: RESPONSIVE.GET_HEIGHT(1) }}
        inverted={isRTL}
      />
      <View className="items-center mt-2">
        <LottieAnimation
          source={scrolldownAnimation}
          size={30}
          autoPlay={true}
          loop={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // NativeWind handles the styles
});

export default memo(CategoryList);
