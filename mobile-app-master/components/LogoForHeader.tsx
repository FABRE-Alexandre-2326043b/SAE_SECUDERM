import React from 'react';
import {Image, Dimensions, StyleSheet, useColorScheme} from 'react-native';

const { width } = Dimensions.get('window');

const imageWidth = Math.min(width * 0.3, 100);
const imageHeight = (imageWidth / 231) * 67;



const LogoForHeader = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const imgLight = require('@/assets/images/LOGO-SECUDERM-Header.png');
  const imgDark = require('@/assets/images/LOGO-SECUDERM-HEADER-DARK.png');

  return (
    <Image
      style={styles.logo}
      source={isDarkMode ? imgDark : imgLight}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: imageWidth,
    height: imageHeight,
  },
});

export { LogoForHeader };
