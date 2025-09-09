import { View, StyleSheet, TextInput, TouchableOpacity, useColorScheme, Dimensions, KeyboardAvoidingView, Platform } from "react-native";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import ReturnButton from "@/components/ReturnButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { sendPasswordEmail } from "@/store/authThunks";
import { selectForgotPasswordEmailStatus, setResetPasswordEmail } from "@/store/auth";
import { useToast } from "@/hooks/useToast";
import { Loading } from "@/components/Loading";
import { Colors } from "@/constants/Colors";
import i18n from "@/languages/language-config";

/**
 * ForgotPwdEmail component allows users to request a password reset by entering their email.
 * It validates input, sends a reset email, and handles loading, success, and error states.
 */

export default function forgotPwdEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const currentStyles = isDarkMode ? darkStyles : lightStyles;
  const dispatch = useAppDispatch();
  const forgotPasswordEmailStatus = useAppSelector(selectForgotPasswordEmailStatus);
  const { showToast } = useToast();

  const handleSendCode = () => {
    // Verifies if an email is entered
    if (email) {
      // Sends an email to reset the password
      dispatch(sendPasswordEmail({ email, emailType: 'reset' }));
    } else {
      // Displays an error if the email field is empty
      showToast("error", i18n.t("toastStatus.success"), i18n.t("fgtPwd.toast.mailError"));
    }
  };

  useEffect(() => {
    // Monitors the status of the email sending process
    if (forgotPasswordEmailStatus === "succeeded") {
      // If the email was sent successfully
      dispatch(setResetPasswordEmail(email)); // Updates the email in the Redux store
      router.push("/resetPassword");
    } else if (forgotPasswordEmailStatus === "failed") {
      // If the email sending failed, show an error
      showToast("error", i18n.t("toastStatus.error"), i18n.t("fgtPwd.toast.failedStatus"));
    }
  }, [forgotPasswordEmailStatus]);

  if (forgotPasswordEmailStatus === "loading") {
    // Displays a loading screen while the email is being sent
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Ensures the screen occupies the entire available space
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjusts keyboard behavior based on the platform
    >
      <View style={[styles.container]}>
        {/* Button to return to the previous screen */}
        <ReturnButton />

        {/* Main title */}
        <ThemedText style={[styles.title]}>{i18n.t("fgtPwd.title")}</ThemedText>

        {/* Subtitle with explanation */}
        <ThemedText style={[styles.subtitle]}>
          {i18n.t("fgtPwd.subtitle")}
        </ThemedText>

        {/* Input field for email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, currentStyles.input]}
            placeholder={i18n.t("fgtPwd.email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
          />
        </View>

        {/* Button to send the email */}
        <TouchableOpacity
          style={[styles.button, currentStyles.button]}
          onPress={handleSendCode}
        >
          <ThemedText style={[styles.buttonText]}>{i18n.t("fgtPwd.sendBtn")}</ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get("window");

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
    marginTop: height * 0.06,
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
