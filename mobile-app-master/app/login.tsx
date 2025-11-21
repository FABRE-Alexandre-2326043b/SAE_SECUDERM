import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ThemedText } from "@/components/ThemedText";
import { Loading } from "@/components/Loading";
import { Link } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectError, selectStatus } from "@/store/auth";
import { login } from "@/store/authThunks";
import { Colors } from "@/constants/Colors";
import i18n from '@/languages/language-config';

/**
 * LoginScreen component enables users to log into their account.
 * It provides input fields for email and password, handles form submission,
 * and includes navigation links to reset the password or register a new account.
 */

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    // Dispatch the login action with the entered email and password
    dispatch(login({ email, password }));
  };

  const colorScheme = useColorScheme(); // Detect whether the app is in light or dark mode
  const isDarkMode = colorScheme === 'dark'; // Boolean for dark mode
  const currentStyles = isDarkMode ? darkStyles : lightStyles; // Dynamically choose styles based on the theme

  useEffect(() => {
    // Redirect the user upon successful login
    if (status === 'succeeded') {
      router.replace('/');
    }
  }, [status, router]);

  if (status === "loading") {
    // Display a loading spinner while the login process is ongoing
    return <Loading />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* Dismisses the keyboard when tapping outside input fields */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // Adjusts layout for the on-screen keyboard based on the platform
      >
        <View style={[styles.container]}>
          {/* Welcome message */}
          <ThemedText style={[styles.title]}>{i18n.t('login.welcome')}</ThemedText>
          {/* Subtitle prompting user to log in */}
          <ThemedText style={[styles.subtitle]}>{i18n.t('login.logAccount')}</ThemedText>

          {/* Display error message if login fails */}
          {status === "failed" && (
            <ThemedText style={[styles.errorText]}>
              {error ? error : "Unknown Error"}
            </ThemedText>
          )}

          {/* Email input field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentStyles.input]}
              onChangeText={setEmail}
              placeholder={i18n.t('login.emailPlaceholder')}
              textContentType="emailAddress"
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>

          {/* Password input field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentStyles.input]}
              onChangeText={setPassword}
              placeholder={i18n.t('login.pwdPlaceholder')}
              textContentType="password"
              secureTextEntry
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>

          {/* Link to reset password */}
          <Link style={[styles.forgetPs, currentStyles.forgetPs]} href="/forgotPwdEmail">
            {i18n.t('login.forgotPwd')}
          </Link>

          {/* Link to the registration screen */}
          <Link style={[styles.link, currentStyles.link]} href="/register">
            {i18n.t('login.registerLink')}
          </Link>

          {/* Button to initiate login */}
          <TouchableOpacity style={[styles.button, currentStyles.button]} onPress={handleLogin}>
            <ThemedText style={[styles.buttonText]}>{i18n.t('login.loginBtn')}</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: width * 0.06,
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
    marginBottom: height * 0.04,
    textAlign: "center",
  },
  errorText: {
    marginBottom: height * 0.02,
    textAlign: "center",
    fontSize: width * 0.04,
    color: "red",
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
  link: {
    marginTop: height * 0.02,
    marginLeft: width * 0.18,
    fontSize: width * 0.04,
    textAlign: "right",
    textDecorationLine: "underline",
  },
  forgetPs: {
    marginTop: height * 0.02,
    marginLeft: width * 0.55,
    fontSize: width * 0.04,
    textDecorationLine: "underline",
    textAlign: "right",
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
  link: {
    color: Colors.light.linkText,
  },
  forgetPs: {
    color: Colors.light.linkText,
  },
});

// Dark theme-specific styles
const darkStyles = StyleSheet.create({
  input: {
    backgroundColor: "#333333",
    borderColor: "#555",
    color: "#F2F2F2",
  },
  button: {
    backgroundColor: Colors.dark.primaryBtn,
  },
  link: {
    color: Colors.dark.linkText,
  },
  forgetPs: {
    color: Colors.dark.linkText,
  },
});
