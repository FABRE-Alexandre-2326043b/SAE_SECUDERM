import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
/**
 * NotFoundScreen component is displayed when the user navigates to an undefined route.
 * It provides a message about the missing screen and a link to return to the home screen.
 */

export default function NotFoundScreen() {
  return (
    <>
      {/* Sets the screen title in the navigation stack to "Oops!" */}
      <Stack.Screen options={{ title: 'Oops!' }} />

      {/* A themed container view for the screen's content */}
      <ThemedView style={styles.container}>
        {/* Displays a message indicating the screen doesn't exist */}
        <ThemedText type="title">This screen doesn't exist.</ThemedText>

        {/* A link to navigate back to the home screen */}
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

// Styles for the "Not Found" screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
