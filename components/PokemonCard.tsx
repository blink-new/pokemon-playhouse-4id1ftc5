import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export function PokemonCard() {
  const router = useRouter();

  return (
    <Animated.View 
      style={styles.card}
      entering={FadeInDown.duration(400)}
    >
      <Image 
        source={require('@/assets/images/pikachu.png')}
        style={styles.image}
      />
      <Text style={styles.name}>Pikachu</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/battle')}
      >
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FFCB05',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#3B4CCA',
    fontSize: 16,
    fontWeight: '700',
  },
});