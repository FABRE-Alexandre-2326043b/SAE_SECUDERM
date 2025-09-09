import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme, Dimensions, Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {ThemedText} from "@/components/ThemedText"; // Assurez-vous d'importer les hooks du store
import ReturnButton from "@/components/ReturnButton";
import {selectUserAuth} from "@/store/auth";
import {updateUser} from "@/store/userThunks";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {router} from "expo-router";
import {sendPasswordEmail} from "@/store/authThunks";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {Colors} from "@/constants/Colors";
import i18n from "@/languages/language-config";

// Get the dimensions of the window
const { width, height } = Dimensions.get('window');
/**
 * ModifyMyInformation component allows users to edit their personal details (name, email, etc.) and change their password.
 * It includes a help button and adapts to the light/dark color scheme.
 */

export default function ModifyMyInformation() {
  const dispatch = useAppDispatch();
  const userAuth = useAppSelector(selectUserAuth); // Récupérer l'user authentifié

  // États pour les champs éditables
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingDateOfBirth, setIsEditingDateOfBirth] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Valeurs des champs (prenant initialement des valeurs par défaut)
  const [lastName, setLastName] = useState(userAuth?.last_name);
  const [firstName, setFirstName] = useState(userAuth?.first_name);
  const [email, setEmail] = useState(userAuth?.email);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // État pour la visibilité du modal password change
  const [modalVisible, setModalVisible] = useState(false);

  // Fonction pour gérer la sauvegarde des modifications
  const handleSaveChanges = () => {
    if (userAuth != null && lastName != null && firstName != null && email != null){
      dispatch(updateUser({id: userAuth.id, first_name: firstName, last_name: lastName, email: email }));
    }
  };

  // Fonction pour gérer le changement de mot de passe
  const handlechangePassword = () => {
    setModalVisible(false);
    if (userAuth != null){
      dispatch(sendPasswordEmail({email : userAuth.email, emailType: 'change'}));
      console.log("Send : {email: " + userAuth?.email + ", emailType: change}");
    }
    router.navigate('/(tabs)/(profile)/(modify-my-information)/change-password-page');
  };

  const colorScheme = useColorScheme(); // Utiliser useColorScheme pour détecter le mode
  const isDarkMode = colorScheme === 'dark'; // Vérifier si on est en mode sombre

  // Appliquer les styles en fonction du mode clair/sombre
  const themedStyles = isDarkMode ? darkStyles : lightStyles;

  return (

    <View style={styles.container}>
      <View style={styles.topButtonsContainer}>
        <ReturnButton/>
        <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(tabs)/(profile)/(modify-my-information)/TutoModifyInformation')}>
          <MaterialCommunityIcons name="help-circle" size={width * 0.06} color="white" />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView>
        <ThemedText style={styles.title}>{i18n.t("editInfos.title")}</ThemedText>
        {/* Champ Nom */}
        <View style={styles.row}>
          <ThemedText style={styles.label}>{i18n.t("editInfos.label.lastName")}</ThemedText>
          <View style={styles.valueRow}>
            {isEditingLastName ? (
              <TextInput
                style={[styles.input, themedStyles.value]}
                value={lastName}
                onChangeText={setLastName}
                autoFocus
                onBlur={() => setIsEditingLastName(false)} // Ferme la zone de texte quand on quitte l'input
              />
            ) : (
              <ThemedText style={styles.value}>{lastName}</ThemedText>
            )}
            <TouchableOpacity onPress={() => setIsEditingLastName(!isEditingLastName)}>
              <Feather name="edit" size={width * 0.06} style={themedStyles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Champ Prénom */}
        <View style={styles.row}>
          <ThemedText style={styles.label}>{i18n.t("editInfos.label.firstName")}</ThemedText>
          <View style={styles.valueRow}>
            {isEditingFirstName ? (
              <TextInput
                style={[styles.input, themedStyles.value]}
                value={firstName}
                onChangeText={setFirstName}
                autoFocus
                onBlur={() => setIsEditingFirstName(false)}
              />
            ) : (
              <ThemedText style={styles.value}>{firstName}</ThemedText>
            )}
            <TouchableOpacity onPress={() => setIsEditingFirstName(!isEditingFirstName)}>
              <Feather name="edit" size={width * 0.06} style={themedStyles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Champ Sexe */}
        {/*<View style={styles.row}>*/}
        {/*  <ThemedText style={styles.label}>{i18n.t("editInfos.label.gender")}</ThemedText>*/}
        {/*  <View style={styles.valueRow}>*/}
        {/*    {isEditingGender ? (*/}
        {/*      <TextInput*/}
        {/*        style={styles.input}*/}
        {/*        value={gender}*/}
        {/*        onChangeText={setGender}*/}
        {/*        autoFocus*/}
        {/*        onBlur={() => setIsEditingGender(false)}*/}
        {/*      />*/}
        {/*    ) : (*/}
        {/*      <ThemedText style={styles.value}>Not in BD for now</ThemedText>*/}
        {/*    )}*/}
        {/*    <TouchableOpacity disabled={true} onPress={() => setIsEditingGender(!isEditingGender)}>*/}
        {/*      <Feather name="edit" size={width * 0.06} style={themedStyles.icon} />*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/* Champ Date de Naissance */}
        {/*<View style={styles.row}>*/}
        {/*  <ThemedText style={styles.label}>{i18n.t("editInfos.label.dateBirth")}</ThemedText>*/}
        {/*  <View style={styles.valueRow}>*/}
        {/*    {isEditingDateOfBirth ? (*/}
        {/*      <TextInput*/}
        {/*        style={styles.input}*/}
        {/*        value={dateOfBirth}*/}
        {/*        onChangeText={setDateOfBirth}*/}
        {/*        autoFocus*/}
        {/*        onBlur={() => setIsEditingDateOfBirth(false)}*/}
        {/*      />*/}
        {/*    ) : (*/}
        {/*      <ThemedText style={styles.value}>Not in BD for now</ThemedText>*/}
        {/*    )}*/}
        {/*    <TouchableOpacity disabled={true} onPress={() => setIsEditingDateOfBirth(!isEditingDateOfBirth)}>*/}
        {/*      <Feather name="edit" size={width * 0.06} style={themedStyles.icon} />*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/* Adresse mail */}
        <View style={styles.row}>
          <ThemedText style={styles.label}>{i18n.t("editInfos.label.email")}</ThemedText>
          <View style={styles.valueRow}>
            {isEditingEmail ? (
              <TextInput
                style={[styles.input, themedStyles.value]}
                value={email}
                onChangeText={setEmail}
                autoFocus
                onBlur={() => setIsEditingEmail(false)}
              />
            ) : (
              <ThemedText style={styles.value}>{email}</ThemedText>
            )}
            <TouchableOpacity onPress={() => setIsEditingEmail(!isEditingEmail)}>
              <Feather name="edit" size={width * 0.06} style={themedStyles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton Sauvegarder */}
        <TouchableOpacity style={[styles.saveButton, themedStyles.saveButton]} onPress={handleSaveChanges}>
          <ThemedText style={styles.saveButtonText}>{i18n.t("editInfos.saveBtn")}</ThemedText>
        </TouchableOpacity>

        {/* Mot de passe */}
        <TouchableOpacity style={[styles.changePasswordButton, themedStyles.changePasswordButton]} onPress={() =>{
          setModalVisible(true);}}>
          <ThemedText style={styles.saveButtonText}>{i18n.t("editInfos.changePwdBtn")}</ThemedText>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent={true}
             onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, themedStyles.modalView]}>
            <ThemedText style={styles.modalText}>{i18n.t("editInfos.modal.title")}</ThemedText>
            <View style={styles.btnGroup}>
              <TouchableOpacity style={[styles.button, themedStyles.closeButton]}
                                onPress={() => setModalVisible(false)}>
                <ThemedText style={styles.buttonText}>{i18n.t("editInfos.modal.closeBtn")}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, themedStyles.continueButton]} onPress={handlechangePassword}>
                <ThemedText style={styles.buttonText}>{i18n.t("editInfos.modal.continueBtn")}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>

  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    marginBottom: height * 0.05,
    marginTop: height * 0.02,
    textAlign: 'center',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: height * 0.001,
  },
  label: {
    fontSize: width * 0.035,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: width * 0.04,
    flex: 2,
  },
  input: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: width * 0.04,
  },
  saveButton: {
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.08,
    marginBottom: height * 0.04,
    borderRadius: width * 0.06,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  saveButtonText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  changePasswordButton: {
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.03,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width * 0.8,
    padding: 20,
    borderRadius: width * 0.03,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  button: {
    marginTop: height * 0.02,
    borderRadius: width * 0.03,
    padding: 10,
    width: width * 0.3,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  helpButton: {
    position: 'absolute',
    top: height * 0.04,
    right: width * 0.05,
    backgroundColor: '#007AFF',
    borderRadius: width * 0.12,
    padding: width * 0.03,
  },
});

const darkStyles = {
  icon: {
    color: '#fff',
  },
  value: {
    color: '#f5f5f5',
  },
  changePasswordButton: {
    backgroundColor: Colors.dark.primaryBtn,
  },
  saveButton: {
    backgroundColor: Colors.dark.secondaryBtn,
  },
  modalView: {
    backgroundColor: '#000000',
    borderColor: Colors.dark.greyBtn,
  },
  continueButton: {
    backgroundColor: Colors.dark.primaryBtn,
  },
  closeButton: {
    backgroundColor: Colors.dark.greyBtn,
  }
}

const lightStyles = {
  icon: {
    color: '#000000',
  },
  value: {
    color: '#000000',
  },
  changePasswordButton: {
    backgroundColor: Colors.light.primaryBtn,
  },
  saveButton: {
    backgroundColor: Colors.light.secondaryBtn,
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
  },
  continueButton: {
    backgroundColor: Colors.light.primaryBtn,
  },
  closeButton: {
    backgroundColor: Colors.light.greyBtn,
  }
}
