import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PersonalDataScreen from '../screens/registro/PersonalDataScreen';
const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
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

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
