import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { hapticFeedback } from '../../utils/haptics';
import { useCart } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';
import { useCreateOrder } from '../../hooks/useOrders';
import { useToast } from '../../context/ToastContext';
import PremiumHeader from '../../components/PremiumHeader';
import { supabase } from '../../services/supabase/client';
import { createPayment } from '../../services/supabase/payment-service';

const { width } = Dimensions.get('window');

const CheckoutScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const isRTL = i18n.language === 'sd';

  const { items: cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: 'Sindh',
    country: 'Pakistan',
  });
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'jazzcash' | 'easypaisa'>('cash');
  const [senderName, setSenderName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [artisanInfo, setArtisanInfo] = useState<{ shop_name: string; phone: string } | null>(null);
  const [isLoadingArtisan, setIsLoadingArtisan] = useState(false);

  const artisanId = cartItems.length > 0
    ? (cartItems[0].product.artisan_id || cartItems[0].product.artisanId || '')
    : '';

  useEffect(() => {
    if (artisanId) {
      fetchArtisanDetails();
    }
  }, [artisanId]);

  const fetchArtisanDetails = async () => {
    setIsLoadingArtisan(true);
    try {
      const { data, error } = await supabase
        .from('artisans')
        .select('shop_name, phone')
        .eq('id', artisanId)
        .single();

      if (data) setArtisanInfo(data);
    } catch (error) {
      console.error('Error fetching artisan:', error);
    } finally {
      setIsLoadingArtisan(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!user) return;

    if (!address.street || !address.city || !phone) {
      showToast({ message: t('checkout.fillRequired', { defaultValue: 'Please fill all required fields' }), type: 'error' });
      return;
    }

    if (paymentMethod !== 'cash' && (!senderName || !transactionId)) {
      showToast({ message: t('checkout.paymentRequired', { defaultValue: 'Please provide payment details' }), type: 'error' });
      return;
    }

    // Map items to the format database expects (product_id, quantity, price)
    const formattedItems = cartItems.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      image: item.product.image_url || item.product.images?.[0] || '',
      quantity: item.quantity,
      price: item.product.price,
    }));

    const orderData = {
      customer_id: user.id,
      artisan_id: artisanId,
      items: formattedItems as any,
      total_amount: totalPrice + 150, // Including delivery
      shipping_address: address,
      phone: phone,
      notes: notes,
      payment_method: paymentMethod,
      sender_name: paymentMethod !== 'cash' ? senderName : undefined,
      transaction_id: paymentMethod !== 'cash' ? transactionId : undefined,
    };

    createOrder(orderData, {
      onSuccess: async (data: any) => {
        // Create payment record in the new table
        const paymentRecord = {
          order_id: data.id,
          customer_id: user.id,
          artisan_id: artisanId,
          amount: orderData.total_amount,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cash' ? 'pending' : 'verifying',
          transaction_id: transactionId,
          sender_name: senderName,
        };

        await createPayment(paymentRecord);

        clearCart();
        hapticFeedback.success();
        navigation.navigate('OrderHistory' as never);
        showToast({ message: t('checkout.success', { defaultValue: 'Order placed successfully!' }), type: 'success' });
      },
      onError: (error) => {
        showToast({ message: error.message, type: 'error' });
      }
    });
  };

  const renderPaymentOption = (id: 'cash' | 'jazzcash' | 'easypaisa', label: string, icon: string, color: string) => {
    const isSelected = paymentMethod === id;
    return (
      <TouchableOpacity
        onPress={() => {
          hapticFeedback.light();
          setPaymentMethod(id);
        }}
        style={[
          styles.paymentOption,
          isSelected && { borderColor: color, backgroundColor: color + '10' }
        ]}
      >
        <View style={styles.paymentIconContainer}>
          <Icon name={icon} size={24} color={isSelected ? color : '#999'} />
        </View>
        <Text style={[styles.paymentLabel, isSelected && { color: color, fontFamily: fonts.poppins.bold }]}>
          {label}
        </Text>
        {isSelected && (
          <Animated.View entering={ZoomIn} style={[styles.checkCircle, { backgroundColor: color }]}>
            <Icon name="checkmark" size={12} color="white" />
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <PremiumHeader
        title={t('checkout.title', { defaultValue: 'CHECKOUT' })}
        showBackButton
        onBackPress={() => navigation.goBack()}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Shipping Section */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Text style={styles.sectionTitle}>{t('checkout.orderItems', { defaultValue: 'Order Items' })}</Text>
            {cartItems.map((item, index) => (
              <View key={item.product.id} style={styles.itemRow}>
                <Image
                  source={item.product.image_url ? { uri: item.product.image_url } : (item.product.images?.[0] ? { uri: item.product.images[0] } : require('../../assets/images/AjrakBG.jpg'))}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>Rs {item.product.price * item.quantity}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Shipping Section */}
          <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
            <Text style={styles.sectionTitle}>{t('checkout.shippingInfo', { defaultValue: 'Shipping Information' })}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('checkout.street', { defaultValue: 'Street Address' })} *</Text>
              <TextInput
                style={[styles.input, isRTL && { textAlign: 'right' }]}
                placeholder="House #, Street Name"
                value={address.street}
                onChangeText={(text) => setAddress({ ...address, street: text })}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>{t('checkout.city', { defaultValue: 'City' })} *</Text>
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  placeholder="Karachi, Hyderabad..."
                  value={address.city}
                  onChangeText={(text) => setAddress({ ...address, city: text })}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>{t('checkout.phone', { defaultValue: 'Phone Number' })} *</Text>
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  placeholder="0300XXXXXXX"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('checkout.notes', { defaultValue: 'Order Notes (Optional)' })}</Text>
              <TextInput
                style={[styles.input, styles.textArea, isRTL && { textAlign: 'right' }]}
                placeholder="Any special instructions..."
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </Animated.View>

          {/* Payment Section */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>{t('checkout.paymentMethod', { defaultValue: 'Payment Method' })}</Text>

            <View style={styles.paymentGrid}>
              {renderPaymentOption('cash', 'Cash', 'cash-outline', '#4CAF50')}
              {renderPaymentOption('jazzcash', 'JazzCash', 'wallet-outline', '#C41E3A')}
              {renderPaymentOption('easypaisa', 'EasyPaisa', 'phone-portrait-outline', '#1B5E20')}
            </View>

            {paymentMethod !== 'cash' && (
              <Animated.View entering={FadeInUp} style={styles.paymentDetailsContainer}>
                <View style={styles.artisanPaymentInfo}>
                  <Text style={styles.infoTitle}>
                    {t('checkout.sendTo', { defaultValue: 'Send Payment To:' })}
                  </Text>

                  <View style={styles.officialAccountCard}>
                    <View style={styles.accountRow}>
                      <Icon
                        name={paymentMethod === 'jazzcash' ? 'wallet' : 'phone-portrait'}
                        size={20}
                        color={paymentMethod === 'jazzcash' ? '#C41E3A' : '#1B5E20'}
                      />
                      <Text style={styles.accountLabel}>
                        {paymentMethod === 'jazzcash' ? 'JazzCash Account' : 'EasyPaisa Account'}
                      </Text>
                    </View>

                    <Text style={styles.accountHolderName}>
                      {paymentMethod === 'jazzcash' ? 'Abdul Qayuum' : 'Abdul Qadeer'}
                    </Text>

                    <TouchableOpacity
                      style={styles.phoneBadge}
                      onPress={() => {
                        hapticFeedback.light();
                        showToast({ message: 'Number copied!', type: 'info' });
                      }}
                    >
                      <Text style={styles.artisanPhone}>03023466105</Text>
                      <Icon name="copy-outline" size={16} color={colors.primary} style={{ marginLeft: 10 }} />
                    </TouchableOpacity>

                    <Text style={styles.instructionText}>
                      {t('checkout.instruction', { defaultValue: 'Please send the total amount to this number and enter the transaction details below:' })}
                    </Text>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('checkout.senderName', { defaultValue: 'Sender Account Name' })} *</Text>
                  <TextInput
                    style={[styles.input, isRTL && { textAlign: 'right' }]}
                    placeholder="The name on your account"
                    value={senderName}
                    onChangeText={setSenderName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('checkout.transactionId', { defaultValue: 'Transaction ID / TID' })} *</Text>
                  <TextInput
                    style={[styles.input, isRTL && { textAlign: 'right' }]}
                    placeholder="Enter the 10-12 digit ID"
                    value={transactionId}
                    onChangeText={setTransactionId}
                  />
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* Order Summary */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('checkout.subtotal', { defaultValue: 'Subtotal' })}</Text>
              <Text style={styles.summaryValue}>Rs {totalPrice}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('checkout.delivery', { defaultValue: 'Delivery' })}</Text>
              <Text style={styles.summaryValue}>Rs 150</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>{t('checkout.total', { defaultValue: 'Total' })}</Text>
              <Text style={styles.totalValue}>Rs {totalPrice + 150}</Text>
            </View>
          </Animated.View>

          <TouchableOpacity
            style={styles.placeOrderBtn}
            onPress={handlePlaceOrder}
            disabled={isCreatingOrder}
          >
            <LinearGradient
              colors={[colors.primary, '#4A0000']}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isCreatingOrder ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>{t('checkout.confirmOrder', { defaultValue: 'CONFIRM ORDER' })}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </PremiumHeader>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 10,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bebasNeue.bold,
    color: '#333',
    marginBottom: 20,
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 14,
    fontFamily: fonts.poppins.bold,
    color: '#333',
  },
  itemQty: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: '#999',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: fonts.poppins.bold,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: fonts.poppins.bold,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentOption: {
    flex: 1,
    height: 90,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    position: 'relative',
  },
  paymentIconContainer: {
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 11,
    fontFamily: fonts.poppins.medium,
    color: '#777',
  },
  checkCircle: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  paymentDetailsContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  officialAccountCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  accountLabel: {
    fontSize: 12,
    fontFamily: fonts.poppins.medium,
    color: '#666',
    marginLeft: 8,
  },
  accountHolderName: {
    fontSize: 18,
    fontFamily: fonts.poppins.bold,
    color: '#333',
    marginBottom: 10,
  },
  artisanPaymentInfo: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoTitle: {
    fontSize: 12,
    fontFamily: fonts.poppins.bold,
    color: '#999',
    marginBottom: 10,
  },
  artisanName: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.primary,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  artisanPhone: {
    fontSize: 15,
    fontFamily: fonts.bebasNeue.bold,
    color: colors.primary,
    marginLeft: 5,
    letterSpacing: 1,
  },
  instructionText: {
    fontSize: 11,
    fontFamily: fonts.poppins.regular,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    padding: 20,
    marginBottom: 25,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
  },
  summaryValue: {
    color: 'white',
    fontFamily: fonts.poppins.bold,
    fontSize: 14,
  },
  totalDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 10,
  },
  totalLabel: {
    color: 'white',
    fontFamily: fonts.bebasNeue.bold,
    fontSize: 22,
    letterSpacing: 1,
  },
  totalValue: {
    color: '#C5A059',
    fontFamily: fonts.bebasNeue.bold,
    fontSize: 22,
    letterSpacing: 1,
  },
  placeOrderBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  btnGradient: {
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    letterSpacing: 2,
  },
});

export default CheckoutScreen;
