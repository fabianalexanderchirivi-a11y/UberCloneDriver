import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.logo}>UBER</Text>
        <Text style={styles.title}>¡Bienvenido, conductor!</Text>
        <Text style={styles.description}>
          Aquí encontrarás tu espacio de trabajo.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 35,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  description: {
    color: '#BBBBBB',
    fontSize: 16,
    marginTop: 12,
  },
});
