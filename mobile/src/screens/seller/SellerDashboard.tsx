import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';
import { fonts } from '../../utils/fonts';
import { Card as PaperCard, Button as PaperButton, List, Portal, Modal } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SellerStackParamList } from '../../navigation/SellerNavigator';
import { supabase } from '../../services/supabase/client';

export const SellerDashboard: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const navigation = useNavigation<NativeStackNavigationProp<SellerStackParamList>>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const confirmLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // handled inside authStore
    } finally {
      setLogoutModalVisible(false);
    }
  };

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    rating: 4.8, // Mocked until reviews are implemented
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        // 1. First fetch the artisan record for this user
        const { data: artisanData, error: artisanError } = await supabase
          .from('artisans')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (artisanError || !artisanData) {
          console.error('Artisan profile not found for stats');
          setStatsLoading(false);
          return;
        }

        const artisanId = artisanData.id;

        // 2. Fetch products count using correct artisanId
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('artisan_id', artisanId);

        // 3. Fetch orders and revenue using correct artisanId and column name
        const { data: orders } = await supabase
          .from('orders')
          .select('id, total_amount, items')
          .eq('artisan_id', artisanId);

        // Calculate revenue by summing items price (excluding the 150 Rs delivery fee)
        const revenue = orders?.reduce((acc, order) => {
          const itemsSubtotal = (order.items as any[])?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
          return acc + itemsSubtotal;
        }, 0) || 0;

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue: revenue,
          rating: 4.8,
        });
      } catch (error) {
        console.error('Error fetching seller stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const StatCard = ({ title, value, subtitle, loading }: { title: string; value: string; subtitle: string; loading: boolean }) => (
    <PaperCard className="flex-1 items-center p-4 bg-white rounded-2xl elevation-2 shadow-sm">
      <Text className="text-[14px] text-gray-500 mb-2" style={{ fontFamily: fonts.poppins.medium }}>{title}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#800000" className="my-1" />
      ) : (
        <Text className="text-[24px] text-[#800000]" style={{ fontFamily: fonts.poppins.bold }}>{value}</Text>
      )}
      <Text className="text-[12px] text-gray-400" style={{ fontFamily: fonts.poppins.regular }}>{subtitle}</Text>
    </PaperCard>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Seller Dashboard"
        showMenu={true}
        onMenuPress={() => {}}
      />
      
      <ScrollView className="flex-1 px-4">
        <View className="bg-white p-6 rounded-3xl mb-6 shadow-sm elevation-1 mt-4 items-center">
          <View className="w-[85px] h-[85px] rounded-full overflow-hidden bg-gray-100 border-2 border-[#C5A059]/30 mb-4">
            {profile?.avatar_url ? (
              <Image 
                source={{ uri: profile.avatar_url }} 
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 justify-center items-center bg-[#800000]/5">
                <Icon name="person" size={45} color="#800000" />
              </View>
            )}
          </View>

          <View className="items-center">
            <Text className="text-[14px] text-gray-500" style={{ fontFamily: fonts.poppins.regular }}>Welcome back,</Text>
            {isProfileLoading ? (
              <ActivityIndicator size="small" color="#1A1A1A" style={{ marginVertical: 4 }} />
            ) : (
              <Text className="text-[24px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>
                {profile?.name || 'Artisan'}
              </Text>
            )}
            <View className="flex-row items-center gap-2 mt-2">
              <Text className="text-[16px] text-[#C5A059]" style={{ fontFamily: fonts.poppins.bold }}>⭐ {stats.rating.toFixed(1)}</Text>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 text-[12px]" style={{ fontFamily: fonts.poppins.bold }}>Verified Seller</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-[20px] text-[#1A1A1A] mb-4 tracking-tight" style={{ fontFamily: fonts.poppins.bold }}>Your Stats</Text>
          <View className="flex-row gap-3">
            <StatCard
              title="Products"
              value={stats.totalProducts.toString()}
              subtitle="Total listed"
              loading={statsLoading}
            />
            <StatCard
              title="Orders"
              value={stats.totalOrders.toString()}
              subtitle="This month"
              loading={statsLoading}
            />
            <StatCard
              title="Revenue"
              value={`Rs ${stats.totalRevenue.toFixed(0)}`}
              subtitle="This month"
              loading={statsLoading}
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-[20px] text-[#1A1A1A] mb-4 tracking-tight" style={{ fontFamily: fonts.poppins.bold }}>Quick Actions</Text>
          
          <PaperButton
            mode="contained"
            onPress={() => navigation.navigate('AddProduct')}
            className="mb-3 rounded-2xl py-1"
            buttonColor="#800000"
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16 }}
            icon="plus"
          >
            Add New Product
          </PaperButton>
          
          <PaperButton
            mode="contained-tonal"
            onPress={() => navigation.navigate('ViewOrders')}
            className="mb-3 rounded-2xl py-1"
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16 }}
            icon="receipt"
          >
            View Orders
          </PaperButton>
          
          <PaperButton
            mode="outlined"
            onPress={() => console.log('Manage Products')}
            className="mb-3 rounded-2xl py-1"
            textColor="#800000"
            style={{ borderColor: '#800000' }}
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16 }}
            icon="package-variant"
          >
            Manage Products
          </PaperButton>
        </View>

        <View className="mb-5">
          <Text className="text-[20px] text-[#1A1A1A] mb-4 tracking-tight" style={{ fontFamily: fonts.poppins.bold }}>Settings</Text>
          
          <List.Item
            title="Edit Profile"
            onPress={() => navigation.navigate('PersonalInfo')}
            className="bg-white rounded-2xl mb-2 elevation-1 shadow-sm"
            titleStyle={{ fontFamily: fonts.poppins.medium, fontSize: 16, color: '#333' }}
            left={props => <List.Icon {...props} icon="account-edit-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <List.Item
            title="Logout"
            onPress={() => setLogoutModalVisible(true)}
            className="bg-white rounded-2xl mb-2 elevation-1 shadow-sm"
            titleStyle={{ fontFamily: fonts.poppins.bold, fontSize: 16, color: '#800000' }}
            left={props => <List.Icon {...props} icon="logout" color="#800000" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </View>
      </ScrollView>

      {/* ── Logout Confirmation Modal ── */}
      <Portal>
        <Modal
          visible={logoutModalVisible}
          onDismiss={() => setLogoutModalVisible(false)}
          contentContainerStyle={styles.logoutModal}
        >
          <View style={styles.logoutIconCircle}>
            <Icon name="log-out-outline" size={32} color="#FF3B30" />
          </View>

          <Text style={styles.logoutTitle}>Logging Out?</Text>
          <Text style={styles.logoutSubtitle}>
            Are you sure you want to leave the Seller Dashboard?
          </Text>

          <TouchableOpacity
            style={styles.logoutConfirmBtn}
            onPress={confirmLogout}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon name="log-out-outline" size={18} color="#fff" />
                <Text style={styles.logoutConfirmText}>Yes, Logout</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutCancelBtn}
            onPress={() => setLogoutModalVisible(false)}
          >
            <Text style={styles.logoutCancelText}>Cancel</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoutModal: {
    backgroundColor: '#FFFFFF',
    margin: 28,
    padding: 28,
    borderRadius: 28,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  logoutIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF1F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  logoutConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
    marginBottom: 10,
  },
  logoutConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutCancelBtn: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  logoutCancelText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SellerDashboard;
