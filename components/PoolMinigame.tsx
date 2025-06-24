import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Droplets, X, Circle } from 'lucide-react-native';

interface PoolMinigameProps {
  onComplete: (success: boolean) => void;
}

interface Ring {
  id: number;
  x: number;
  y: Animated.Value;
  size: number;
  color: string;
  points: number;
}

const RING_COLORS = [
  { color: '#FF6B6B', points: 10 },
  { color: '#4ECDC4', points: 5 },
  { color: '#45B7D1', points: 15 },
];

export const PoolMinigame: React.FC<PoolMinigameProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [rings, setRings] = useState<Ring[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const pokemonBounce = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pokemonBounce, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pokemonBounce, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameEnded) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameEnded]);

  useEffect(() => {
    if (gameStarted && !gameEnded) {
      const spawnInterval = setInterval(() => spawnRing(), 1000);
      return () => clearInterval(spawnInterval);
    }
  }, [gameStarted, gameEnded]);

  const spawnRing = () => {
    const ringData = RING_COLORS[Math.floor(Math.random() * RING_COLORS.length)];
    const newRing: Ring = {
      id: Date.now() + Math.random(),
      x: Math.random() * 280 + 20,
      y: new Animated.Value(0),
      size: Math.random() * 30 + 40,
      ...ringData,
    };
    setRings(prev => [...prev, newRing]);

    Animated.timing(newRing.y, {
      toValue: 300, // Rings fall down
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setRings(prev => prev.filter(r => r.id !== newRing.id));
    });
  };

  const catchRing = (ringId: number, points: number) => {
    setRings(prev => prev.filter(r => r.id !== ringId));
    setScore(prev => prev + points);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(20);
    setRings([]);
    setGameEnded(false);
  };

  const endGame = useCallback(() => {
    setGameEnded(true);
    setGameStarted(false);
    const success = score >= 80;
    setTimeout(() => {
      onComplete(success);
      Alert.alert(success ? '🎉 Splash-tastic!' : '🐠 Good Swim!', `You scored ${score} points!`);
    }, 1000);
  }, [score, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.gameContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>💦 Pool Day!</Text>
          <TouchableOpacity onPress={() => onComplete(false)} style={styles.closeButton}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.poolArea}>
          {!gameStarted && !gameEnded && (
            <View style={styles.centerContent}>
              <Text style={styles.instructions}>Tap the rings to catch them! Get 80 points to win.</Text>
              <TouchableOpacity onPress={startGame} style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Playing</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameStarted && !gameEnded && (
            <>
              <View style={styles.gameStats}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.timerText}>Time: {timeLeft}s</Text>
              </View>
              {rings.map(ring => (
                <Animated.View
                  key={ring.id}
                  style={[
                    styles.ring,
                    { left: ring.x, top: ring.y, width: ring.size, height: ring.size },
                  ]}
                >
                  <TouchableOpacity onPress={() => catchRing(ring.id, ring.points)} style={styles.ringTouch}>
                    <Circle size={ring.size * 0.7} color={ring.color} strokeWidth={4} />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </>
          )}

          {gameEnded && (
            <View style={styles.centerContent}>
              <Text style={styles.finalScore}>Final Score: {score}</Text>
              <TouchableOpacity onPress={startGame} style={styles.playAgainButton}>
                <Text style={styles.playAgainText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          )}

          <Animated.Image 
            source={require('@/assets/images/pikachu.png')} 
            style={[styles.pokemonImage, { transform: [{ translateY: pokemonBounce }] }]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameContainer: {
    backgroundColor: '#45B7D1',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    height: 550,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    padding: 5,
  },
  poolArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#64B5F6',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFF',
    lineHeight: 26,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ring: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTouch: {
    padding: 10,
  },
  finalScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  playAgainText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pokemonImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -50,
    opacity: 0.8,
  },
});