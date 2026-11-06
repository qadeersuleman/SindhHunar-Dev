import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { images } from '../../utils/images';
import { fonts } from '../../utils/fonts';
import { useAuth } from '../../hooks/useAuth';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import { Button } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import LottieAnimation from 'lottie-react-native';
import loadingspinner from '../../assets/animations/loadingspinner.json';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#C41E3A', // Sindhi Red
  secondary: '#C5A059', // Sindhi Gold
  accent: '#1E3A8A', // Deep Blue
  black: '#000000',
  white: '#FFFFFF',
};

const VerifyOtpScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { email, type = 'magiclink' } = route.params || { email: '', type: 'magiclink' };
  
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const { verifyOtp, sendOtp, loading } = useAuth();
  const [isSuccessDelay, setIsSuccessDelay] = useState(false);
  const { showToast } = useToast();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otpCode.length < 6) {
      showToast({ message: 'Please enter 6-digit code', type: 'error' });
      return;
    }
    try {
      const result = await verifyOtp({ email, token: otpCode, type });
      if (result.user) {
        setIsSuccessDelay(true);
        showToast({ message: 'Verification Successful! Welcome.', type: 'success' });
        // Optional: you can wait 1-2s before React Query triggers the navigation automatically
        setTimeout(() => setIsSuccessDelay(false), 2000);
      }
    } catch (err: any) {
      showToast({ message: err.message || 'Invalid Code', type: 'error' });
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp(email);
      setTimer(60);
      setOtpCode('');
      showToast({ message: 'New code sent!', type: 'success' });
    } catch (err: any) {
      showToast({ message: 'Failed to resend code', type: 'error' });
    }
  };

  // Background Animation
  const floatAnim = useSharedValue(0);
  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(withTiming(1, { duration: 4000 }), withTiming(0, { duration: 4000 })),
      -1,
      true
    );
  }, []);

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatAnim.value, [0, 1], [0, -30]) },
      { scale: interpolate(floatAnim.value, [0, 1], [1, 1.1]) }
    ],
  }));

  const renderOtpBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 6; i++) {
      const char = otpCode[i] || '';
      const isFocused = otpCode.length === i;
      
      boxes.push(
        <Animated.View 
          key={i}
          entering={FadeInDown.delay(100 * i)}
          className={`w-[40px] h-[50px] rounded-2xl items-center justify-center border-2 ${
            char ? 'border-[#C5A059] bg-[#C5A059]/10' : isFocused ? 'border-[#C41E3A] bg-[#C41E3A]/10' : 'border-white/20 bg-white/5'
          }`}
        >
          <Text className="text-white text-xl" style={{ fontFamily: fonts.poppins.bold }}>
            {char}
          </Text>
        </Animated.View>
      );
    }
    return boxes;
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Loading Modal */}
      <Modal transparent visible={loading || isSuccessDelay} animationType="fade" onRequestClose={() => {}}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <Animated.View entering={FadeIn} className="items-center">
            <LottieAnimation
              source={loadingspinner}
              style={{ width: 220, height: 220 }}
              autoPlay={true}
              loop={true}
            />
          </Animated.View>
        </View>
      </Modal>
      
      {/* Premium Background */}
      <Animated.Image 
        source={images.ajrakBg} 
        className="absolute inset-0 w-full h-full opacity-60"
        style={[animatedBgStyle]} 
        resizeMode="cover"
      />
      <LinearGradient 
        colors={['rgba(0,0,0,0.3)', 'rgba(20,0,0,0.8)', 'black']} 
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
            
            {/* Header Area */}
            <View className="mt-8 mb-12 items-center">
              <Animated.View entering={FadeInUp.delay(300).springify()} className="mb-4">
                 <Text className="text-[52px] text-white tracking-[4px]" style={{ fontFamily: fonts.bebasNeue.bold, textShadowColor: '#C41E3A', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 15 }}>
                   SindhHunar
                 </Text>
              </Animated.View>
              
              <Animated.Text 
                entering={FadeInDown.delay(400)}
                className="text-white text-4xl text-center" 
                style={{ fontFamily: fonts.bebasNeue.bold, letterSpacing: 1 }}
              >
                SECURITY VERIFICATION
              </Animated.Text>
              
              <Animated.Text 
                entering={FadeInDown.delay(500)}
                className="text-white/60 text-center mt-3 text-[15px]" 
                style={{ fontFamily: fonts.poppins.regular }}
              >
                We've sent a unique 6-digit code to your registered email address
              </Animated.Text>
              
              <Animated.View 
                entering={FadeInDown.delay(600)}
                className="bg-white/10 px-4 py-2 rounded-full mt-4 border border-white/10"
              >
                <Text className="text-[#C5A059]" style={{ fontFamily: fonts.poppins.medium }}>
                  {email}
                </Text>
              </Animated.View>
            </View>

            {/* OTP Input Card */}
            <Animated.View 
              entering={FadeInDown.delay(700).springify()} 
              className="rounded-[40px] overflow-hidden border border-white/15 shadow-2xl bg-black/60"
            >
              <Image source={images.cardbg} style={[StyleSheet.absoluteFillObject, { opacity: 0.1 }]} />
              
              <View className="p-8 items-center">
                <Text className="text-white/40 mb-6 text-[12px] uppercase tracking-widest" style={{ fontFamily: fonts.poppins.bold }}>
                  Enter Verification Code
                </Text>

                {/* Hidden Real Input */}
                <TextInput
                  ref={inputRef}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
                  autoFocus={true}
                />

                {/* Custom Box Inputs */}
                <TouchableOpacity 
                  activeOpacity={1} 
                  onPress={() => inputRef.current?.focus()}
                  className="flex-row justify-center gap-3 w-full mb-8"
                >
                  {renderOtpBoxes()}
                </TouchableOpacity>

                <View className="w-full flex-row justify-between items-center px-2">
                  <View className="flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-2 ${timer > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <Text className="text-white/50 text-[13px]" style={{ fontFamily: fonts.poppins.medium }}>
                      {timer > 0 ? `Expires in ${timer}s` : 'Code expired'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity disabled={timer > 0} onPress={handleResend}>
                    <Text 
                      className={`text-[14px] ${timer > 0 ? 'text-white/20' : 'text-[#C5A059]'}`} 
                      style={{ fontFamily: fonts.poppins.bold, textDecorationLine: timer > 0 ? 'none' : 'underline' }}
                    >
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                </View>

                <Button 
                  mode="contained"
                  onPress={handleVerify}
                  loading={loading}
                  disabled={loading}
                  contentStyle={{ height: 60 }}
                  className="w-full mt-10 rounded-2xl shadow-lg"
                  buttonColor={COLORS.primary}
                  labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 17, letterSpacing: 1 }}
                >
                  VERIFY & CONTINUE
                </Button>
                
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                  className="mt-6"
                >
                  <Text className="text-white/40 text-[14px]" style={{ fontFamily: fonts.poppins.medium }}>
                    Wrong email? <Text className="text-white">Go Back</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Cultural Pattern Footer */}
            <View className="mt-auto mb-4 items-center opacity-30">
               <Image 
                source={images.ajrakBg} 
                className="w-20 h-10" 
                resizeMode="contain" 
                style={{ tintColor: COLORS.secondary }}
               />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default VerifyOtpScreen;
