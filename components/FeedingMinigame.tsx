import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { X, Apple, Cookie, Fish } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';

interface FeedingMinigameProps {
  onComplete: (success: boolean) => void;
}

type FoodType = 'apple' | 'cookie' | 'fish';

interface Food {
  id: string;
  type: FoodType;
  x: number;
  y: number;
  points: number;
}

const FOOD_TYPES: { [key in FoodType]: { icon: any, color: string, points: number } } = {
  apple: { icon: Apple, color: '#4CAF50', points: 10 },
  cookie: { icon: Cookie, color: '#8D6E63', points: 5 },
  fish: { icon: Fish, color: '#2196F3', points: 15 }
};

export function FeedingMinigame({ onComplete }: FeedingMinigameProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const scaleAnim = useSharedValue(0);

  useEffect(() => {
    scaleAnim.value = withSpring(1);
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameEnded) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameEnded]);

  useEffect(() => {
    if (gameStarted && !gameEnded) {
      const spawnInterval = setInterval(() => {
        spawnFood();
      }, 800);
      return () => clearInterval(spawnInterval);
    }
  }, [gameStarted, gameEnded]);

  const spawnFood = () => {
    const foodTypes: FoodType[] = ['apple', 'cookie', 'fish'];
    const randomType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    const newFood: Food = {
      id: Math.random().toString(),
      x: Math.random() * 250 + 50, // Random x position
      y: Math.random() * 200 + 100, // Random y position
      points: FOOD_TYPES[randomType].points
    };

    setFoods(prev => [...prev, newFood]);

    // Remove food after 3 seconds if not caught
    setTimeout(() => {
      setFoods(prev => prev.filter(food => food.id !== newFood.id));
    }, 3000);
  };

  const catchFood = (food: Food) => {
    setFoods(prev => prev.filter(f => f.id !== food.id));
    setScore(prev => prev + food.points);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(15);
    setFoods([]);
    setGameEnded(false);
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    const success = score >= 50; // Need 50 points to succeed
    
    setTimeout(() => {
      onComplete(success);
      if (success) {
        Alert.alert('🎉 Great Job!', `You scored ${score} points! Your Pokemon is well-fed and happy!`);
      } else {
        Alert.alert('😅 Almost There!', `You scored ${score} points. Your Pokemon got some food but is still a bit hungry.`);
      }
    }, 1000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gameContainer, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🍎 Feeding Time!</Text>
          <TouchableOpacity onPress={() => onComplete(false)} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {!gameStarted && !gameEnded && (
          <View style={styles.startScreen}>
            <Text style={styles.instructions}>
              Tap the falling food to feed your Pokemon!{'\n'}
              Apples = 10 points{'\n'}
              Cookies = 5 points{'\n'}
              Fish = 15 points{'\n\n'}
              Get 50+ points to make your Pokemon happy!
            </Text>
            <TouchableOpacity onPress={startGame} style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Feeding!</Text>
            </TouchableOpacity>
          </View>
        )}

        {gameStarted && !gameEnded && (
          <View style={styles.gameArea}>
            <View style={styles.gameStats}>
              <Text style={styles.scoreText}>Score: {score}</Text>
              <Text style={styles.timerText}>Time: {timeLeft}s</Text>
            </View>

            <View style={styles.playArea}>
              {foods.map((food) => {
                const FoodIcon = FOOD_TYPES[food.type].icon;
                return (
                  <TouchableOpacity
                    key={food.id}
                    onPress={() => catchFood(food)}
                    style={[
                      styles.foodItem,
                      {
                        left: food.x,
                        top: food.y,
                        backgroundColor: FOOD_TYPES[food.type].color,
                      },
                    ]}
                  >
                    <FoodIcon size={24} color="#FFF" />
                  </TouchableOpacity>
                );
              })}

              {/* Pokemon mouth target */}
              <View style={styles.pokemonMouth}>
                <Text style={styles.mouthText}>😋</Text>
              </View>
            </View>
          </View>
        )}

        {gameEnded && (
          <View style={styles.endScreen}>
            <Text style={styles.finalScore}>Final Score: {score}</Text>
            <Text style={styles.resultText}>
              {score >= 50 ? '🎉 Excellent!' : '😊 Good try!'}
            </Text>
            <TouchableOpacity onPress={startGame} style={styles.playAgainButton}>
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onComplete(score >= 50)} style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    height: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  playArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E8F5E9',
  },
  foodItem: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pokemonMouth: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFCB05',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  mouthText: {
    fontSize: 30,
  },
  endScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  finalScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 15,
  },
  playAgainText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  doneText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});