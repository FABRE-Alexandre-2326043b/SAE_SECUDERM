import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, selectUserAuth } from "@/store/auth";
import { router } from 'expo-router';
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import i18n from '@/languages/language-config';

const height = Dimensions.get('window').height; // Get the screen height
/**
 * LogoutConfirmation component displays a confirmation modal with options to log out or cancel the action.
 * It uses dynamic styling based on the current theme (light or dark mode).
 * The user is logged out by dispatching the logout action, and if the user is not logged in, the screen navigates back.
 * Toast messages or routing ensure proper feedback for the user action.
 */

export default function LogoutConfirmation() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme(); // Use useColorScheme to detect the current mode (light/dark)
  const isDarkMode = colorScheme === 'dark'; // Check if the mode is dark
  const user = useAppSelector(selectUserAuth);
  // Apply styles based on light or dark mode
  const buttonStyles = isDarkMode ? darkStyles : lightStyles;

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
  };

  const cancelLogout = () => {
    router.back(); // Navigate back to the previous screen
  };

  useEffect(() => {
    if (!user) {
      router.back(); // Go back if there is no user (i.e., logged out)
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <ThemedText style={styles.title}>{i18n.t("logout.title")}</ThemedText>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Cancel Button */}
        <TouchableOpacity style={[styles.button, buttonStyles.cancelButton]} onPress={cancelLogout}>
          <ThemedText style={[buttonStyles.cancelButtonText, styles.textButton]}>{i18n.t("logout.cancelBtn")}</ThemedText>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.button, buttonStyles.logoutButton]} onPress={handleLogout}>
          <ThemedText style={[buttonStyles.logoutButtonText, styles.textButton]}>{i18n.t("logout.logoutBtn")}</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  title: {
    fontSize: height * 0.029,
    fontWeight: 'bold',
    marginBottom: '10%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderRadius: 30,
    width: '45%',
    height: height * 0.09,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: height * 0.02,
  }
});

// Light mode button styles
const lightStyles = StyleSheet.create({
  cancelButton: {
    backgroundColor: Colors.light.greyBtn,
  },
  cancelButtonText: {
    color: 'black',
  },
  logoutButton: {
    backgroundColor: Colors.light.logoutBtn,
  },
  logoutButtonText: {
    color: 'white',
  },
});

// Dark mode button styles
const darkStyles = StyleSheet.create({
  cancelButton: {
    backgroundColor: Colors.dark.greyBtn,
  },
  cancelButtonText: {
    color: 'white',
  },
  logoutButton: {
    backgroundColor: Colors.dark.logoutBtn,
  },
  logoutButtonText: {
    color: 'white',
  },
});
