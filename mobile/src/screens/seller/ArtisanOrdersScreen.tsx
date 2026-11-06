import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useArtisanOrders, useUpdateOrder } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { fonts } from '../../utils/fonts';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { supabase } from '../../services/supabase/client';
import { useQuery } from '@tanstack/react-query';

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

const ArtisanOrdersScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  // First fetch the artisan record for this user
  const { data: artisanData } = useQuery({
    queryKey: ['artisan-profile', user?.id],
    queryFn: async () => {
      console.log('Fetching artisan profile for user:', user?.id);
      const { data, error } = await supabase
        .from('artisans')
        .select('id')
        .eq('owner_id', user?.id)
        .single();
      
      if (error) {
        console.error('Error fetching artisan profile:', error);
        throw error;
      }
      console.log('Found artisan ID:', data?.id);
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: orders, isLoading, refetch } = useArtisanOrders(artisanData?.id || '');

  React.useEffect(() => {
    if (artisanData?.id) {
      console.log('ArtisanOrdersScreen - Artisan ID:', artisanData.id);
    }
    if (orders) {
      console.log('ArtisanOrdersScreen - Orders fetched:', orders.length);
    }
  }, [artisanData, orders]);

  const { mutate: updateStatus } = useUpdateOrder();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return COLORS.success;
      case 'pending': return COLORS.pending;
      case 'cancelled': return '#EF4444';
      case 'confirmed': return '#3B82F6';
      default: return COLORS.secondary;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateStatus({ orderId, status: newStatus }, {
      onSuccess: () => refetch()
    });
  };

  const renderOrderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 100)}
      style={styles.orderCard}
    >
      <View style={styles.orderHeader}>
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

      {/* Customer Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionLabel}>Customer Details:</Text>
        <View style={styles.infoRow}>
          <Icon name="person-outline" size={16} color={COLORS.gray} />
          <Text style={styles.infoValue}>{item.customer?.name || 'Guest User'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="call-outline" size={16} color={COLORS.gray} />
          <Text style={styles.infoValue}>{item.phone || item.customer?.phone || 'No phone'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="location-outline" size={16} color={COLORS.gray} />
          <Text style={styles.infoValue}>
            {item.shipping_address?.street}, {item.shipping_address?.city}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Items Preview */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionLabel}>Ordered Items:</Text>
        {item.items?.map((subItem: any, idx: number) => (
          <View key={idx} style={styles.itemRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <Image 
                source={subItem.image ? { uri: subItem.image } : require('../../assets/images/AjrakBG.jpg')}
                style={styles.subItemImage}
              />
              <Text style={styles.itemText}>• {subItem.quantity}x {subItem.product_name || 'Product'}</Text>
            </View>
            <Text style={styles.itemPrice}>Rs. {subItem.price * subItem.quantity}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Net Revenue:</Text>
        <Text style={styles.totalValue}>
          Rs. {item.items?.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0) || 0}
        </Text>
      </View>
      <Text style={styles.deliveryNote}>* Excludes Rs. 150 Delivery Fee (TCS)</Text>

      {/* Actions */}
      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
            onPress={() => handleStatusUpdate(item.id, 'confirmed')}
          >
            <Text style={styles.actionBtnText}>Confirm Order</Text>
          </TouchableOpacity>
        )}
        {item.status === 'confirmed' && (
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
            onPress={() => handleStatusUpdate(item.id, 'delivered')}
          >
            <Text style={styles.actionBtnText}>Mark Delivered</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Orders</Text>
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
          <Text style={styles.emptyText}>No orders received yet</Text>
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
    flexDirection: 'row',
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  orderHeader: {
    flexDirection: 'row',
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
    marginVertical: 15,
  },
  infoSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: fonts.poppins.bold,
    color: COLORS.secondary,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.poppins.medium,
    color: COLORS.dark,
    flex: 1,
  },
  itemsSection: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subItemImage: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  itemText: {
    fontSize: 13,
    fontFamily: fonts.poppins.regular,
    color: COLORS.dark,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: fonts.poppins.bold,
    color: COLORS.gray,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: fonts.poppins.bold,
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: fonts.poppins.bold,
    color: COLORS.primary,
  },
  deliveryNote: {
    fontSize: 10,
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    color: COLORS.white,
    fontFamily: fonts.poppins.bold,
    fontSize: 14,
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
    marginTop: 20,
  },
});

export default ArtisanOrdersScreen;
