import {
  View,
  StyleSheet,
  TextInput,
  useColorScheme,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
  ScrollView,

} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCreateAccountEmailStatus,
  selectCreateAccountEmailStatus,
  selectError,
  setCreateAccount,
} from "@/store/auth";
import { register } from "@/store/authThunks";
import { Loading } from "@/components/Loading";
import { Colors } from "@/constants/Colors";
import i18n from "@/languages/language-config";
import { Checkbox } from "react-native-paper";
/**
 * RegisterScreen component facilitates user registration by capturing their first name, last name, email, and password.
 * It manages form input, displays validation or error messages, and redirects the user upon successful registration.
 * Links to the login page are also provided for easy navigation.
 */

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCreateAccountEmailStatus); // Status of the account creation process
  const error = useAppSelector(selectError); // Error message in case of an issue
  const router = useRouter();

  // States controlling the values of the form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [showCGU, setShowCGU] = useState(false);
  const [cguError, setCguError] = useState(false);

  const handleRegister = () => {
    if (!acceptCGU) {
      // Affichez simplement un message à l'utilisateur
      alert(i18n.t("error.acceptTerms") || "Veuillez accepter les conditions d'utilisation");
      return;
    }

    // Sends information to register the account
    dispatch(setCreateAccount({ email, password }));
    dispatch(register({ first_name: firstName, last_name: lastName, email, password }));
  };

  const colorScheme = useColorScheme(); // Detects the system theme (light or dark)
  const isDarkMode = colorScheme === 'dark';
  const currentStyles = isDarkMode ? darkStyles : lightStyles; // Applies styles based on the theme

  useEffect(() => {
    if (status === 'succeeded') {
      // On success, redirect to the email verification page
      dispatch(clearCreateAccountEmailStatus()); // Resets the status
      router.navigate('/verifyEmail'); // Navigate to the verification page
    }
  }, [status]);

  if (status === "loading") {
    return <Loading />; // Displays a loading indicator
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Keyboard adjustment for iOS/Android
      >
        <View style={[styles.container]}>

          <Modal
              visible={showCGU}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowCGU(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ThemedText style={styles.modalTitle}>{i18n.t("terms.title")}</ThemedText>

                <ScrollView style={styles.modalScroll}>
                  <ThemedText style={styles.modalText}>
                    {i18n.t("terms.content")}
                  </ThemedText>
                </ScrollView>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowCGU(false)}
                >
                  <ThemedText style={styles.closeButtonText}>
                    {i18n.t("common.close")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Page title */}
          <ThemedText style={[styles.title]}>{i18n.t("register.title")}</ThemedText>

          {/* Error message if creation fails */}
          {status === 'failed' && (
            <ThemedText style={styles.errorText}>
              {error || 'Une erreur inconnue est survenue'}
            </ThemedText>
          )}

          {/* Field for first name */}
          <View style={styles.inputContainer}>
            <ThemedText style={currentStyles.label}>{i18n.t("register.firstName")}</ThemedText>
            <TextInput
              style={[styles.input, currentStyles.input]}
              onChangeText={setFirstName} // Updates the first name state
              placeholder={i18n.t("register.firstName")}
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"} // Adapts placeholder color based on the theme
            />
          </View>

          {/* Field for last name */}
          <View style={styles.inputContainer}>
            <ThemedText style={currentStyles.label}>{i18n.t("register.lastName")}</ThemedText>
            <TextInput
              style={[styles.input, currentStyles.input]}
              onChangeText={setLastName} // Updates the last name state
              placeholder={i18n.t("register.lastName")}
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>

          {/* Field for email */}
          <View style={styles.inputContainer}>
            <ThemedText style={currentStyles.label}>{i18n.t("register.email")}</ThemedText>
            <TextInput
              style={[styles.input, currentStyles.input]}
              onChangeText={setEmail} // Updates the email state
              placeholder={i18n.t("register.email")}
              textContentType="emailAddress" // Specific input type for emails
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>

          {/* Field for password */}
          <View style={styles.inputContainer}>
            <ThemedText style={currentStyles.label}>{i18n.t("register.pwd")}</ThemedText>
            <TextInput
              style={[styles.input, currentStyles.input]}
              onChangeText={setPassword} // Updates the password state
              placeholder={i18n.t("register.pwd")}
              textContentType="password"
              secureTextEntry // Masks the password
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            />
          </View>

          {/* La case à cocher des CGU */}
          <View style={styles.checkboxContainer}>
            <Checkbox
                status={acceptCGU ? 'checked' : 'unchecked'}
                onPress={() => setAcceptCGU(!acceptCGU)}
                color='#0066FF'
            />
            <TouchableOpacity onPress={() => setShowCGU(true)}>
              <ThemedText style={styles.termsText}>
                {i18n.t("terms.accept")}
              </ThemedText>
            </TouchableOpacity>
          </View>
          {/* Affichage du message d'erreur si nécessaire */}
          {!acceptCGU && cguError && (
              <ThemedText style={styles.errorText}>
                {i18n.t("error.acceptTerms") || "Veuillez accepter les conditions d'utilisation"}
              </ThemedText>
          )}

          {/* Link to redirect to the login page */}
          <Link style={[styles.link, currentStyles.link]} href="/login">{i18n.t("register.loginLink")}</Link>

          {/* Button to submit the form */}
          <TouchableOpacity style={[styles.button, currentStyles.button]} onPress={handleRegister}>
            <ThemedText style={[styles.buttonText]}>{i18n.t("register.registerBtn")}</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// Responsive dimensions
const { width, height } = Dimensions.get("window");

// Common styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.04,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  input: {
    height: height * 0.06,
    borderRadius: height * 0.015,
    borderWidth: 1,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: "bold",
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  link: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    marginLeft: width * 0.65,
    textAlign: "right",
    textDecorationLine: "underline",
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
  disabledButton: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.dark.background,
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    // Si vous utilisez des thèmes sombres/clairs, ajustez la couleur de fond ici
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalText: {
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: Colors.light.tint, // Utilisez votre couleur de thème
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#0066FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },


});

// Light theme styles
const lightStyles = StyleSheet.create({
  label: {
    color: "#555",
    marginBottom: height * 0.005,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    color: "#333",
  },
  link: {
    color: Colors.light.linkText,
  },
  button: {
    backgroundColor: Colors.light.primaryBtn,
  },
});

// Dark theme styles
const darkStyles = StyleSheet.create({
  label: {
    color: "#B0B0B0",
    marginBottom: height * 0.005,
  },
  input: {
    backgroundColor: "#333333",
    borderColor: "#555",
    color: "#F2F2F2",
  },
  link: {
    color: Colors.dark.linkText,
  },
  button: {
    backgroundColor: Colors.dark.primaryBtn,
  },
});
