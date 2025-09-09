import {Dimensions, StyleSheet, TouchableOpacity, useColorScheme, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {ThemedText} from "@/components/ThemedText";
import i18n, {changeLanguage} from "@/languages/language-config";
import React, {useState} from "react";
import {RadioButton} from "react-native-paper";
import {router} from "expo-router";
import ReturnButton from "@/components/ReturnButton";
import * as Updates from 'expo-updates';

const {height, width} = Dimensions.get('window'); // Récupérer la hauteur de l'écran
/**
 * languageScreen component allows the user to choose between available languages.
 * It supports dark and light themes with dynamic styles. The selected language is saved
 * upon clicking the 'Save' button, which triggers the changeLanguage function to update the language.
 * The return button navigates back to the previous screen.
 */

export default function languageScreen(){
  const colorScheme = useColorScheme(); // Utiliser useColorScheme pour détecter le mode
  const isDarkMode = colorScheme === 'dark'; // Vérifier si on est en mode sombre

  const colorStyles = isDarkMode ? darkStyles : lightStyles;

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.locale);

  const handleSaveLanguage = async () => {
    changeLanguage(selectedLanguage);
    await Updates.reloadAsync(); // reload entire app to apply language changes
  };

  return(
    <View style={styles.container}>
      <View style={styles.returnButtonContainer}>
        <ReturnButton/>
      </View>
      <ThemedText style={styles.title}>{i18n.t("ChangeLanguage.title")}</ThemedText>

      <RadioButton.Group onValueChange={value => setSelectedLanguage(value)} value={selectedLanguage}>
        <RadioButton.Item
          label="English" value="en" labelStyle={colorStyles.radioLabel}
          color={colorScheme === "dark" ? Colors.dark.primaryBtn : Colors.light.primaryBtn}
          style={[colorStyles.radioItem, styles.radioItem]}
        />
        <RadioButton.Item
          label="Français" value="fr" labelStyle={colorStyles.radioLabel}
          color={colorScheme === "dark" ? Colors.dark.primaryBtn : Colors.light.primaryBtn}
          style={[colorStyles.radioItem, styles.radioItem]}
        />
      </RadioButton.Group>

      {/* Sauvegarder les changements */}
      <TouchableOpacity style={[styles.btn, colorStyles.btn]} onPress={handleSaveLanguage}>
        <ThemedText style={[colorStyles.btnText, styles.textButton]}>{i18n.t("ChangeLanguage.saveBtn")}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  returnButtonContainer: {
    position: 'absolute',
    top: height * 0.01,
    left: width * 0.03,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    marginBottom: height * 0.1,
  },
  btn: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.04,
    width: width * 0.6,
    height: height * 0.09,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.025,
  },
  textButton: {
    fontSize: height * 0.025,
  },
  radioItem: {
    marginVertical: height * 0.02,
    borderRadius: width * 0.04,
    borderWidth: 1,
    width: width * 0.4,
  },
});

const lightStyles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.light.secondaryBtn,
  },
  btnText: {
    color: 'white',
  },
  radioItem: {
    backgroundColor: Colors.light.greyBtn,
    borderColor: '#000000',
  },
  radioLabel: {
    color: '#000',
  },
});

const darkStyles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.dark.secondaryBtn,
  },
  btnText: {
    color: 'white',
  },
  radioItem: {
    backgroundColor: Colors.dark.greyBtn,
    borderColor: '#ffffff',
  },
  radioLabel: {
    color: '#fff',
  },
});
