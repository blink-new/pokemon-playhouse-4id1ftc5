import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { X, Palette, Type, Shirt } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring
} from 'react-native-reanimated';

interface CustomizationMenuProps {
  currentStats: {
    name: string;
    color: string;
    accessory: string;
  };
  onComplete: (newStats: any) => void;
}

const COLORS = [
  { name: 'Classic Yellow', value: '#FFCB05' },
  { name: 'Electric Blue', value: '#2196F3' },
  { name: 'Forest Green', value: '#4CAF50' },
  { name: 'Sunset Orange', value: '#FF9800' },
  { name: 'Royal Purple', value: '#9C27B0' },
  { name: 'Rose Pink', value: '#E91E63' },
];

const ACCESSORIES = [
  { name: 'None', value: 'none' },
  { name: 'Cool Hat', value: 'hat' },
  { name: 'Cute Bow', value: 'bow' },
  { name: 'Smart Glasses', value: 'glasses' },
];

export function CustomizationMenu({ currentStats, onComplete }: CustomizationMenuProps) {
  const [name, setName] = useState(currentStats.name);
  const [selectedColor, setSelectedColor] = useState(currentStats.color);
  const [selectedAccessory, setSelectedAccessory] = useState(currentStats.accessory);

  const scaleAnim = useSharedValue(0);

  useState(() => {
    scaleAnim.value = withSpring(1);
  });

  const handleSave = () => {
    onComplete({
      name: name.trim() || 'Pikachu',
      color: selectedColor,
      accessory: selectedAccessory,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.menuContainer, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>✨ Customize Pokemon</Text>
          <TouchableOpacity onPress={() => onComplete(currentStats)} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Name Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Type size={20} color="#666" />
              <Text style={styles.sectionTitle}>Name</Text>
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.nameInput}
              placeholder="Enter Pokemon name"
              placeholderTextColor="#999"
              maxLength={15}
            />
          </View>

          {/* Color Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Palette size={20} color="#666" />
              <Text style={styles.sectionTitle}>Color Theme</Text>
            </View>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  onPress={() => setSelectedColor(color.value)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    selectedColor === color.value && styles.selectedColor
                  ]}
                >
                  {selectedColor === color.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.colorName}>
              {COLORS.find(c => c.value === selectedColor)?.name}
            </Text>
          </View>

          {/* Accessory Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shirt size={20} color="#666" />
              <Text style={styles.sectionTitle}>Accessories</Text>
            </View>
            <View style={styles.accessoryGrid}>
              {ACCESSORIES.map((accessory) => (
                <TouchableOpacity
                  key={accessory.value}
                  onPress={() => setSelectedAccessory(accessory.value)}
                  style={[
                    styles.accessoryOption,
                    selectedAccessory === accessory.value && styles.selectedAccessory
                  ]}
                >
                  <Text style={styles.accessoryText}>{accessory.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewContainer}>
              <View style={[styles.previewPokemon, { backgroundColor: selectedColor }]}>
                <Text style={styles.previewName}>{name || 'Pikachu'}</Text>
                {selectedAccessory !== 'none' && (
                  <View style={styles.previewAccessory}>
                    <Text style={styles.previewAccessoryText}>
                      {selectedAccessory === 'hat' ? '🎩' : 
                       selectedAccessory === 'bow' ? '🎀' : '👓'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
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
  content: {
    padding: 20,
    maxHeight: 400,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#333',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  colorName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  accessoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accessoryOption: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAccessory: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  accessoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  previewSection: {
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewPokemon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  previewName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewAccessory: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  previewAccessoryText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});