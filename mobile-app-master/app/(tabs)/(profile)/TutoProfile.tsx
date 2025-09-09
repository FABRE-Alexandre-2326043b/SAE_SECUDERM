import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Get the dimensions of the window
const { width, height } = Dimensions.get('window');

// Array of images to be displayed in the tutorial
const images = [
  require('@/assets/images/Tuto/Profile1.webp'),
  require('@/assets/images/Tuto/Profile2.webp'),
  require('@/assets/images/Tuto/Profile3.webp'),
];
/**
 * HelpScreen component displays a tutorial with images.
 * Users can navigate through the images and close the tutorial.
 */
export default function HelpScreen() {
  // State to keep track of the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Hook to get the navigation object
  const navigation = useNavigation();

  /**
   * Function to handle the next image button click.
   * Updates the current image index to show the next image.
   */
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    // Linear gradient background
    <LinearGradient
      colors={['#f8fbfd', '#ffffff']}
      style={styles.container}
    >
      {/* Top container with the close button */}
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={width * 0.08} color="black" />
        </TouchableOpacity>
      </View>
      {/* Container for the tutorial image */}
      <View style={styles.imageContainer}>
        <Image source={images[currentImageIndex]} style={styles.image} />
      </View>
      {/* Button to go to the next image */}
      <TouchableOpacity style={styles.button} onPress={handleNextImage}>
        <Feather name="arrow-right" size={width * 0.06} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  topContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: height * 0.02,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  image: {
    width: width * 0.9,
    height: height * 0.6,
    resizeMode: 'contain',
  },
  button: {
    width: width * 0.3,
    backgroundColor: '#007AFF',
    borderRadius: width * 0.15,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginBottom: height * 0.02,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow for button
  },
});