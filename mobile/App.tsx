/**
 * Sindh Hunar - Celebrating Sindhi Artistry
 * A React Native marketplace for authentic Sindhi crafts and artisans
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './src/context/ToastContext';

import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/utils/colors';
import { PaperProvider } from 'react-native-paper';


import { Provider } from 'react-redux';
import { store, persistor } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator size="large" color={colors.primary} />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <PaperProvider>
                <AppContent />
              </PaperProvider>
            </ToastProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>

    </SafeAreaProvider>
  );
}


function AppContent() {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
