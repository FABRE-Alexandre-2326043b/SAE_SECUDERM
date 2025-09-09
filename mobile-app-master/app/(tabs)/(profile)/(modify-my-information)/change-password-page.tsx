import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions, useColorScheme, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ReturnButton from "@/components/ReturnButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { selectError, selectStatus, selectUserAuth } from "@/store/auth";
import { changePassword, sendPasswordEmail } from "@/store/authThunks";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import i18n from "@/languages/language-config";
import { useToast } from "@/hooks/useToast";

// Get the dimensions of the window
const { width, height } = Dimensions.get('window');
/**
 * ChangePasswordPage allows users to change their password. It includes functionality to send a verification code via email,
 * input fields for the current and new passwords, and a modal to confirm resending the code.
 * It adapts to the system's color scheme and displays relevant success/error messages.
 */

export default function changePasswordPage() {
  const dispatch = useAppDispatch();
  const userAuth = useAppSelector(selectUserAuth);
  const authError = useAppSelector(selectError);
  const authStatus = useAppSelector(selectStatus);

  // States for password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme(); // Use useColorScheme to detect the mode
  const isDarkMode = colorScheme === 'dark'; // Check if in dark mode
  const themedStyles = isDarkMode ? darkStyles : lightStyles;

  const { showToast } = useToast();

  const handleSendVerificationCode = () => {
    if (userAuth != null){
      dispatch(sendPasswordEmail({email : userAuth.email, emailType: 'change'}));
      console.log("Send : {email: " + userAuth?.email + ", emailType: change}");
      alert("A verification code has been sent to your email address");
      showToast("info", i18n.t("toastStatus.info"), i18n.t("changePwd.toast.codeSent"));
    }
    else {
      alert(i18n.t("changePwd.toast.AuthError"));
    }
    setModalVisible(false);
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast("error", i18n.t("toastStatus.error"), i18n.t("changePwd.toast.doNotMatch"));
      return;
    }

    if (newPassword == '' || confirmPassword == '' || currentPassword == '' || verificationCode == '') {
      showToast("error", i18n.t("toastStatus.error"), i18n.t("changePwd.toast.fieldsError"));
      return;
    }

    // Update the password
    dispatch(changePassword({oldPassword: currentPassword, newPassword: newPassword, code: verificationCode}));
    console.log("Password updated");
    if (authError == null && authStatus == 'succeeded'){
      showToast("success", i18n.t("toastStatus.success"), i18n.t("changePwd.toast.changeSuccess"));
      router.navigate('/(tabs)/(profile)/(modify-my-information)/modify-my-information');
    }
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ReturnButton/>
        <View style={styles.block}>
          <ThemedText style={styles.title}>{i18n.t("changePwd.title")}</ThemedText>

          {/* Block to display errors */}
          {authError && <View style={[styles.errorBlock, themedStyles.errorBlock]}>
              <ThemedText>{authError}</ThemedText>
          </View>}

          {/* Button to resend verification code */}

          {/* Field for verification code sent by email */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{i18n.t("changePwd.input.verificationCode")}</ThemedText>
            <TextInput style={[styles.input, themedStyles.input]} value={verificationCode}
                       onChangeText={setVerificationCode} placeholder={i18n.t("changePwd.input.verificationCode")} keyboardType={'number-pad'}/>
            <ThemedText style={styles.infoText}>{i18n.t("changePwd.verifCodeTxt.sent")}</ThemedText>
            <View style={styles.rowGroup}>
              <ThemedText style={styles.infoText}>{i18n.t("changePwd.verifCodeTxt.didntReceive")}</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <ThemedText style={[styles.linkText, themedStyles.linkText]}>{i18n.t("changePwd.verifCodeTxt.returnLink")}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Current password field */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{i18n.t("changePwd.input.currentPwd")}</ThemedText>
            <TextInput style={[styles.input, themedStyles.input]} value={currentPassword}
                       onChangeText={setCurrentPassword} secureTextEntry placeholder={i18n.t("changePwd.input.currentPwd")}/>
          </View>

          {/* New password field */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{i18n.t("changePwd.input.newPwd")}</ThemedText>
            <TextInput style={[styles.input, themedStyles.input]} value={newPassword}
                       onChangeText={setNewPassword} secureTextEntry placeholder={i18n.t("changePwd.input.newPwd")}/>
          </View>

          {/* Confirm new password field */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{i18n.t("changePwd.input.confirmNewPwd")}</ThemedText>
            <TextInput style={[styles.input, themedStyles.input]} value={confirmPassword}
                       onChangeText={setConfirmPassword} secureTextEntry placeholder={i18n.t("changePwd.input.confirmNewPwd")}/>
          </View>

          {/* Button to change the password */}
          <TouchableOpacity style={[styles.button, themedStyles.button]} onPress={handleChangePassword}>
            <ThemedText style={styles.buttonText}>{i18n.t("changePwd.updateBtn")}</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Modal to confirm resending the code */}
        <Modal animationType="slide" transparent={true} visible={isModalVisible}
               onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, themedStyles.modalContainer]}>
              <ThemedText style={styles.modalTitle}>{i18n.t("changePwd.modal.title")}</ThemedText>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, themedStyles.button]}
                                  onPress={handleSendVerificationCode}>
                  <ThemedText style={styles.modalButtonText}>{i18n.t("changePwd.modal.resendBtn")}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, themedStyles.closeButton]}
                                  onPress={() => setModalVisible(false)}>
                  <ThemedText style={styles.modalButtonText}>{i18n.t("changePwd.modal.cancelBtn")}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAwareScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: height * 0.05,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    paddingVertical: height * 0.02,
    marginTop: height * 0.03,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  block: {
    paddingHorizontal: width * 0.04,
  },
  infoText: {
    fontSize: 12,
    marginBottom: width * 0.0001,
  },
  linkText: {
    fontSize: 12,
  },
  rowGroup: {
    flexDirection: 'row',
    marginTop: width * 0.0001,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign:'center',
  },
  errorBlock: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    alignItems: 'center',
  }
});

// Styles for dark and light mode
const lightStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primaryBtn,
  },
  input: {
    borderColor: '#00000',
    backgroundColor: Colors.light.greyBtn,
  },
  infoText: {
    color: Colors.light.infoText,
  },
  linkText: {
    color: Colors.light.linkText,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderColor: Colors.light.greyBtn,
  },
  closeButton: {
    backgroundColor: Colors.light.greyBtn,
  },
  errorBlock: {
    backgroundColor: Colors.light.errorBlock,
    borderColor: Colors.light.errorBlockBorder,
  },
});

const darkStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.primaryBtn,
  },
  input: {
    borderColor: '#fff',
    backgroundColor: Colors.dark.greyBtn,
  },
  infoText: {
    color: Colors.dark.infoText,
  },
  linkText: {
    color: Colors.dark.linkText,
  },
  modalContainer: {
    backgroundColor: '#000000',
    borderColor: Colors.dark.greyBtn,
  },
  closeButton: {
    backgroundColor: Colors.dark.greyBtn,
  },
  errorBlock: {
    backgroundColor: Colors.dark.errorBlock,
    borderColor: Colors.dark.errorBlockBorder,
  },
});