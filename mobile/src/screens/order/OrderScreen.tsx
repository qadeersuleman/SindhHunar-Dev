import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
  FadeInRight, 
  FadeInDown, 
  Layout, 
  FadeOutLeft 
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { fonts } from '../../utils/fonts';
import { hapticFeedback } from '../../utils/haptics';
import LottieAnimation from '../../components/LottieAnimation';
import EmptyCartAnimation from '../../assets/animations/EmptyCart.json';
import PremiumHeader from '../../components/PremiumHeader';
import { useCart } from '../../store/cartStore';
import { CartItem } from '../../store/slices/cartSlice';

import { useAuth } from '../../hooks/useAuth';
import { useCreateOrder } from '../../hooks/useOrders';
import { useToast } from '../../context/ToastContext';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
};

const JholiScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const isRTL = i18n.language === 'sd';
  const { items: cartItems, updateQuantity, removeFromCart, totalPrice: totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  
  let tabBarHeight = 0;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {
    tabBarHeight = 0;
  }

  const handleCheckout = () => {
    if (!user) {
      showToast({ message: t('common.pleaseLogin'), type: 'info' });
      return;
    }

    if (cartItems.length === 0) return;

    navigation.navigate('Checkout' as never);
  };

  const calculateTotal = () => totalAmount;

  const renderItem = ({ item, index }: { item: CartItem; index: number }) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).springify()}
      exiting={FadeOutLeft}
      layout={Layout.springify()}
      style={styles.cartItemCard}
    >
      <View style={[styles.itemRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.imageContainer}>
          <Image 
            source={(() => {
              const img = item.product.image_url || item.product.image || (Array.isArray(item.product.images) ? item.product.images[0] : null);
              if (!img) return { uri: 'https://via.placeholder.com/150' };
              return typeof img === 'string' ? { uri: img } : img;
            })()} 
            style={styles.productImage}
            resizeMode="cover" 
          />
        </View>

        <View style={[styles.itemDetails, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
          <Text style={styles.artisanName}>{t('common.by')} {item.product.artisan_name || 'Sindhi Artisan'}</Text>
          <Text style={styles.itemPrice}>{t('jholi.currency')} {item.product.price}</Text>
          
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              onPress={() => {
                hapticFeedback.light();
                updateQuantity(item.product.id, item.quantity - 1);
              }}
              style={styles.quantityBtn}
            >
              <Icon name="remove" size={14} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity 
              onPress={() => {
                hapticFeedback.light();
                updateQuantity(item.product.id, item.quantity + 1);
              }}
              style={styles.quantityBtn}
            >
              <Icon name="add" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={() => {
            hapticFeedback.medium();
            removeFromCart(item.product.id);
          }}
          style={styles.deleteBtn}
        >
          <Icon name="trash-outline" size={20} color="#E57373" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderFooter = () => (
    <Animated.View 
      entering={FadeInDown.delay(200).springify()}
      style={styles.scrollFooter}
    >
      <View style={styles.summaryBox}>
        <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={styles.summaryLabel}>{t('jholi.subtotal')}</Text>
          <Text style={styles.summaryValue}>{t('jholi.currency')} {calculateTotal()}</Text>
        </View>
        <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={styles.summaryLabel}>{t('jholi.delivery')}</Text>
          <Text style={styles.summaryValue}>{t('jholi.currency')} 150</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={[styles.totalRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={styles.totalLabel}>{t('jholi.totalJholi')}</Text>
          <Text style={styles.totalValue}>{t('jholi.currency')} {calculateTotal() + 150}</Text>
        </View>
      </View>

      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={handleCheckout}
        disabled={isCreatingOrder}
        style={styles.checkoutBtnContainer}
      >
        <LinearGradient
          colors={[COLORS.primary, '#4A0000']}
          style={styles.checkoutBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {isCreatingOrder ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <View style={[styles.btnInner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.btnText}>{t('jholi.checkout')}</Text>
              <Icon name={isRTL ? "arrow-back" : "arrow-forward"} size={18} color="white" style={{ marginHorizontal: 6 }} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={{ height: tabBarHeight + 20 }} />
    </Animated.View>
  );

  const HeaderContent = () => (
    <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={styles.headerTitle}>{t('jholi.title')}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{`${cartItems.length} ${t('jholi.items')}`}</Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('OrderHistory' as never)}
        style={styles.historyBtn}
      >
        <Icon name="receipt-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <PremiumHeader 
      headerContent={<HeaderContent />}
      height={160}
      overlap={30}
    >
      {cartItems.length > 0 ? (
        <Animated.FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.product.id}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={Layout.springify()}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <LottieAnimation
            source={EmptyCartAnimation}
            size={200}
            autoPlay={true}
            loop={true}
          />
          <Text style={styles.emptyTitle}>{t('jholi.emptyTitle') || 'KHALI JHOLI!'}</Text>
          <Text style={styles.emptySubtitle}>
            {t('jholi.emptySubtitle') || 'Add some authentic Sindhi crafts to start your collection!'}
          </Text>
          <TouchableOpacity 
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('Bazaar' as never)}
          >
            <Text style={styles.exploreText}>{t('jholi.exploreBazaar')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </PremiumHeader>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fonts.bebasNeue.bold,
    color: 'white',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  badgeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontFamily: fonts.poppins.bold,
  },
  historyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listPadding: {
    padding: 20,
    paddingTop: 25,
  },
  cartItemCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemRow: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginHorizontal: 12,
  },
  itemName: {
    fontSize: 14,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
  },
  artisanName: {
    fontSize: 11,
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontFamily: fonts.poppins.bold,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 3,
    alignSelf: 'flex-start',
  },
  quantityBtn: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
    marginHorizontal: 10,
  },
  deleteBtn: {
    padding: 6,
  },
  scrollFooter: {
    marginTop: 10,
    paddingBottom: 20,
  },
  summaryBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryRow: {
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 10,
  },
  totalRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: fonts.poppins.bold,
    color: COLORS.primary,
  },
  checkoutBtnContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutBtn: {
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: fonts.poppins.bold,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 28,
    fontFamily: fonts.bebasNeue.bold,
    color: COLORS.primary,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  exploreBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
  },
  exploreText: {
    color: 'white',
    fontFamily: fonts.poppins.bold,
    fontSize: 14,
  },
});

export default JholiScreen;
