import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SellerDashboard from '../screens/seller/SellerDashboard';
import AddProductScreen from '../screens/seller/AddProductScreen';
import ArtisanOrdersScreen from '../screens/seller/ArtisanOrdersScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import CameraScreen from '../screens/profile/CameraScreen';

export type SellerStackParamList = {
  SellerDashboard: undefined;
  AddProduct: undefined;
  ManageProducts: undefined;
  ViewOrders: undefined;
  PersonalInfo: undefined;
  Camera: { onPhotoCaptured: (path: string) => void };
};

const Stack = createNativeStackNavigator<SellerStackParamList>();

export const SellerNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SellerDashboard" component={SellerDashboard} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="ViewOrders" component={ArtisanOrdersScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
};
