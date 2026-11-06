import React, { useState, useEffect } from 'react';
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
  FadeIn,
} from 'react-native-reanimated';
import { images } from '../../utils/images';
import { fonts } from '../../utils/fonts';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import LottieAnimation from '../../components/LottieAnimation';
import welcomeAnimation from '../../assets/animations/welcome.json';
import loadingspinner from '../../assets/animations/loadingspinner.json';
import { TextInput as PaperInput, Button, HelperText } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#C41E3A', // Deep Red
  secondary: '#C5A059',
  white: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.12)',
};

const LoginScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const { sendOtp, loading, signInWithGoogle } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        showToast({ message: result.error.message, type: 'error' });
      } else {
        showToast({ message: 'Successfully logged in with Google!', type: 'success' });
      }
    } catch (err: any) {
      showToast({ message: 'Google sign in failed', type: 'error' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }
    try {
      // Sending OTP and navigating to Verify screen
      await sendOtp(email);
      setIsRedirecting(true);
      showToast({ message: 'Verification code sent!', type: 'success' });
      
      setTimeout(() => {
        setIsRedirecting(false);
        navigation.navigate('VerifyOtp', { email, type: 'magiclink' });
      }, 2000);
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to send verification code', type: 'error' });
    }
  };

  const floatAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatAnim.value, [0, 1], [0, -25]) },
      { scale: interpolate(floatAnim.value, [0, 1], [1, 1.08]) }
    ],
  }));


  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Loading Modal - Directly in render tree */}
      <Modal transparent visible={loading || isRedirecting} animationType="fade" onRequestClose={() => {}}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <Animated.View entering={FadeIn} className="items-center">
            <LottieAnimation
              source={loadingspinner}
              size={220}
              autoPlay={true}
              loop={true}
            />
          </Animated.View>
        </View>
      </Modal>
      
      {/* Background with Animation */}
      <Animated.Image 
        source={images.ajrakBg} 
        className="absolute inset-0 w-full h-full opacity-80"
        style={[animatedBgStyle]} 
        resizeMode="cover"
      />
      <LinearGradient 
        colors={['rgba(74, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.9)']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 25 }} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            
            {/* Header Area */}
            <Animated.View entering={FadeInUp.delay(200).springify()} className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-white/10 justify-center items-center border border-white/20 mb-4 overflow-hidden">
                <LottieAnimation
                  source={welcomeAnimation}
                  size={80}
                  autoPlay={true}
                  loop={true}
                />
                <View className="absolute inset-0 rounded-full border-2 border-[#C41E3A] opacity-30 scale-110" />
              </View>
              <Text className="text-[52px] text-white tracking-[4px]" style={{ fontFamily: fonts.bebasNeue.bold, textShadowColor: '#C41E3A', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 15 }}>
                SindhHunar
              </Text>
              <Text className="text-[14px] text-white/70 -mt-2" style={{ fontFamily: fonts.poppins.medium }}>
                {t('common.welcome')} ✨
              </Text>
            </Animated.View>
            
            {/* Glass Card */}
            <Animated.View entering={FadeInDown.delay(400).springify()} className="rounded-[35px] overflow-hidden bg-white/5 border border-white/15">
              <Image source={images.cardbg} style={StyleSheet.absoluteFillObject} />
              {Platform.OS === 'ios' ? (
                <BlurView style={StyleSheet.absoluteFillObject} blurType="dark" blurAmount={25} />
              ) : (
                <View className="absolute inset-0 bg-black/75" />
              )}
              
              <View className="px-4 py-8 z-10">
                <Text 
                  className={`text-[24px] text-white mb-6 ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{ fontFamily: fonts.poppins.bold }}
                >
                  {t('auth.welcomeBack')}
                </Text>
                
                
                <View className="gap-4">
                  <PaperInput
                    label={t('auth.email')}
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    outlineColor="rgba(255,255,255,0.3)"
                    activeOutlineColor={COLORS.primary}
                    textColor="white"
                    style={{ backgroundColor: '#111111', height: 56, fontFamily: fonts.poppins.regular, fontSize: 14 }}
                    left={<PaperInput.Icon icon="email-outline" color="rgba(255,255,255,0.7)" />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    theme={{ 
                      colors: { 
                        onSurfaceVariant: 'rgba(255,255,255,0.7)', 
                        background: '#111111' 
                      },
                      roundness: 16 
                    }}
                  />

                  <PaperInput
                    label={t('auth.password')}
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    outlineColor="rgba(255,255,255,0.3)"
                    activeOutlineColor={COLORS.primary}
                    textColor="white"
                    style={{ backgroundColor: '#111111', height: 56, fontFamily: fonts.poppins.regular, fontSize: 14 }}
                    secureTextEntry={secureText}
                    left={<PaperInput.Icon icon="lock-outline" color="rgba(255,255,255,0.7)" />}
                    right={<PaperInput.Icon icon={secureText ? "eye" : "eye-off"} onPress={() => setSecureText(!secureText)} color="rgba(255,255,255,0.7)" />}
                    theme={{ 
                      colors: { 
                        onSurfaceVariant: 'rgba(255,255,255,0.7)', 
                        background: '#111111' 
                      },
                      roundness: 16 
                    }}
                  />
                  
                  <TouchableOpacity className={`mt-1 ${isRTL ? 'self-start' : 'self-end'}`}>
                    <Text className="text-[#C41E3A] text-[13px]" style={{ fontFamily: fonts.poppins.medium }}>
                      {t('auth.forgot')}
                    </Text>
                  </TouchableOpacity>
                  
                  <Button 
                    mode="contained"
                    onPress={handleLogin}
                    disabled={loading}
                    contentStyle={{ height: 56 }}
                    className="mt-4 rounded-2xl overflow-hidden"
                    buttonColor={COLORS.primary}
                    labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16, letterSpacing: 1 }}
                  >
                    {!loading && t('auth.login')}
                  </Button>
                </View>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-white/10" />
                  <Text className="text-white/40 mx-4" style={{ fontFamily: fonts.poppins.medium }}>
                    OR
                  </Text>
                  <View className="flex-1 h-[1px] bg-white/10" />
                </View>

                {/* Google Button */}
                <Button 
                  mode="outlined"
                  icon="google"
                  loading={googleLoading}
                  disabled={loading || googleLoading}
                  onPress={handleGoogleLogin}
                  contentStyle={{ height: 56 }}
                  className="rounded-2xl w-full"
                  textColor="white"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }}
                  labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 15, letterSpacing: 0.5 }}
                >
                  Continue with Google
                </Button>
                
                <View className={`flex-row justify-center items-center mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Text className="text-white/60 text-[14px]" style={{ fontFamily: fonts.poppins.regular }}>
                    {t('auth.newHere')} 
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text className="text-[#C41E3A] text-[14px] ml-1" style={{ fontFamily: fonts.poppins.bold }}>
                      {t('auth.signup')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  // NativeWind and Paper handle the styles
});

export default LoginScreen;
