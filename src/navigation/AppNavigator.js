
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PasswordScreen from '../screens/registro/PasswordScreen';
import SubmitRegistrationScreen from '../screens/registro/SubmitRegistrationScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PersonalDataScreen from '../screens/registro/PersonalDataScreen';
import VehicleDataScreen from '../screens/registro/VehicleDataScreen';
import DocumentsDataScreen from '../screens/registro/DocumentsDataScreen';
import RegistrationSuccessScreen from '../screens/registro/RegistrationSuccessScreen';
import ActiveTripScreen from '../screens/ActiveTripScreen';
import useAuth from '../hooks/useAuth';
import { colors } from '../theme';
import { t } from '../i18n';
import DriverProfileScreen from '../screens/DriverProfileScreen';

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
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: t.home.title,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />

          <Stack.Screen
            name="ActiveTrip"
            component={ActiveTripScreen}
            options={{
              title: 'Viaje de prueba',
            }}
          />
          <Stack.Screen
            name="DriverProfile"
            component={DriverProfileScreen}
            options={{
              title: 'Perfil',
              headerBackTitle: 'volver',
            }}
          />

        </>
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
            options={{ title: 'Datos personales' }}
          />

          <Stack.Screen
            name="VehicleData"
            component={VehicleDataScreen}
            options={{ title: 'Datos del vehículo' }}
          />

          <Stack.Screen
            name="DocumentsData"
            component={DocumentsDataScreen}
            options={{ title: 'Documentos y pagos' }}
          />

          <Stack.Screen
            name="Password"
            component={PasswordScreen}
            options={{ title: 'Crear contraseña' }}
          />

          <Stack.Screen
            name="SubmitRegistration"
            component={SubmitRegistrationScreen}
            options={{ title: 'Enviar registro' }}
          />

          <Stack.Screen
            name="RegistrationSuccess"
            component={RegistrationSuccessScreen}
            options={{
              title: 'Registro completado',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
