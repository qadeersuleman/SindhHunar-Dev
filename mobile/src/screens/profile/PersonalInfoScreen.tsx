import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { fonts } from '../../utils/fonts';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { useProfile, useSaveProfile } from '../../hooks/useProfile';
import { TextInput as PaperInput, Button as PaperButton, IconButton, Portal, Modal as PaperModal } from 'react-native-paper';

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
};



const PersonalInfoScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const scrollY = useSharedValue(0);
  const [showPicker, setShowPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const { data: profile, isLoading } = useProfile(user?.id);
  const { mutateAsync: saveProfile, isPending: isSaving } = useSaveProfile();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | undefined>();
  const [displayAvatar, setDisplayAvatar] = useState('');

  const [hasInitialized, setHasInitialized] = useState(false);
  const lastProcessedUri = React.useRef<string | undefined>(undefined);

  // Consolidated initialization logic
  useEffect(() => {
    console.log('PersonalInfoScreen: Initialization check', { hasInitialized, hasProfile: !!profile, hasParams: !!route.params });
    
    if (hasInitialized) return;

    // Priority 1: Check route params (returning from camera)
    if (route.params && (route.params.name !== undefined || route.params.avatarUri || route.params.displayAvatar)) {
      console.log('PersonalInfoScreen: Initializing from route.params');
      const { 
        avatarUri, 
        name: retName, 
        phone: retPhone, 
        birthDate: retBirthDate, 
        gender: retGender,
        displayAvatar: retDisplay,
        localAvatarUri: retLocal
      } = route.params;
      
      if (avatarUri && avatarUri !== lastProcessedUri.current) {
        lastProcessedUri.current = avatarUri;
        setLocalAvatarUri(avatarUri);
        setDisplayAvatar(avatarUri);
      } else if (retDisplay) {
        setDisplayAvatar(retDisplay);
        if (retLocal) setLocalAvatarUri(retLocal);
      }

      if (retName !== undefined) setName(retName);
      if (retPhone !== undefined) setPhone(retPhone);
      if (retBirthDate !== undefined) setBirthDate(retBirthDate);
      if (retGender !== undefined) setGender(retGender);

      setHasInitialized(true);
      return;
    }

    // Priority 2: Initialize from profile (initial load)
    if (profile) {
      console.log('PersonalInfoScreen: Initializing from profile data');
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setBirthDate(profile.birthdate || '');
      setGender(profile.gender || '');
      setDisplayAvatar(profile.avatar_url || '');
      setHasInitialized(true);
    }
  }, [profile, route.params, hasInitialized]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    const h = interpolate(scrollY.value, [0, 100], [120, 80], 'clamp');
    return { height: h };
  });

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      await saveProfile({
        id: user.id,
        profile: {
          email: user.email, // Added to fix NOT NULL constraint error
          name: name || user.name || user.email?.split('@')[0] || 'User',
          phone: phone || null,
          birthdate: birthDate || null,
          gender: gender || null,
          avatar_url: displayAvatar || null,
        },
        localAvatarUri,
      });
      showToast({ message: 'Profile saved successfully!', type: 'success' });
      const targetScreen = profile?.role === 'admin' ? 'AdminMain' : profile?.role === 'artisan' ? 'SellerMain' : 'Main';
      navigation.navigate(targetScreen);
    } catch (e: any) {
      console.error('Save Profile Error Details:', JSON.stringify(e, null, 2));
      showToast({ message: e.message || e.details || 'Could not save profile.', type: 'error' });
    }
  };

  const handleGallery = async () => {
    setShowPicker(false);
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets?.[0]?.uri) {
      setLocalAvatarUri(result.assets[0].uri);
      setDisplayAvatar(result.assets[0].uri);
    }
  };

  const handleCamera = () => {
    setShowPicker(false);
    console.log('PersonalInfoScreen: Navigating to Camera with existing data:', { name, phone, birthDate, gender });
    // Pass current form data to Camera screen so it can be returned
    navigation.navigate('Camera', {
      existingData: { name, phone, birthDate, gender, displayAvatar, localAvatarUri }
    });
  };

  // Only show full loading if we have no profile data yet and no initialized state
  if (isLoading && !hasInitialized && !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF9F6] gap-4">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="text-[#757575]" style={{ fontFamily: fonts.poppins.medium }}>Loading your profile...</Text>
      </View>
    );
  }

  const displayName = name || user?.name || user?.email?.split('@')[0] || '';

  return (
    <View className="flex-1 bg-[#FAF9F6]">
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />

      {/* Dynamic Header */}
      <Animated.View className="absolute top-0 left-0 right-0 z-[100] justify-end" style={[headerStyle]}>
        <LinearGradient colors={[COLORS.primary, '#A00000']} style={StyleSheet.absoluteFill} />
        <View className="flex-row items-center justify-between px-5 pb-5">
          <IconButton
            icon="chevron-left"
            iconColor="white"
            size={24}
            onPress={() => navigation.goBack()}
            className="bg-white/20 rounded-xl"
          />
          <Text className="text-white text-[22px] tracking-wider" style={{ fontFamily: fonts.bebasNeue.bold }}>
            Personal Profile
          </Text>
          <PaperButton 
            mode="contained" 
            onPress={handleSave} 
            loading={isSaving}
            disabled={isSaving}
            buttonColor={COLORS.secondary}
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 12 }}
            className="rounded-xl min-w-[70px]"
          >
            Save
          </PaperButton>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 130, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View className="items-center mb-8">
          <Animated.View entering={FadeInDown.duration(600)} className="w-[120px] h-[120px] rounded-full p-1 border-2 border-[#C5A059] border-dashed mb-4 relative">
            {displayAvatar ? (
              <Image key={displayAvatar} source={{ uri: displayAvatar }} className="flex-1 rounded-full" />
            ) : (
              <View className="flex-1 rounded-full bg-[#800000]/5 justify-center items-center">
                <Icon name="person" size={50} color={COLORS.secondary} />
              </View>
            )}
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-[#800000] w-9 h-9 rounded-full justify-center items-center border-[3px] border-[#FAF9F6]"
              onPress={() => setShowPicker(true)}
            >
              <Icon name="camera" size={18} color="white" />
            </TouchableOpacity>
          </Animated.View>

          <Text className="text-[26px] text-[#1A1A1A] tracking-tight" style={{ fontFamily: fonts.bebasNeue.bold }}>
            {displayName ? `Hi, ${displayName}!` : 'Update Your Profile'}
          </Text>
          <Text className="text-[13px] text-[#757575] mt-1" style={{ fontFamily: fonts.poppins.regular }}>
            Manage your personal data here
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 gap-5">
          <PaperInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            activeOutlineColor={COLORS.primary}
            outlineColor="#E5E7EB"
            style={{ backgroundColor: 'white', height: 56, fontFamily: fonts.poppins.regular }}
            left={<PaperInput.Icon icon="account-outline" color={COLORS.primary} />}
            theme={{ roundness: 16, colors: { background: 'white' } }}
          />

          <PaperInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            activeOutlineColor={COLORS.primary}
            outlineColor="#E5E7EB"
            style={{ backgroundColor: 'white', height: 56, fontFamily: fonts.poppins.regular }}
            left={<PaperInput.Icon icon="phone-outline" color={COLORS.primary} />}
            theme={{ roundness: 16, colors: { background: 'white' } }}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={1}>
            <PaperInput
              label="Birth Date"
              value={birthDate}
              editable={false}
              mode="outlined"
              activeOutlineColor={COLORS.primary}
              outlineColor="#E5E7EB"
              style={{ backgroundColor: 'white', height: 56, fontFamily: fonts.poppins.regular }}
              left={<PaperInput.Icon icon="calendar-outline" color={COLORS.primary} />}
              right={<PaperInput.Icon icon="chevron-down" />}
              theme={{ roundness: 16, colors: { background: 'white' } }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowGenderPicker(true)} activeOpacity={1}>
            <PaperInput
              label="Gender"
              value={gender}
              editable={false}
              mode="outlined"
              activeOutlineColor={COLORS.primary}
              outlineColor="#E5E7EB"
              style={{ backgroundColor: 'white', height: 56, fontFamily: fonts.poppins.regular }}
              left={<PaperInput.Icon icon="gender-male-female" color={COLORS.primary} />}
              right={<PaperInput.Icon icon="chevron-down" />}
              theme={{ roundness: 16, colors: { background: 'white' } }}
            />
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.delay(600)} className="mt-2">
            <Text className="text-[18px] text-[#757575] mb-4 tracking-wider uppercase" style={{ fontFamily: fonts.bebasNeue.bold }}>
              Security Settings
            </Text>
            <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm elevation-1">
              <View className="w-9 h-9 rounded-xl bg-[#C5A059]/10 justify-center items-center">
                <Icon name="lock-closed-outline" size={20} color={COLORS.secondary} />
              </View>
              <Text className="flex-1 text-[14px] text-[#1A1A1A] ml-3" style={{ fontFamily: fonts.poppins.bold }}>
                Change Password
              </Text>
              <Icon name="chevron-forward" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View className="h-10" />
      </Animated.ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={birthDate ? new Date(birthDate) : new Date(2000, 0, 1)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event: any, selected?: Date) => {
            if (event.type === 'set' || event.type === 'dismissed') {
              setShowDatePicker(false);
            }
            if (event.type === 'set' && selected) {
              const formatted = selected.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              });
              setBirthDate(formatted);
            }
          }}
        />
      )}

      {/* Image Picker Modal */}
      <Portal>
        <PaperModal visible={showPicker} onDismiss={() => setShowPicker(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, position: 'absolute', bottom: 0, width: '100%' }}>
          <View className="items-center mb-6">
            <View className="w-10 h-1 bg-gray-200 rounded-full mb-4" />
            <Text className="text-[20px] text-[#1A1A1A] tracking-wider" style={{ fontFamily: fonts.bebasNeue.bold }}>Update Profile Photo</Text>
          </View>

          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100" onPress={handleCamera}>
            <View className="w-12 h-12 rounded-2xl bg-[#800000]/10 justify-center items-center mr-4">
              <Icon name="camera" size={24} color={COLORS.primary} />
            </View>
            <Text className="text-[16px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>Take a Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100" onPress={handleGallery}>
            <View className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 justify-center items-center mr-4">
              <Icon name="image" size={24} color={COLORS.secondary} />
            </View>
            <Text className="text-[16px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4" onPress={() => setShowPicker(false)}>
            <View className="w-12 h-12 rounded-2xl bg-gray-100 justify-center items-center mr-4">
              <Icon name="close" size={24} color={COLORS.gray} />
            </View>
            <Text className="text-[16px] text-[#757575]" style={{ fontFamily: fonts.poppins.bold }}>Cancel</Text>
          </TouchableOpacity>
        </PaperModal>
      </Portal>

      {/* Gender Picker Modal */}
      <Portal>
        <PaperModal visible={showGenderPicker} onDismiss={() => setShowGenderPicker(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, position: 'absolute', bottom: 0, width: '100%' }}>
          <View className="items-center mb-6">
            <View className="w-10 h-1 bg-gray-200 rounded-full mb-4" />
            <Text className="text-[20px] text-[#1A1A1A] tracking-wider" style={{ fontFamily: fonts.bebasNeue.bold }}>Select Gender</Text>
          </View>

          {['Male', 'Female'].map((item) => (
            <TouchableOpacity 
              key={item} 
              className="flex-row items-center py-4 border-b border-gray-100" 
              onPress={() => { setGender(item); setShowGenderPicker(false); }}
            >
              <View className={`w-12 h-12 rounded-2xl justify-center items-center mr-4 ${item === 'Male' ? 'bg-[#800000]/10' : 'bg-[#C5A059]/10'}`}>
                <Icon name={item.toLowerCase() as any} size={24} color={item === 'Male' ? COLORS.primary : COLORS.secondary} />
              </View>
              <Text className="flex-1 text-[16px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>{item}</Text>
              {gender === item && <Icon name="checkmark" size={24} color={item === 'Male' ? COLORS.primary : COLORS.secondary} />}
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="flex-row items-center py-4" onPress={() => setShowGenderPicker(false)}>
            <View className="w-12 h-12 rounded-2xl bg-gray-100 justify-center items-center mr-4">
              <Icon name="close" size={24} color={COLORS.gray} />
            </View>
            <Text className="text-[16px] text-[#757575]" style={{ fontFamily: fonts.poppins.bold }}>Cancel</Text>
          </TouchableOpacity>
        </PaperModal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  // NativeWind and Paper handle the styles
});

export default PersonalInfoScreen;
