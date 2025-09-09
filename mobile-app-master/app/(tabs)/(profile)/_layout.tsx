import { Stack } from 'expo-router';
import { useColorScheme} from '@/hooks/useColorScheme';
import { LogoForHeader } from '@/components/LogoForHeader';
import {Colors} from "@/constants/Colors";
/**
 * ProfileLayout component defines the layout and navigation for the Profile screen.
 * It uses a Stack navigator to manage the different screens and their options.
 */
export default function ProfileLayout(){
  return (
    <Stack
      screenOptions={{
        // Setting the header style based on the current color scheme (light or dark).
        headerStyle: {
          backgroundColor: useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background,
        },
        // Center-aligning the title in the header.
        headerTitleAlign: "center",
        // Setting the header title to be the custom LogoForHeader component.
        headerTitle: () => <LogoForHeader/>,
        // Hiding the back button in the header.
        headerBackVisible: false,
      }}>
      {/* Defining the main screen of the profile layout (index page). */}
      <Stack.Screen name="index"/>
      {/* Defining the screen for the logout page, with modal presentation and no header shown. */}
      <Stack.Screen name="(settings)/logout"
                    options={{
                      presentation: 'modal',
                      headerShown: false,  // Hiding the header for this screen.
                    }}
      />
      {/* Defining the screen for changing language settings in the profile layout. */}
      <Stack.Screen name="(settings)/language"/>
      {/* Defining the screen for modifying user information in the profile layout. */}
      <Stack.Screen name="(modify-my-information)/modify-my-information"/>
      {/* Defining the screen for changing the password in the profile layout. */}
      <Stack.Screen name="(modify-my-information)/change-password-page"/>



    </Stack>
  )
}
