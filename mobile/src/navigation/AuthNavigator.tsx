import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import VerifyOtpScreen from '../screens/auth/VerifyOtpScreen';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  VerifyOtp: { email: string; type?: 'magiclink' | 'signup' | 'recovery' | 'email_change' };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
