import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const images = [
  require('@/assets/images/Tuto/Bandage1.webp'),

];
/**
 * HelpScreen component displays a tutorial with images.
 * Users can navigate through the images and close the tutorial.
 */
export default function HelpScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the currently displayed image index
  const navigation = useNavigation(); // Hook to navigate between screens

  /**
   * Function to handle the next image button click.
   * Updates the current image index to show the next image.
   */
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <LinearGradient
      colors={['#f8fbfd', '#ffffff']}
      style={styles.container}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image source={images[currentImageIndex]} style={styles.image} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: width * 0.9,
    height: height * 0.6,
    resizeMode: 'contain',

  },
  button: {
    width: width * 0.3,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow for button
  },
});