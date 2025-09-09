import React, { useCallback, useState } from 'react';
import {View, StyleSheet, Image, TouchableOpacity, useColorScheme, ScrollView, Dimensions, Linking} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useAppSelector } from "@/store/hooks";
import { selectUserAuth } from "@/store/auth";
import Feather from '@expo/vector-icons/Feather';


import {Link, router, useFocusEffect} from 'expo-router';
import { Colors } from "@/constants/Colors";
import i18n from "@/languages/language-config";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get('window');
/**
 * ProfileScreen component displays the user's profile information and provides navigation options.
 * It includes user details, buttons for editing information and settings, and a help button.
 */
export default function ProfileScreen() {
  const user = useAppSelector(selectUserAuth);

  const [last_name, setLast_name] = useState(user?.last_name);
  const [first_name, setFirst_name] = useState(user?.first_name);
  const [type, setType] = useState(user?.type);

  const colorScheme = useColorScheme(); // Use useColorScheme to detect the mode
  const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

  // Apply styles based on light/dark mode
  const buttonStyles = isDarkMode ? darkStyles : lightStyles;

  const currentLocale = i18n.locale;

  useFocusEffect(
    useCallback(() => {
      // Update values when the screen is refocused
      setLast_name(user?.last_name);
      setFirst_name(user?.first_name);
      setType(user?.type);

      if (currentLocale != i18n.locale){
        // Force language change and redirection only if needed
        router.replace('/(tabs)/(profile)');
      }
    }, [user, i18n.locale])
  );

  return (
    <View style={styles.container}>
      <ScrollView >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={require('@/assets/images/default-avatar.webp')}
            style={styles.avatar}
          />
          <View style={styles.infoUser}>
            <ThemedText style={styles.userText}>
              M {type} | {last_name} {first_name}
            </ThemedText>
            {/*<ThemedText style={styles.userText}>{'12/08/2000'}</ThemedText>*/}
          </View>
        </View>

        {/* Separator line */}
        <View style={styles.separatorContainer}>
          <View style={buttonStyles.separator} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Link href={{ pathname: '/(tabs)/(profile)/(modify-my-information)/modify-my-information', params: { uuid: user?.id } }} asChild>
            <TouchableOpacity style={buttonStyles.button}>
              <View style={styles.iconAndText}>
                <Feather name="edit-3" style={buttonStyles.icon_edit} size={24} />
                <ThemedText style={styles.buttonText}>{i18n.t("profilPage.editInfoBtn")}</ThemedText>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Settings Button */}
          <Link href={{ pathname: '/(tabs)/(profile)/(settings)/settings', params: { uuid: user?.id } }} asChild>
            <TouchableOpacity style={buttonStyles.button}>
              <View style={styles.iconAndText}>
                <Feather name="settings" style={buttonStyles.icon_settings} size={24} />
                <ThemedText style={styles.buttonText}>{i18n.t("profilPage.settingBtn")}</ThemedText>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Shop Button */}
          <TouchableOpacity
              style={buttonStyles.button}
              onPress={() => Linking.openURL('https://secuderm.com')}
          >
            <View style={styles.iconAndText}>
              <Feather name="shopping-bag" style={buttonStyles.icon_store} size={24} />
              <ThemedText style={styles.buttonText}>{i18n.t("profilPage.storeBtn") || "Visiter notre boutique"}</ThemedText>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
      {/* Help Button */}
      <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(tabs)/(profile)/TutoProfile')}>
        <MaterialCommunityIcons name="help-circle" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  profileSection: {
    flexDirection: "row",
    marginVertical: 17,
    width: '100%',
    alignItems: 'center',
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: "#ccc",
    marginLeft: 20,
    marginTop: 12,
    borderColor: "#ffffff",
  },
  infoUser: {
    marginLeft: 60,
    marginTop: 22,
  },
  userText: {
    fontSize: 16,
  },
  separatorContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  buttonsContainer: {
    marginTop: 110,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginLeft: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 17,
    width: "90%",
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
  },
  separator: {
    width: '100%',
    height: 2,
    marginVertical: 20,
  },
  icon_edit: {
    marginRight: 50,
  },
  icon_settings: {
    marginRight: 90,
  },
  helpButton: {
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    backgroundColor: '#007AFF',
    borderRadius: width * 0.12,
    padding: width * 0.03,
  },
});

const lightStyles = StyleSheet.create({
  ...styles,
  button: {
    ...styles.button,
    backgroundColor: Colors.light.greyBtn,
    borderColor: '#000000',
  },
  separator: {
    ...styles.separator,
    backgroundColor: '#000000',
  },
  icon_edit: {
    ...styles.icon_edit,
    color: '#000000',
  },
  icon_settings: {
    ...styles.icon_settings,
    color: '#000000',
  },
  icon_store: {
    marginRight: 65,
    color: '#000000',
  },
});

const darkStyles = StyleSheet.create({
  ...styles,
  button: {
    ...styles.button,
    backgroundColor: Colors.dark.greyBtn,
    borderColor: '#ffffff',
  },
  separator: {
    ...styles.separator,
    backgroundColor: '#bcbcbc',
  },
  icon_edit: {
    ...styles.icon_edit,
    color: '#ffffff',
  },
  icon_settings: {
    ...styles.icon_settings,
    color: '#ffffff',
  },
  icon_store: {
    marginRight: 65,
    color: '#ffffff',
  },
});
