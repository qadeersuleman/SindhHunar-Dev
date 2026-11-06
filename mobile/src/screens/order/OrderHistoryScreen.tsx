import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useMyOrders } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { fonts } from '../../utils/fonts';
import { RESPONSIVE } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { supabase } from '../../services/supabase/client';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
  success: '#22C55E',
  pending: '#F59E0B',
};

const OrderHistoryScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data: orders, isLoading, refetch } = useMyOrders(user?.id || '');

  useEffect(() => {
    console.log('OrderHistoryScreen - Current User ID:', user?.id);
    if (orders) {
      console.log('OrderHistoryScreen - Orders fetched:', orders.length);
      if (orders.length > 0) {
        console.log('First order data:', JSON.stringify(orders[0], null, 2));
      }
    }
  }, [user?.id, orders]);
  React.useEffect(() => {
    if (!user?.id) return;

    // Use a unique channel name to avoid conflicts during re-renders
    const channelName = `order-updates-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('[REAL-TIME] Order update detected:', payload);
          refetch();
        }
      )
      .subscribe((status) => {
        console.log(`[REAL-TIME] Subscription status for ${channelName}:`, status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return COLORS.success;
      case 'pending': return COLORS.pending;
      case 'cancelled': return '#EF4444';
      default: return COLORS.secondary;
    }
  };

  const renderOrderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 100)}
      style={styles.orderCard}
    >
      <View style={[styles.orderHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View>
          <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* User Info Section */}
      <View style={[styles.userInfoContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Icon name="person-outline" size={16} color={COLORS.gray} />
        <Text style={[styles.userName, { textAlign: isRTL ? 'right' : 'left' }]}>
          {item.customer?.name || t('common.user')} • {item.phone || item.customer?.phone}
        </Text>
      </View>

      <View style={[styles.addressContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Icon name="location-outline" size={16} color={COLORS.gray} />
        <Text style={[styles.addressText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {item.shipping_address?.street}, {item.shipping_address?.city}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.orderContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{item.artisans?.shop_name || 'Artisan'}</Text>
          <Text style={styles.itemCount}>
            {item.items?.reduce((acc: number, i: any) => acc + (i.quantity || 0), 0) || 0} {isRTL ? 'شيون' : 'Items'}
          </Text>
        </View>
        <View style={styles.paymentBadgeContainer}>
          <Text style={styles.paymentMethodText}>
            {item.payments?.[0]?.payment_method?.toUpperCase() || 'CASH'}
          </Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={styles.totalLabel}>{t('jholi.total')}</Text>
          <Text style={styles.totalPrice}>Rs. {item.total_amount}</Text>
        </View>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsPreview}>
        {item.items?.slice(0, 2).map((subItem: any, idx: number) => (
          <Text key={idx} style={[styles.itemDetailText, { textAlign: isRTL ? 'right' : 'left' }]}>
            • {subItem.quantity}x {subItem.product_name || 'Product'} (Rs. {subItem.price})
          </Text>
        ))}
        {item.items?.length > 2 && (
          <Text style={styles.moreItemsText}>+{item.items.length - 2} more items...</Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.detailButton}
        onPress={() => {/* Navigate to order detail if needed */}}
      >
        <Text style={styles.detailButtonText}>{isRTL ? 'تفصيل ڏسو' : 'View Details'}</Text>
        <Icon name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'آرڊر جي تاريخ' : 'Order History'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : orders && orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Icon name="receipt-outline" size={80} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>
            {isRTL ? 'اڃا ڪو به آرڊر ناهي ڪيو ويو' : 'No orders placed yet'}
          </Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => (navigation as any).navigate('Main', { screen: 'Bazaar' })}
          >
            <Text style={styles.shopNowText}>{isRTL ? 'خريداري ڪريو' : 'Shop Now'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
  },
  listContent: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  orderHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 14,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
  },
  orderDate: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: fonts.poppins.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginBottom: 15,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  userName: {
    fontSize: 14,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  addressText: {
    fontSize: 13,
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
    flex: 1,
  },
  itemsPreview: {
    backgroundColor: COLORS.lightGray + '50',
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
  },
  itemDetailText: {
    fontSize: 12,
    fontFamily: fonts.poppins.medium,
    color: COLORS.dark,
    marginBottom: 4,
  },
  moreItemsText: {
    fontSize: 11,
    fontFamily: fonts.poppins.regular,
    color: COLORS.secondary,
    fontStyle: 'italic',
  },
  orderContent: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
  },
  itemCount: {
    fontSize: 12,
    fontFamily: fonts.poppins.medium,
    color: COLORS.secondary,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  paymentBadgeContainer: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  paymentMethodText: {
    fontSize: 9,
    fontFamily: fonts.poppins.bold,
    color: COLORS.gray,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: fonts.bebasNeue.bold,
    color: COLORS.primary,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  detailButtonText: {
    fontSize: 14,
    fontFamily: fonts.poppins.bold,
    color: COLORS.primary,
    marginRight: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.poppins.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
  },
  shopNowText: {
    color: COLORS.white,
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
  },
});

export default OrderHistoryScreen;
