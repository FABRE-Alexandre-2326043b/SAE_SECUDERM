import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { setToken } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { setToken as setTokenStore } from '@/store/auth';
import { loadLanguage } from '@/languages/language-config';

import { useColorScheme } from '@/hooks/useColorScheme';
import {me} from "@/store/authThunks";
import {DarkThemeSecuderm} from "@/constants/DarkThemeSecuderm";

// Prevents the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
/**
 * RootLayout component initializes the application, manages theme settings, and handles navigation.
 * It ensures fonts, language configurations, and user authentication are loaded before rendering the main content.
 */

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Detects whether the theme is light or dark.
  const router = useRouter(); // Handles navigation between screens.
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // Loads a custom font.
  });
  const [isLogged, setIsLogged] = useState(false); // Tracks the user's authentication state.

  useEffect(() => {
    const loadToken = async () => {
      // Retrieves the authentication token from local storage.
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setToken(token); // Sets the token for API requests.
        store.dispatch(setTokenStore(token)); // Updates the Redux store with the token.
        setIsLogged(true); // Marks the user as logged in.
      } else {
        setIsLogged(false); // No token found, user is not logged in.
      }
    };

    // Loads the configured language.
    loadLanguage();

    // Loads the authentication token.
    loadToken();

    // Hides the splash screen once the fonts are fully loaded.
    if (loaded) {
      SplashScreen.hideAsync();
    }

    // Redirects to the login screen if fonts are loaded but the user is not logged in.
    if (loaded && !isLogged) {
      router.replace('/login');
    } else if (loaded && isLogged) {
      store.dispatch(me()); // Fetches the user's data.
      // router.replace('/'); // It redirects already by default to the tabs
    }
  }, [loaded]);

  // Returns null until the fonts are fully loaded.
  if (!loaded) {
    return null;
  }

  return (
    // Provides the Redux store to the entire application.
    <Provider store={store}>
      {/* Applies the theme based on the color scheme. */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkThemeSecuderm : DefaultTheme}>
        <Stack>
          {/* Defines various routes and their options. */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
          <Stack.Screen name="login" options={{ headerShown: false }}/>
          <Stack.Screen name="register" options={{ headerShown: false }}/>
          <Stack.Screen name="resetPassword" options={{ headerShown: false }}/>
          <Stack.Screen name="forgotPwdEmail" options={{ headerShown: false }}/>
          <Stack.Screen name="verifyEmail" options={{ headerShown: false }}/>
          <Stack.Screen name="+not-found"/>
        </Stack>
        {/* Includes a component for displaying toast messages. */}
        <Toast />
      </ThemeProvider>
    </Provider>
  );
}
