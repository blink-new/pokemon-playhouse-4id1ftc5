import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';

export default function TrainerSelection() {
  const router = useRouter();

  const selectTrainer = (trainerId: number) => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Trainer</Text>
      <View style={styles.trainerContainer}>
        <TouchableOpacity onPress={() => selectTrainer(1)} style={styles.trainerCard}>
          <View style={styles.trainerAvatar}>
            <User size={60} color="#3B4CCA" />
          </View>
          <Text style={styles.trainerName}>Ash</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => selectTrainer(2)} style={styles.trainerCard}>
          <View style={styles.trainerAvatar}>
            <User size={60} color="#FF6B6B" />
          </View>
          <Text style={styles.trainerName}>Misty</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  trainerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 20,
  },
  trainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    flex: 1,
  },
  trainerAvatar: {
    width: 100,
    height: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});