import React, { useCallback } from 'react';
import {View, StyleSheet, TouchableOpacity, useColorScheme, Dimensions} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import Feather from '@expo/vector-icons/Feather';
import { useAppSelector } from "@/store/hooks";
import { selectUserAuth } from "@/store/auth";
import { Link, router, useFocusEffect } from 'expo-router'; // Import Link for navigation
import ReturnButton from "@/components/ReturnButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";
import i18n from '@/languages/language-config';

const { width, height } = Dimensions.get('window');
/**
 * SettingsScreen component manages the user settings screen, including language selection and logout functionality.
 * It listens for changes in locale and user authentication status, redirecting as necessary.
 * The UI is responsive to the current color scheme (light/dark mode).
 */

export default function SettingsScreen() {
  const user = useAppSelector(selectUserAuth);

  const colorScheme = useColorScheme(); // Using useColorScheme to detect the mode
  const isDarkMode = colorScheme === 'dark'; // Checking if it's in dark mode

  // Applying styles based on light/dark mode
  const buttonStyles = isDarkMode ? darkStyles : lightStyles;

  const currentLocale = i18n.locale;

  useFocusEffect(
    useCallback(() => {
      if (currentLocale != i18n.locale) {
        // Force language change and redirection only if necessary
        router.replace('/settings');
      }
    }, [i18n.locale])
  );

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        router.navigate("/login");
      }
    }, [user])
  );

  return (
    <View style={styles.container}>
      <ReturnButton />

      <View>

        {/* Settings Title */}
        <View style={{ alignItems: "center" }}>
          <ThemedText style={styles.title}>{i18n.t('setting.title')}</ThemedText>
        </View>
        {/* Buttons */}
        <View style={styles.buttonsContainer}>

          {/* Language Button */}
          <Link href={{ pathname: '/(tabs)/(profile)/(settings)/language', params: { uuid: user?.id } }} asChild>
            <TouchableOpacity style={buttonStyles.button}>
              <View style={styles.iconAndText}>
                <Feather name="globe" style={buttonStyles.icon} size={24} />
                <ThemedText style={styles.buttonText}>{i18n.t('setting.languages')}</ThemedText>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Logout Button */}
          <Link href={{ pathname: '/(tabs)/(profile)/(settings)/logout', params: { uuid: user?.id } }} asChild>
            <TouchableOpacity style={buttonStyles.button}>
              <View style={styles.iconAndText}>
                <Feather name="log-out" style={buttonStyles.iconLogOut} size={24} />
                <ThemedText style={styles.buttonTextLogOut}>{i18n.t('setting.logoutBtn')}</ThemedText>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Delete account button */}
          <Link href={{ pathname: '/(tabs)/(profile)/(settings)/delAccount', params: { uuid: user?.id } }} asChild>
            <TouchableOpacity style={buttonStyles.button}>
              <View style={styles.iconAndText}>
                <Feather name="trash-2" style={buttonStyles.iconLogOut} size={24} />
                <ThemedText style={styles.buttonTextLogOut}>{i18n.t('setting.deleteAccount', { defaultValue: 'Supprimer mon compte' })}</ThemedText>
              </View>
            </TouchableOpacity>
          </Link>

        </View>
      </View>

      {/* Help Button */}
      <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(tabs)/(profile)/(settings)/TutoSettings')}>
        <MaterialCommunityIcons name="help-circle" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 40,
    padding: 20,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTextLogOut: {
    fontSize: 16,
    marginRight: 45,
  },
  buttonText: {
    fontSize: 16,
    marginRight: 67,
  },
  helpButton: {
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    backgroundColor: '#007AFF',
    borderRadius: width * 0.12,
    padding: width * 0.03,
  },
  deleteAccountButton: {
    marginTop: 20, // Séparation des autres boutons
  },
  deleteIcon: {
    color: '#FF3B30', // Rouge pour indiquer une action destructive
  },
  deleteText: {
    color: '#FF3B30',
  }
});

// Light mode button styles
const lightStyles = StyleSheet.create({
  button: {
    backgroundColor: "#d8d7d7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 17,
    width: "90%", // Ensures button width is responsive
    alignItems: "center" as const,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  buttonBackground: {
    backgroundColor: Colors.light.greyBtn,
  },
  icon: {
    marginRight: 75,
    color: '#070707',
  },
  iconLogOut: {
    marginRight: 55,
    color: '#000000',
  }
});

// Dark mode button styles
const darkStyles = StyleSheet.create({
  button: {
    backgroundColor: "#6c6b6b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 17,
    width: "90%", // Ensures button width is responsive
    alignItems: "center" as const,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  buttonBackground: {
    backgroundColor: Colors.dark.greyBtn,
  },
  icon: {
    marginRight: 75,
    color: '#ffffff',
  },
  iconLogOut: {
    marginRight: 55,
    color: '#ffffff',
  }
});
