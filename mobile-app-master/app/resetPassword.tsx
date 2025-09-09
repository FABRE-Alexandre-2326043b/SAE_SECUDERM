import { View, StyleSheet, TextInput, TouchableOpacity, useColorScheme, Dimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import { ThemedText } from "@/components/ThemedText";
import ReturnButton from "@/components/ReturnButton";
import { useToast } from "@/hooks/useToast";
import { Loading } from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPassword } from "@/store/authThunks";
import {clearResetPasswordEmail, selectResetPasswordEmail, selectResetPasswordStatus} from "@/store/auth";
import {Colors} from "@/constants/Colors";
import i18n from '@/languages/language-config';
/**
 * ResetPasswordScreen component manages the UI and logic for resetting a user's password.
 * It includes input fields for verification code, new password, and confirmation password.
 * The screen also handles form validation, dispatches actions, and displays success/error messages.
 * UI adjusts according to the current color scheme (light/dark mode).
 */

export default function ResetPasswordScreen() {
  // React Router hook to navigate between screens.
  const router = useRouter();

  // States to manage form inputs and error messages.
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const resetPasswordEmail = useAppSelector(selectResetPasswordEmail); // Email retrieved from the Redux store.
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Determine the current color scheme (light or dark mode).
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const currentStyles = isDarkMode ? darkStyles : lightStyles;

  // Redux hooks to dispatch actions and get the current status of resetPassword.
  const dispatch = useAppDispatch();
  const resetPasswordStatus = useAppSelector(selectResetPasswordStatus);
  const { showToast } = useToast();

  // Function to handle the password reset process.
  const handleResetPassword = () => {
    // Check if all required fields are filled.
    if (verificationCode && newPassword) {
      // Dispatch the reset password action.
      dispatch(resetPassword({ password: newPassword, email: resetPasswordEmail, code: verificationCode }));
    } else {
      // Show an error toast if fields are incomplete.
      showToast("error", i18n.t("toastStatus.error"), i18n.t("resetPwd.toast.fieldsError"));
    }

    // Validate if the new password matches the confirmation password.
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
  };

  // Effect to handle the result of the password reset process.
  useEffect(() => {
    if (resetPasswordStatus === "succeeded") {
      // Display success message and clear the email from the Redux store.
      showToast("success", i18n.t("toastStatus.success"), i18n.t("resetPwd.toast.pwdStatus.success"));
      dispatch(clearResetPasswordEmail());
      router.dismissAll(); // Navigate away after successful reset.
    } else if (resetPasswordStatus === "failed") {
      // Display error message and navigate away.
      showToast("error", i18n.t("toastStatus.error"), i18n.t("resetPwd.toast.pwdStatus.error"));
      router.dismiss();
    }
  }, [resetPasswordStatus]);

  // Display a loading spinner if the process is ongoing.
  if (resetPasswordStatus === "loading") {
    return <Loading />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.container]}>
          <ReturnButton />
          <ThemedText style={[styles.title]}>{i18n.t("resetPwd.title")}</ThemedText>
          <ThemedText style={[styles.subtitle]}>{i18n.t("resetPwd.subtitle")}</ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentStyles.input]}
              placeholder={i18n.t("resetPwd.codeInput")}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentStyles.input]}
              placeholder={i18n.t("resetPwd.newPwd")}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentStyles.input]}
              placeholder={i18n.t("resetPwd.confirmPwd")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>

          <TouchableOpacity style={[styles.button]} onPress={handleResetPassword}>
            <ThemedText style={[styles.buttonText]}>{i18n.t("resetPwd.resetBtn")}</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// Retrieve the screen dimensions for responsive styling.
const { width, height } = Dimensions.get("window");

// Common styles for the screen layout.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    marginTop: height * 0.02,
    marginBottom: height * 0.05,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: height * 0.025,
  },
  input: {
    height: height * 0.065,
    borderRadius: height * 0.03,
    borderWidth: 1,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.045,
  },
  button: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: height * 0.03,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  buttonText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
});

// Light mode specific styles.
const lightStyles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    color: "#333",
  },
  button: {
    backgroundColor: Colors.light.primaryBtn,
  },
});

// Dark mode specific styles.
const darkStyles = StyleSheet.create({
  input: {
    backgroundColor: "#333333",
    borderColor: "#555",
    color: "#F2F2F2",
  },
  button: {
    backgroundColor: Colors.dark.primaryBtn,
  },
});
