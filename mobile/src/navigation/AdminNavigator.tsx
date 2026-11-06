import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../screens/admin/AdminDashboard';

export type AdminStackParamList = {
  AdminDashboard: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    </Stack.Navigator>
  );
};
