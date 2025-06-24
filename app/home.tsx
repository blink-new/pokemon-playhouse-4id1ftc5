import { View, StyleSheet, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Heart, Utensils, Sparkles, Gamepad2, Settings, Zap, Droplets } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { InteractivePokemon } from '@/components/InteractivePokemon';
import { FeedingMinigame } from '@/components/FeedingMinigame';
import { CustomizationMenu } from '@/components/CustomizationMenu';
import { PoolMinigame } from '@/components/PoolMinigame';

export default function Home() {
  const router = useRouter();
  const [pokemonStats, setPokemonStats] = useState({
    happiness: 80,
    hunger: 60,
    cleanliness: 90,
    energy: 70,
    fun: 50,
    name: 'Pikachu',
    color: '#FFCB05',
    accessory: 'none'
  });
  
  const [showFeedingGame, setShowFeedingGame] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showPoolGame, setShowPoolGame] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Auto-decrease stats over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPokemonStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        happiness: Math.max(0, prev.happiness - 0.5),
        cleanliness: Math.max(0, prev.cleanliness - 0.3),
        energy: Math.max(0, prev.energy - 0.5),
        fun: Math.max(0, prev.fun - 0.8)
      }));
    }, 30000); // Decrease every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePokemonTap = () => {
    setPokemonStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 5)
    }));
    setLastInteraction(Date.now());
  };

  const handleFeed = () => setShowFeedingGame(true);
  const handleClean = () => {
    setPokemonStats(prev => ({
      ...prev,
      cleanliness: 100,
      happiness: Math.min(100, prev.happiness + 10)
    }));
    Alert.alert('✨ Sparkling Clean!', 'Your Pokemon is now squeaky clean and happy!');
  };
  const handlePlay = () => {
    setPokemonStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.max(0, prev.energy - 10)
    }));
    Alert.alert('🎮 Playtime!', 'Your Pokemon had a great time playing!');
  };
  const handleRest = () => {
    setPokemonStats(prev => ({
      ...prev,
      energy: 100,
      happiness: Math.min(100, prev.happiness + 5)
    }));
    Alert.alert('😴 Sweet Dreams!', 'Your Pokemon is fully rested!');
  };

  const onFeedingComplete = (success: boolean) => {
    setShowFeedingGame(false);
    if (success) {
      setPokemonStats(prev => ({
        ...prev,
        hunger: 100,
        happiness: Math.min(100, prev.happiness + 20),
        energy: Math.min(100, prev.energy + 10)
      }));
    }
  };
  const onPoolGameComplete = (success: boolean) => {
    setShowPoolGame(false);
    if (success) {
      setPokemonStats(prev => ({
        ...prev,
        fun: 100,
        happiness: Math.min(100, prev.happiness + 25),
        energy: Math.max(0, prev.energy - 15)
      }));
    }
  };
  const onCustomizationComplete = (newStats: any) => {
    setShowCustomization(false);
    setPokemonStats(prev => ({
      ...prev,
      ...newStats
    }));
  };

  const getStatColor = (value: number) => {
    if (value > 70) return '#4CAF50';
    if (value > 40) return '#FF9800';
    return '#F44336';
  };
  const getOverallMood = () => {
    const avg = (pokemonStats.happiness + pokemonStats.hunger + pokemonStats.cleanliness + pokemonStats.energy + pokemonStats.fun) / 5;
    if (avg > 80) return { emoji: '😊', text: 'Very Happy', color: '#4CAF50' };
    if (avg > 60) return { emoji: '😐', text: 'Content', color: '#FF9800' };
    if (avg > 40) return { emoji: '😕', text: 'Unhappy', color: '#FF5722' };
    return { emoji: '😢', text: 'Very Sad', color: '#F44336' };
  };
  const mood = getOverallMood();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My {pokemonStats.name}</Text>
        <View style={styles.moodIndicator}>
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={[styles.moodText, { color: mood.color }]}>{mood.text}</Text>
        </View>
      </View>
      {/* Pokemon Display */}
      <View style={styles.pokemonContainer}>
        <InteractivePokemon 
          stats={pokemonStats}
          onTap={handlePokemonTap}
          lastInteraction={lastInteraction}
        />
      </View>
      {/* Stats Display */}
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Heart size={20} color={getStatColor(pokemonStats.happiness)} />
            <Text style={styles.statLabel}>Happy</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${pokemonStats.happiness}%`, backgroundColor: getStatColor(pokemonStats.happiness) }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(pokemonStats.happiness)}</Text>
          </View>
          <View style={styles.statItem}>
            <Utensils size={20} color={getStatColor(pokemonStats.hunger)} />
            <Text style={styles.statLabel}>Fed</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${pokemonStats.hunger}%`, backgroundColor: getStatColor(pokemonStats.hunger) }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(pokemonStats.hunger)}</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Sparkles size={20} color={getStatColor(pokemonStats.cleanliness)} />
            <Text style={styles.statLabel}>Clean</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${pokemonStats.cleanliness}%`, backgroundColor: getStatColor(pokemonStats.cleanliness) }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(pokemonStats.cleanliness)}</Text>
          </View>
          <View style={styles.statItem}>
            <Zap size={20} color={getStatColor(pokemonStats.energy)} />
            <Text style={styles.statLabel}>Energy</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${pokemonStats.energy}%`, backgroundColor: getStatColor(pokemonStats.energy) }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(pokemonStats.energy)}</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Gamepad2 size={20} color={getStatColor(pokemonStats.fun)} />
            <Text style={styles.statLabel}>Fun</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${pokemonStats.fun}%`, backgroundColor: getStatColor(pokemonStats.fun) }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(pokemonStats.fun)}</Text>
          </View>
        </View>
      </View>
      {/* Action Buttons */}
      <View style={styles.actionGrid}>
        <TouchableOpacity onPress={handleFeed} style={[styles.actionButton, styles.feedButton]}>
          <Utensils size={24} color="#FFF" />
          <Text style={styles.actionText}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClean} style={[styles.actionButton, styles.cleanButton]}>
          <Sparkles size={24} color="#FFF" />
          <Text style={styles.actionText}>Clean</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlay} style={[styles.actionButton, styles.playButton]}>
          <Gamepad2 size={24} color="#FFF" />
          <Text style={styles.actionText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPoolGame(true)} style={[styles.actionButton, styles.poolButton]}>
          <Droplets size={24} color="#FFF" />
          <Text style={styles.actionText}>Pool</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRest} style={[styles.actionButton, styles.restButton]}>
          <Zap size={24} color="#FFF" />
          <Text style={styles.actionText}>Rest</Text>
        </TouchableOpacity>
      </View>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setShowCustomization(true)} style={styles.navButton}>
          <Settings size={24} color="#666" />
          <Text style={styles.navText}>Customize</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/battle')} style={[styles.navButton, styles.battleButton]}>
          <Text style={styles.battleText}>⚔️ Battle</Text>
        </TouchableOpacity>
      </View>
      {/* Modals */}
      <Modal visible={showFeedingGame} animationType="slide" transparent>
        <FeedingMinigame onComplete={onFeedingComplete} />
      </Modal>
      <Modal visible={showPoolGame} animationType="slide" transparent>
        <PoolMinigame onComplete={onPoolGameComplete} />
      </Modal>
      <Modal visible={showCustomization} animationType="slide" transparent>
        <CustomizationMenu 
          currentStats={pokemonStats}
          onComplete={onCustomizationComplete}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  moodIndicator: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  pokemonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 6,
  },
  statBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedButton: {
    backgroundColor: '#FF6B6B',
  },
  cleanButton: {
    backgroundColor: '#4ECDC4',
  },
  playButton: {
    backgroundColor: '#45B7D1',
  },
  poolButton: {
    backgroundColor: '#2196F3',
  },
  restButton: {
    backgroundColor: '#96CEB4',
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
    gap: 12,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  battleButton: {
    backgroundColor: '#FFCB05',
  },
  battleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
