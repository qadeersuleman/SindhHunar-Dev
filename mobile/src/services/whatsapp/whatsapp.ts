import { Linking, Alert } from 'react-native';

export interface WhatsAppOrderData {
  productName: string;
  quantity: number;
  price: number;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  sellerPhone: string;
}

export const sendOrderViaWhatsApp = async (orderData: WhatsAppOrderData): Promise<boolean> => {
  try {
    const {
      productName,
      quantity,
      price,
      customerName,
      customerAddress,
      customerPhone,
      sellerPhone,
    } = orderData;

    const total = price * quantity;
    
    const message = `🛍️ *New Order from Sindh Hunar*

📦 *Product Details:*
• Product: ${productName}
• Quantity: ${quantity}
• Price per item: $${price.toFixed(2)}
• Total: $${total.toFixed(2)}

👤 *Customer Information:*
• Name: ${customerName}
• Address: ${customerAddress}
${customerPhone ? `• Phone: ${customerPhone}` : ''}

📱 *Order placed via Sindh Hunar App*

Please confirm availability and delivery details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${sellerPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

    const supported = await Linking.canOpenURL(whatsappUrl);
    
    if (supported) {
      await Linking.openURL(whatsappUrl);
      return true;
    } else {
      Alert.alert(
        'WhatsApp Not Available',
        'WhatsApp is not installed on your device. Please install WhatsApp to use this feature.',
        [{ text: 'OK' }]
      );
      return false;
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    Alert.alert(
      'Error',
      'Unable to open WhatsApp. Please try again or contact the seller directly.',
      [{ text: 'OK' }]
    );
    return false;
  }
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/[^0-9]/g, '');
  
  // Remove leading zeros and add country code if needed
  if (cleaned.startsWith('0')) {
    return `92${cleaned.substring(1)}`; // Pakistan country code
  }
  
  // If number doesn't start with country code, add it
  if (!cleaned.startsWith('92') && cleaned.length === 10) {
    return `92${cleaned}`;
  }
  
  return cleaned;
};

export const validateWhatsAppNumber = (phone: string): boolean => {
  const cleaned = formatPhoneNumber(phone);
  
  // Check if it's a valid Pakistan mobile number (10-11 digits after country code)
  const pakistanMobileRegex = /^92[3]\d{9}$/;
  return pakistanMobileRegex.test(cleaned);
};
