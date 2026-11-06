import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Avatar, List, Switch as PaperSwitch, Divider, Portal, Dialog, Button } from 'react-native-paper';
import { fonts } from '../../utils/fonts';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { useProfile } from '../../hooks/useProfile';
import { useMyOrders } from '../../hooks/useOrders';
import PremiumHeader from '../../components/PremiumHeader';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  cream: '#FAF9F6',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
  error: '#E74C3C',
};

const ProfileScreen: React.FC = () => {
  const { logout, user } = useAuth();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const isRTL = i18n.language === 'sd';
  const navigation = useNavigation<any>();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: orders, isLoading: isOrdersLoading } = useMyOrders(user?.id || '');

  const displayName = profile?.name || user?.name || user?.email?.split('@')[0] || 'Sindh Hunar';
  const avatarUrl = profile?.avatar_url;
  const userRole = profile?.role || 'customer';

  const HeaderContent = () => (
    <View style={[styles.headerUserInfo, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Animated.View entering={FadeInDown.springify()} style={styles.avatarGlow}>
        {isProfileLoading ? (
          <View style={styles.avatarPlaceholder}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : avatarUrl ? (
          <Avatar.Image size={60} source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Avatar.Icon size={60} icon="account" color={COLORS.secondary} style={styles.avatarIcon} />
        )}

      </Animated.View>
      
      <View style={[styles.headerTextInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={styles.headerDisplayName}>{displayName}</Text>
        <View style={[styles.headerRoleBadge, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Icon name={userRole === 'artisan' ? "star" : "checkmark-circle"} size={12} color="white" />
          <Text style={styles.headerRoleText}>
            {userRole.toUpperCase()} {userRole === 'customer' ? 'MEMBER' : ''}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => navigation.navigate('PersonalInfo')}
        style={styles.headerEditBtn}
      >
        <Icon name="settings-outline" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <PremiumHeader 
      headerContent={<HeaderContent />}
      height={160}
      overlap={30}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        
        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsRow}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <Text style={styles.statValue}>{isOrdersLoading ? '...' : orders?.length || 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>25</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.menuBox}>
              <List.Item
                title="Personal Information"
                description="Update your profile details"
                left={props => <List.Icon {...props} icon="account-outline" color={COLORS.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate('PersonalInfo')}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDesc}
              />
              <Divider />
              <List.Item
                title="Shipping Addresses"
                description="Ghotki, Sindh"
                left={props => <List.Icon {...props} icon="map-marker-outline" color={COLORS.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDesc}
              />
              <Divider />
              <List.Item
                title="Payment Methods"
                description="Visa, JazzCash"
                left={props => <List.Icon {...props} icon="credit-card-outline" color={COLORS.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDesc}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.menuBox}>
              <List.Item
                title="Notifications"
                description="Order updates and offers"
                left={props => <List.Icon {...props} icon="bell-outline" color={COLORS.primary} />}
                right={() => <PaperSwitch value={true} color={COLORS.primary} />}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDesc}
              />
              <Divider />
              <List.Item
                title="App Language"
                description="Sindhi / Urdu / English"
                left={props => <List.Icon {...props} icon="translate" color={COLORS.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDesc}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.footerMenu}>
            <List.Item
              title="Support Center"
              left={props => <List.Icon {...props} icon="help-circle-outline" color={COLORS.primary} />}
              onPress={() => {}}
              titleStyle={styles.menuTitle}
            />
            <Divider />
            <List.Item
              title="Logout"
              left={props => <List.Icon {...props} icon="logout" color={COLORS.error} />}
              onPress={() => setShowLogoutDialog(true)}
              titleStyle={[styles.menuTitle, { color: COLORS.error }]}
            />
          </Animated.View>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>SindhHunar v1.0.2</Text>
          <Text style={styles.madeWithText}>Made with ❤️ in Sindh</Text>
        </View>
      </ScrollView>

      {/* Logout Dialog */}
      <Portal>
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)} style={styles.dialog}>
          <Dialog.Icon icon="logout" color={COLORS.primary} size={40} />
          <Dialog.Title style={styles.dialogTitle}>{t('common.logoutTitle')}</Dialog.Title>
          <Dialog.Content>
            {isLoggingOut ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={COLORS.primary} size="large" />
                <Text style={styles.loadingText}>Logging out...</Text>
              </View>
            ) : (
              <Text style={styles.dialogContent}>{t('common.logoutConfirm')}</Text>
            )}
          </Dialog.Content>
          <Dialog.Actions style={[styles.dialogActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Button 
              onPress={() => setShowLogoutDialog(false)}
              mode="text"
              textColor="#757575"
              disabled={isLoggingOut}
              labelStyle={styles.btnLabel}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onPress={async () => {
                setIsLoggingOut(true);
                try {
                  await logout();
                  showToast({ message: t('common.logoutSuccess'), type: 'info' });
                } catch (error) {
                  console.error('Logout error:', error);
                } finally {
                  setIsLoggingOut(false);
                  setShowLogoutDialog(false);
                }
              }}
              mode="contained"
              buttonColor={COLORS.primary}
              loading={isLoggingOut}
              disabled={isLoggingOut}
              labelStyle={styles.btnLabel}
            >
              {t('common.yes')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PremiumHeader>
  );
};

const styles = StyleSheet.create({
  headerUserInfo: {
    alignItems: 'center',
    paddingTop: 5,
  },
  avatarGlow: {
    padding: 2,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  avatarImage: {
    backgroundColor: 'transparent',
  },
  avatarIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerDisplayName: {
    fontSize: 24,
    fontFamily: fonts.bebasNeue.bold,
    color: 'white',
    letterSpacing: 1.2,
  },

  headerRoleBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 2,
  },
  headerRoleText: {
    fontSize: 10,
    fontFamily: fonts.poppins.bold,
    color: 'white',
    marginLeft: 4,
  },
  headerEditBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 25,
    borderRadius: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 20,
    marginBottom: 25,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontFamily: fonts.bebasNeue.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: fonts.poppins.medium,
    color: COLORS.gray,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#F0F0F0',
    alignSelf: 'center',
  },
  menuContainer: {
    paddingHorizontal: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bebasNeue.bold,
    color: COLORS.gray,
    marginBottom: 8,
    marginLeft: 5,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  menuBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  menuTitle: {
    fontFamily: fonts.poppins.bold,
    fontSize: 13,
    color: COLORS.dark,
  },
  menuDesc: {
    fontFamily: fonts.poppins.regular,
    fontSize: 10,
    color: COLORS.gray,
  },
  footerMenu: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 30,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  versionText: {
    fontSize: 11,
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
  },
  madeWithText: {
    fontSize: 9,
    fontFamily: fonts.poppins.bold,
    color: 'rgba(128, 0, 0, 0.4)',
    marginTop: 2,
  },
  dialog: {
    borderRadius: 25,
    backgroundColor: 'white',
  },
  dialogTitle: {
    textAlign: 'center',
    fontFamily: fonts.bebasNeue.bold,
    fontSize: 24,
  },
  dialogContent: {
    textAlign: 'center',
    fontFamily: fonts.poppins.regular,
    color: COLORS.gray,
  },
  dialogActions: {
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  btnLabel: {
    fontFamily: fonts.poppins.bold,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: fonts.poppins.medium,
    color: COLORS.gray,
  },
});

export default ProfileScreen;
