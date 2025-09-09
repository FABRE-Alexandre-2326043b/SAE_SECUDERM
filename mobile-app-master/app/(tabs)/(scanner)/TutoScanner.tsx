import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const images = [
  require('@/assets/images/Tuto/Scan1.webp'),
  require('@/assets/images/Tuto/Scan2.webp'),
];
/**
 * HelpScreen component displays a tutorial with images.
 * Users can navigate through the images and close the tutorial.
 */
export default function HelpScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Tracks the currently displayed image index.
  const navigation = useNavigation(); // Provides navigation functionality.
  /**
   * Function to handle the next image button click.
   * Updates the current image index to show the next image.
   */
  const handleNextImage = () => {
    // Advances to the next image. Loops back to the first image when reaching the end.
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <LinearGradient
      colors={['#f8fbfd', '#ffffff']} // Background gradient for a smooth aesthetic.
      style={styles.container}
    >
      {/* Top section with a close button */}
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Center section displaying the current tutorial image */}
      <View style={styles.imageContainer}>
        <Image source={images[currentImageIndex]} style={styles.image} />
      </View>

      {/* Bottom button to navigate to the next image */}
      <TouchableOpacity style={styles.button} onPress={handleNextImage}>
        <Feather name="arrow-right" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

// Stylesheet defining the layout and appearance of the component
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
    marginVertical: 10,
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adds shadow to the button for a raised effect.
  },
});
