import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import i18n from '@/languages/language-config';

const { width, height } = Dimensions.get('window');

const ReturnButton = () => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';

  return (
    <Link href=".." asChild>
      <TouchableOpacity style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color={iconColor} />
        <ThemedText style={styles.text}>{i18n.t("returnBtn")}</ThemedText>
      </TouchableOpacity>
    </Link>
  );
};

const sharedStyles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.05,
    marginLeft: width * 0.02,
    borderWidth: 1,
    borderRadius: 25,
    width: width * 0.3,
    height: height * 0.045,
    // backgroundColor: '#FF6500',
  },
  text: {
    fontSize: width * 0.04,
    marginLeft: width * 0.02,
  },
});

const lightStyles = StyleSheet.create({
  ...sharedStyles,
  backButton: {
    ...sharedStyles.backButton,
    borderColor: 'black',
  },
  text: {
    ...sharedStyles.text,
    color: 'black',
  },
});

const darkStyles = StyleSheet.create({
  ...sharedStyles,
  backButton: {
    ...sharedStyles.backButton,
    borderColor: 'white',
  },
  text: {
    ...sharedStyles.text,
    color: 'white',
  },
});

export default ReturnButton;
