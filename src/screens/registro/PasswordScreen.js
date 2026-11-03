import { useState } from 'react';
import {View,Text,StyleSheet,Alert} from 'react-native';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';

export default function PasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleContinue = () => {
    if (password.length < 6) {
      Alert.alert('Contraseña inválida', 'Debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Contraseñas diferentes', 'Las contraseñas no coinciden.');
      return;
    }

    navigation.navigate('SubmitRegistration', {
      password,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu contraseña</Text>

      <Text style={styles.description}>
        Utiliza una contraseña segura para proteger tu cuenta.
      </Text>

      <TextField
        label="Contraseña"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextField
        label="Confirmar contraseña"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button
        title="Continuar"
        onPress={handleContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
