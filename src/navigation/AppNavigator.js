
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import PersonalDataScreen from '../screens/registro/PersonalDataScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={PersonalDataScreen}
        options={{
          title: 'Registro del conductor',
          headerBackTitle: 'Volver',
        }}
      />
    </Stack.Navigator>
  );
}
