import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LogoForHeader } from '@/components/LogoForHeader';
import { Colors } from "@/constants/Colors";
/**
 * This component defines the layout and navigation for the Bandage List screen.
 * It uses a Stack navigator to manage the different screens and their options.
 */
// This component defines the layout and navigation for the Bandage List screen.
export default function BandageListLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background,
        },
        headerTitleAlign: "center",
        headerTitle: () => <LogoForHeader />,
        headerBackVisible: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[uuid]/add-image"
                    options={{
                      presentation: "modal",
                      headerShown: false,
                    }}/>
      <Stack.Screen name="[uuid]/add-video"
                    options={{
                      presentation: "modal",
                      headerShown: false,
                    }}/>
      <Stack.Screen name="[uuid]/see-media"/>
      <Stack.Screen name="[uuid]/bandage-details" />
      <Stack.Screen name="[uuid]/medical-follow-up" />
      <Stack.Screen name="[uuid]/personnal-follow-up" />
      <Stack.Screen name="[uuid]/share-treatment-place" />
      <Stack.Screen name="[uuid]/replace-bandage" />
      <Stack.Screen name="[uuid]/shared-treatment-places" />
      <Stack.Screen name="[uuid]/add-notes-modal"
                    options={{
                      presentation: "modal",
                      headerShown: false,
                    }} />
      <Stack.Screen name="[uuid]/add-prescriptions-modal"
                    options={{
                      presentation: "modal",
                      headerShown: false,
                    }} />
    </Stack>
  );
}
