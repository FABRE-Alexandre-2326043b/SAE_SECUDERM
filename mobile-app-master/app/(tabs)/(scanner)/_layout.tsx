import { Stack } from 'expo-router';
import {useColorScheme} from "@/hooks/useColorScheme";
import {Colors} from "@/constants/Colors";
import {LogoForHeader} from "@/components/LogoForHeader";
/**
 * ScannerLayout component defines the layout and navigation for the Scanner screen.
 * It uses a Stack navigator to manage the different screens and their options.
 */
export default function ScannerLayout() {
  return (
    <Stack
      screenOptions={{
        // Sets the background color of the header based on the current color scheme.
        headerStyle: {
          backgroundColor: useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background,
        },
        headerTitleAlign: "center", // Centers the header title for a cleaner look.
        headerTitle: () => <LogoForHeader/>, // Replaces the default title with a custom logo component.
        headerBackVisible: false, // Hides the back button for all screens in this stack.
      }}
    >
      {/* Default screen for this stack (e.g., the scanner home page). */}
      <Stack.Screen name="index"/>

      {/* Screen for the scanner tutorial. */}
      <Stack.Screen name="TutoScanner"/>
    </Stack>
  );
}
