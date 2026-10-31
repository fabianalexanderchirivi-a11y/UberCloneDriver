import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PersonalDataScreen from '../screens/registro/PersonalDataScreen';

import useAuth from '../hooks/useAuth';
import { colors } from '../theme';
import { t } from '../i18n';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isSignedIn } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {isSignedIn ? (
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t.home.title,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Iniciar sesión' }}
          />

          <Stack.Screen
            name="Register"
            component={PersonalDataScreen}
            options={{ title: 'Registro del conductor' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}