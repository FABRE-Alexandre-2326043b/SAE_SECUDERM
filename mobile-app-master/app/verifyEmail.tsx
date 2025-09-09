import { View, StyleSheet, TextInput, TouchableOpacity, useColorScheme, Dimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import { ThemedText } from "@/components/ThemedText";
import ReturnButton from "@/components/ReturnButton";
import { useToast } from "@/hooks/useToast";
import { Loading } from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {verifyEmail} from "@/store/authThunks";
import {
  clearCreateAccount,
  selectCreateAccountEmail, selectCreateAccountEmailStatus, selectCreateAccountPassword
} from "@/store/auth";
import {Colors} from "@/constants/Colors";
import i18n from '@/languages/language-config';

/**
 * VerifyEmailScreen component handles the email verification process during account creation.
 * It allows users to input a verification code, and triggers email verification via Redux actions.
 * Success or error messages are shown based on the result of the verification.
 * UI adjusts according to the current color scheme (light/dark mode).
 */

export default function VerifyEmailScreen() {
  const router = useRouter(); // Router for navigation.

  // State to manage the input for the verification code.
  const [verificationCode, setVerificationCode] = useState("");

  // Selectors to retrieve data from the Redux store for email and password.
  const createAccountEmail = useAppSelector(selectCreateAccountEmail);
  const createAccountPassword = useAppSelector(selectCreateAccountPassword);

  // Determine the current color scheme and set appropriate styles.
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const currentStyles = isDarkMode ? darkStyles : lightStyles;

  // Redux hooks for dispatching actions and retrieving the email verification status.
  const dispatch = useAppDispatch();
  const createAccountEmailStatus = useAppSelector(selectCreateAccountEmailStatus);

  // Hook for displaying toast messages.
  const { showToast } = useToast();

  // Function to handle email verification.
  const handleVerifyEmail = () => {
    if (verificationCode) {
      // Dispatch the verifyEmail action with the email, password, and verification code.
      dispatch(verifyEmail({ password: createAccountPassword, email: createAccountEmail, code: verificationCode }));
    } else {
      // Display an error message if the verification code is empty.
      showToast("error", i18n.t("toastStatus.error"), i18n.t("verifyEmail.toast.fieldsError"));
    }
  };

  // Effect to handle the result of the email verification process.
  useEffect(() => {
    if (createAccountEmailStatus === "succeeded") {
      // If verification succeeded, display a success message and clear the Redux state.
      showToast("success", i18n.t("toastStatus.success"), i18n.t("verifyEmail.toast.emailStatus.success"));
      dispatch(clearCreateAccount());
      router.dismissAll(); // Navigate away after success.
    } else if (createAccountEmailStatus === "failed") {
      // If verification failed, display an error message and navigate back.
      showToast("error", i18n.t("toastStatus.error"), i18n.t("verifyEmail.toast.emailStatus.error"));
      router.dismiss();
    }
  }, [createAccountEmailStatus]);

  // Display a loading spinner if the verification process is ongoing.
  if (createAccountEmailStatus === "loading") {
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

          <ThemedText style={[styles.title]}>{i18n.t("verifyEmail.title")}: </ThemedText>
          <ThemedText style={[styles.title]}> {createAccountEmail} </ThemedText>
          <ThemedText style={[styles.subtitle]}>{i18n.t("verifyEmail.subtitle")} </ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentStyles.input]}
              placeholder={i18n.t("verifyEmail.verifCode")}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>

          <TouchableOpacity style={[styles.button, currentStyles.button]} onPress={handleVerifyEmail}>
            <ThemedText style={[styles.buttonText]}>{i18n.t("verifyEmail.sendBtn")}</ThemedText>
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
