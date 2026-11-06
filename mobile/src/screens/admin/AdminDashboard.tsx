import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Searchbar, 
  Chip, 
  IconButton, 
  Portal, 
  Modal, 
  TextInput, 
  Button,
  Divider
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../utils/fonts';
import { getAllProfiles, updateUserRole, upsertArtisanRecord, deleteArtisanRecord } from '../../services/supabase/admin';
import { UserProfile } from '../../services/supabase/profile';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';

const COLORS = {
  admin: '#002366', // Royal Indigo
  artisan: '#800000', // Ajrak Red
  customer: '#C5A059', // Antique Gold
  background: '#FAF9F6',
  white: '#FFFFFF',
  gray: '#757575',
  lightGray: '#F0F0F0',
};

const AdminDashboard: React.FC = () => {
  const { logout, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => setLogoutModalVisible(true);

  const confirmLogout = async () => {
    try {
      await logout();
      // AppNavigator will handle redirect automatically
    } catch (e) {
      // logout error is handled inside authStore
    } finally {
      setLogoutModalVisible(false);
    }
  };

  // Modal State
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [artisanModalVisible, setArtisanModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Artisan Form State
  const [shopName, setShopName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    const { profiles, error } = await getAllProfiles();
    if (!error) {
      setProfiles(profiles);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfiles();
    setRefreshing(false);
  };

  const handleRoleChange = async (newRole: 'customer' | 'artisan' | 'admin') => {
    if (!selectedUser) return;

    if (newRole === 'artisan') {
      setRoleModalVisible(false);
      setArtisanModalVisible(true);
      return;
    }

    setIsUpdating(true);
    const { error } = await updateUserRole(selectedUser.id, newRole);
    
    // At this point newRole is already narrowed to 'customer' | 'admin'
    // (the 'artisan' case returned early above), so always clean up artisan record
    await deleteArtisanRecord(selectedUser.id);

    if (!error) {
      fetchProfiles();
    }
    setIsUpdating(false);
    setRoleModalVisible(false);
  };

  const handleArtisanSubmit = async () => {
    if (!selectedUser || !shopName || !specialty) return;

    setIsUpdating(true);
    try {
      const { error: roleError } = await updateUserRole(selectedUser.id, 'artisan');
      if (roleError) throw roleError;

      const { error: artisanError } = await upsertArtisanRecord({
        owner_id: selectedUser.id,
        shop_name: shopName,
        specialty: specialty.split(',').map(s => s.trim()),
        rating: 5,
        is_active: true
      });
      if (artisanError) throw artisanError;

      setArtisanModalVisible(false);
      setShopName('');
      setSpecialty('');
      fetchProfiles();
    } catch (error: any) {
      // silently fail or show in-line
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = ({ item }: { item: UserProfile }) => (
    <View className="bg-white mx-5 mb-4 p-4 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          {item.avatar_url ? (
            <Image source={{ uri: item.avatar_url }} className="w-full h-full" />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Icon name="person" size={24} color="#999" />
            </View>
          )}
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-[16px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>
            {item.name || 'No Name'}
          </Text>
          <Text className="text-[12px] text-gray-500" style={{ fontFamily: fonts.poppins.regular }}>
            {item.email}
          </Text>
        </View>
        <Chip 
          mode="flat" 
          className="rounded-lg"
          style={{ 
            backgroundColor: 
              item.role === 'admin' ? COLORS.admin + '20' : 
              item.role === 'artisan' ? COLORS.artisan + '20' : 
              COLORS.customer + '20'
          }}
          textStyle={{ 
            color: 
              item.role === 'admin' ? COLORS.admin : 
              item.role === 'artisan' ? COLORS.artisan : 
              COLORS.customer,
            fontSize: 10,
            fontFamily: fonts.poppins.bold
          }}
        >
          {item.role.toUpperCase()}
        </Chip>
        <IconButton 
          icon="ellipsis-vertical" 
          size={20} 
          onPress={() => {
            setSelectedUser(item);
            setRoleModalVisible(true);
          }} 
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FAF9F6]">
      <View className="flex-row items-center justify-between px-5 py-2 bg-white border-b border-gray-100">
        <Text className="text-[20px]" style={{ fontFamily: fonts.poppins.bold }}>Admin Panel</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <View className="px-5 py-4">
        <Searchbar
          placeholder="Search users..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ backgroundColor: 'white', elevation: 0, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' }}
          inputStyle={{ fontFamily: fonts.poppins.regular }}
        />
      </View>

      <View className="flex-row px-5 mb-4 justify-between items-center">
        <Text className="text-[18px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>
          Users ({filteredProfiles.length})
        </Text>
        <TouchableOpacity onPress={onRefresh}>
          <Icon name="refresh-outline" size={20} color={COLORS.admin} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.admin} />
        </View>
      ) : (
        <FlatList
          data={filteredProfiles}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Icon name="people-outline" size={60} color="#DDD" />
              <Text className="text-gray-400 mt-2">No users found</Text>
            </View>
          }
        />
      )}

      {/* Role Selection Modal */}
      <Portal>
        <Modal
          visible={roleModalVisible}
          onDismiss={() => setRoleModalVisible(false)}
          contentContainerStyle={{ backgroundColor: 'white', margin: 20, padding: 25, borderRadius: 24 }}
        >
          <Text className="text-[20px] mb-4 text-center" style={{ fontFamily: fonts.poppins.bold }}>
            Change User Role
          </Text>
          <Text className="text-[14px] text-gray-500 mb-6 text-center" style={{ fontFamily: fonts.poppins.regular }}>
            Select a new role for {selectedUser?.name}
          </Text>
          
          <View className="gap-3">
            <TouchableOpacity 
              onPress={() => handleRoleChange('customer')}
              className="flex-row items-center p-4 bg-gray-50 rounded-2xl"
            >
              <View className="w-10 h-10 rounded-full bg-yellow-100 justify-center items-center">
                <Icon name="person" size={20} color={COLORS.customer} />
              </View>
              <Text className="ml-4 text-[16px]" style={{ fontFamily: fonts.poppins.medium }}>Customer</Text>
              {selectedUser?.role === 'customer' && <Icon name="checkmark-circle" size={24} color={COLORS.customer} style={{ marginLeft: 'auto' }} />}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleRoleChange('artisan')}
              className="flex-row items-center p-4 bg-gray-50 rounded-2xl"
            >
              <View className="w-10 h-10 rounded-full bg-red-100 justify-center items-center">
                <Icon name="hammer" size={20} color={COLORS.artisan} />
              </View>
              <Text className="ml-4 text-[16px]" style={{ fontFamily: fonts.poppins.medium }}>Artisan (Seller)</Text>
              {selectedUser?.role === 'artisan' && <Icon name="checkmark-circle" size={24} color={COLORS.artisan} style={{ marginLeft: 'auto' }} />}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleRoleChange('admin')}
              className="flex-row items-center p-4 bg-gray-50 rounded-2xl"
            >
              <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center">
                <Icon name="shield-checkmark" size={20} color={COLORS.admin} />
              </View>
              <Text className="ml-4 text-[16px]" style={{ fontFamily: fonts.poppins.medium }}>Admin</Text>
              {selectedUser?.role === 'admin' && <Icon name="checkmark-circle" size={24} color={COLORS.admin} style={{ marginLeft: 'auto' }} />}
            </TouchableOpacity>
          </View>
          
          <Button 
            mode="text" 
            onPress={() => setRoleModalVisible(false)} 
            className="mt-4"
            textColor={COLORS.gray}
          >
            Cancel
          </Button>
        </Modal>

        {/* Artisan Details Modal */}
        <Modal
          visible={artisanModalVisible}
          onDismiss={() => setArtisanModalVisible(false)}
          contentContainerStyle={{ backgroundColor: 'white', margin: 20, padding: 25, borderRadius: 24 }}
        >
          <Text className="text-[20px] mb-2" style={{ fontFamily: fonts.poppins.bold }}>
            Artisan Details
          </Text>
          <Text className="text-[14px] text-gray-500 mb-6" style={{ fontFamily: fonts.poppins.regular }}>
            Setup artisan profile for {selectedUser?.name}
          </Text>

          <TextInput
            label="Shop Name"
            value={shopName}
            onChangeText={setShopName}
            mode="outlined"
            className="mb-4"
            outlineColor="#E5E7EB"
            activeOutlineColor={COLORS.artisan}
            theme={{ roundness: 12 }}
          />

          <TextInput
            label="Specialties (comma separated)"
            value={specialty}
            onChangeText={setSpecialty}
            mode="outlined"
            className="mb-6"
            placeholder="e.g. Ajrak, Rilli, Pottery"
            outlineColor="#E5E7EB"
            activeOutlineColor={COLORS.artisan}
            theme={{ roundness: 12 }}
          />

          <Button 
            mode="contained" 
            onPress={handleArtisanSubmit}
            loading={isUpdating}
            disabled={isUpdating}
            buttonColor={COLORS.artisan}
            className="rounded-xl py-1"
          >
            Promote to Artisan
          </Button>
          
          <Button 
            mode="text" 
            onPress={() => setArtisanModalVisible(false)} 
            className="mt-2"
            textColor={COLORS.gray}
          >
            Go Back
          </Button>
        </Modal>

        {/* ── Logout Confirmation Modal ── */}
        <Modal
          visible={logoutModalVisible}
          onDismiss={() => setLogoutModalVisible(false)}
          contentContainerStyle={styles.logoutModal}
        >
          {/* Icon circle */}
          <View style={styles.logoutIconCircle}>
            <Icon name="log-out-outline" size={32} color="#FF3B30" />
          </View>

          <Text style={styles.logoutTitle}>Logging Out?</Text>
          <Text style={styles.logoutSubtitle}>
            Are you sure you want to leave the Admin Panel?
          </Text>

          {/* Confirm button */}
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

          {/* Cancel button */}
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

export default AdminDashboard;
