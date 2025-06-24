import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Heart, Zap, Shield, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideInUp } from 'react-native-reanimated';

export default function Battle() {
  const router = useRouter();
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>(['Battle started!']);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const attack = (damage: number, attackName: string) => {
    if (!isPlayerTurn) return;
    
    const newEnemyHP = Math.max(0, enemyHP - damage);
    setEnemyHP(newEnemyHP);
    setBattleLog([...battleLog, `Pikachu used ${attackName}! Dealt ${damage} damage!`]);
    
    if (newEnemyHP === 0) {
      setBattleLog([...battleLog, 'You won! 🎉']);
      return;
    }
    
    setIsPlayerTurn(false);
    
    // Enemy counter attack
    setTimeout(() => {
      const enemyDamage = Math.floor(Math.random() * 20) + 10;
      const newPlayerHP = Math.max(0, playerHP - enemyDamage);
      setPlayerHP(newPlayerHP);
      setBattleLog(prev => [...prev, `Wild Pokémon attacked! Dealt ${enemyDamage} damage!`]);
      
      if (newPlayerHP === 0) {
        setBattleLog(prev => [...prev, 'You lost! 😢']);
      } else {
        setIsPlayerTurn(true);
      }
    }, 1500);
  };

  const isGameOver = playerHP === 0 || enemyHP === 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <X size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.battleField}>
        {/* Enemy Pokemon */}
        <Animated.View 
          entering={SlideInDown.duration(500)}
          style={styles.enemySection}
        >
          <View style={styles.statusBar}>
            <Text style={styles.pokemonName}>Wild Pokémon</Text>
            <View style={styles.hpBar}>
              <View style={[styles.hpFill, { width: `${enemyHP}%`, backgroundColor: enemyHP > 50 ? '#4CAF50' : '#FF5252' }]} />
            </View>
            <Text style={styles.hpText}>{enemyHP}/100</Text>
          </View>
          <View style={styles.pokemonSprite}>
            <Shield size={80} color="#666" />
          </View>
        </Animated.View>

        {/* Player Pokemon */}
        <Animated.View 
          entering={SlideInUp.duration(500)}
          style={styles.playerSection}
        >
          <View style={styles.pokemonSprite}>
            <Image source={require('@/assets/images/pikachu.png')} style={styles.pikachuImage} />
          </View>
          <View style={styles.statusBar}>
            <Text style={styles.pokemonName}>Pikachu</Text>
            <View style={styles.hpBar}>
              <View style={[styles.hpFill, { width: `${playerHP}%`, backgroundColor: playerHP > 50 ? '#4CAF50' : '#FF5252' }]} />
            </View>
            <Text style={styles.hpText}>{playerHP}/100</Text>
          </View>
        </Animated.View>
      </View>

      {/* Battle Log */}
      <View style={styles.battleLog}>
        {battleLog.slice(-3).map((log, index) => (
          <Animated.Text 
            key={`${log}-${index}`}
            entering={FadeIn}
            style={styles.logText}
          >
            {log}
          </Animated.Text>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {!isGameOver ? (
          <>
            <TouchableOpacity 
              onPress={() => attack(20, 'Thunder Shock')} 
              style={[styles.actionButton, !isPlayerTurn && styles.disabledButton]}
              disabled={!isPlayerTurn}
            >
              <Zap size={24} color="#FFF" />
              <Text style={styles.actionText}>Thunder Shock</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => attack(30, 'Thunderbolt')} 
              style={[styles.actionButton, styles.strongButton, !isPlayerTurn && styles.disabledButton]}
              disabled={!isPlayerTurn}
            >
              <Zap size={24} color="#FFF" />
              <Text style={styles.actionText}>Thunderbolt</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Return Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  battleField: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
  enemySection: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  playerSection: {
    alignItems: 'flex-start',
    marginTop: 'auto',
  },
  statusBar: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  hpBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  hpFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  hpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  pokemonSprite: {
    padding: 20,
  },
  pikachuImage: {
    width: 100,
    height: 100,
  },
  battleLog: {
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    minHeight: 80,
    justifyContent: 'center',
  },
  logText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFCB05',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  strongButton: {
    backgroundColor: '#FF6B6B',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});