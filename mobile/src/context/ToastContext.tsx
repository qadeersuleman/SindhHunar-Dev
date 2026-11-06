import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../utils/colors';
import Animated, { 
  FadeOutUp, 
  FadeInDown,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Theme colors for different toast types
const COLORS: Record<string, any> = {
  success: [colors.success, colors.secondary],
  error: [colors.error, colors.ajrakRed],
  info: [colors.info, colors.ajrakBlue],
  warning: [colors.warning, colors.ajrakYellow],
  white: colors.surface,
  glass: 'rgba(255, 255, 255, 0.8)',
};

const ICONS: Record<string, string> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
  warning: 'warning',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n?.language === 'sd';
  
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setToast({ message, type, duration });
    setIsVisible(true);

    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete before clearing toast data
      setTimeout(() => setToast(null), 500);
    }, duration);
  }, []);

  const toastType = toast?.type || 'info';
  const themeColor = COLORS[toastType] ? COLORS[toastType][0] : COLORS.info[0];
  const iconName = ICONS[toastType] || ICONS.info;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isVisible && toast && (
        <View style={styles.container} pointerEvents="none">
          <Animated.View 
            entering={FadeInDown.duration(600).springify()}
            exiting={FadeOutUp.duration(400)}
            style={styles.toastWrapper}
          >
            <BlurView
              style={StyleSheet.absoluteFillObject}
              blurType="light"
              blurAmount={25}
              reducedTransparencyFallbackColor="white"
            />
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
              style={styles.glassLayer}
            />
            
            <View style={[
              styles.content, 
              { 
                flexDirection: isRTL ? 'row-reverse' : 'row',
                borderLeftWidth: isRTL ? 0 : 4,
                borderRightWidth: isRTL ? 4 : 0,
                borderLeftColor: isRTL ? 'transparent' : themeColor,
                borderRightColor: isRTL ? themeColor : 'transparent',
              }
            ]}>
              <View style={[
                styles.iconContainer, 
                { 
                  backgroundColor: themeColor,
                  marginLeft: isRTL ? 12 : 0,
                  marginRight: isRTL ? 0 : 12,
                }
              ]}>
                <Icon name={iconName} size={20} color={COLORS.white} />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.messageText, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {toast.message}
                </Text>
              </View>
            </View>

            <View style={styles.glowBorder} />
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastWrapper: {
    width: width * 0.85,
    minHeight: 60,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  glassLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  messageText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  glowBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(197, 160, 89, 0.3)', // Antique Gold Glow
  }
});
