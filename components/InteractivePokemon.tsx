import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSpring,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { Heart, Sparkles } from 'lucide-react-native';

interface InteractivePokemonProps {
  stats: {
    happiness: number;
    hunger: number;
    cleanliness: number;
    energy: number;
    fun: number;
    name: string;
    color: string;
    accessory: string;
  };
  onTap: () => void;
  lastInteraction: number;
}

export function InteractivePokemon({ stats, onTap, lastInteraction }: InteractivePokemonProps) {
  const bounceY = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  const heartScale = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);

  // Idle animation based on happiness
  useEffect(() => {
    const idleAnimation = () => {
      if (stats.happiness > 60 && stats.fun > 50) {
        // Happy & Fun bouncing
        bounceY.value = withRepeat(
          withSequence(
            withTiming(-15, { duration: 400 }),
            withTiming(0, { duration: 400 })
          ),
          -1,
          false
        );
      } else if (stats.happiness > 60) {
        // Happy bouncing
        bounceY.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 500 }),
            withTiming(0, { duration: 500 })
          ),
          -1,
          false
        );
      } else if (stats.happiness > 30) {
        // Gentle swaying
        rotateValue.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 1000 }),
            withTiming(5, { duration: 1000 }),
            withTiming(0, { duration: 1000 })
          ),
          -1,
          false
        );
      } else {
        // Tired/sad - minimal movement
        bounceY.value = withRepeat(
          withSequence(
            withTiming(-2, { duration: 2000 }),
            withTiming(0, { duration: 2000 })
          ),
          -1,
          false
        );
      }
    };

    idleAnimation();
  }, [stats.happiness, stats.fun]);

  // Energy-based movement speed
  useEffect(() => {
    if (stats.energy < 20) {
      // Slow down animations when tired
      bounceY.value = withTiming(0, { duration: 3000 });
      rotateValue.value = withTiming(0, { duration: 3000 });
    }
  }, [stats.energy]);

  const handleTap = () => {
    // Tap feedback animation
    scaleValue.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );

    // Show heart animation
    heartScale.value = withSequence(
      withTiming(1.5, { duration: 200 }),
      withTiming(0, { duration: 300 })
    );

    // Clean Pokemon gets sparkles
    if (stats.cleanliness > 80) {
      sparkleOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 800 })
      );
    }

    onTap();
  };

  const animatedPokemonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { scale: scaleValue.value },
      { rotate: `${rotateValue.value}deg` }
    ],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartScale.value,
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const getAccessoryComponent = () => {
    switch (stats.accessory) {
      case 'hat':
        return <View style={[styles.accessory, styles.hat, { backgroundColor: '#FF6B6B' }]} />;
      case 'bow':
        return <View style={[styles.accessory, styles.bow, { backgroundColor: '#FFB6C1' }]} />;
      case 'glasses':
        return <View style={[styles.accessory, styles.glasses]} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={handleTap}>
        <Animated.View style={[styles.pokemonContainer, animatedPokemonStyle]}>
          {/* Background glow based on happiness */}
          <View style={[
            styles.glow, 
            { 
              backgroundColor: stats.color,
              opacity: stats.happiness / 200 // More glow when happier
            }
          ]} />
          
          {/* Main Pokemon */}
          <View style={[styles.pokemon, { backgroundColor: stats.color }]}>
            <Image 
              source={require('@/assets/images/pikachu.png')} 
              style={styles.pokemonImage}
            />
            {getAccessoryComponent()}
          </View>

          {/* Status indicators */}
          {stats.hunger < 30 && (
            <View style={[styles.statusIndicator, styles.hungryIndicator]}>
              <Sparkles size={16} color="#FF6B6B" />
            </View>
          )}
          
          {stats.energy < 30 && (
            <View style={[styles.statusIndicator, styles.tiredIndicator]}>
              <Heart size={16} color="#FFA500" />
            </View>
          )}

          {/* Interaction feedback */}
          <Animated.View style={[styles.heartFeedback, heartAnimatedStyle]}>
            <Heart size={24} color="#FF69B4" />
          </Animated.View>

          <Animated.View style={[styles.sparkleFeedback, sparkleAnimatedStyle]}>
            <Sparkles size={20} color="#FFD700" />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  pokemonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    blur: 20,
  },
  pokemon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  accessory: {
    position: 'absolute',
  },
  hat: {
    top: -10,
    width: 60,
    height: 30,
    borderRadius: 15,
  },
  bow: {
    top: 10,
    right: -10,
    width: 30,
    height: 20,
    borderRadius: 10,
  },
  glasses: {
    top: 35,
    width: 50,
    height: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  statusIndicator: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hungryIndicator: {
    top: -10,
    left: -10,
  },
  tiredIndicator: {
    top: -10,
    right: -10,
  },
  heartFeedback: {
    position: 'absolute',
    top: -20,
  },
  sparkleFeedback: {
    position: 'absolute',
    top: -25,
    right: -25,
  },
});