import { useEffect } from 'react';
import { testFirebase } from './src/config/FirebaseTest';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './src/context/AuthContext';
import { RegistrationProvider } from './src/context/RegistrationContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    testFirebase();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RegistrationProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </RegistrationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}