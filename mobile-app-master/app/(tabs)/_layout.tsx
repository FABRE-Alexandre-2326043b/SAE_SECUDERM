import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIconIonicons, TabBarIconMaterialCommunityIcons } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/languages/language-config';

/**
 * TabLayout component sets up the main tab-based navigation for the app.
 * It includes tabs for the bandage list, scanner, and user profile.
 * Icons and titles adjust based on the active state and theme.
 */

export default function TabLayout() {
  const colorScheme = useColorScheme(); // Determines the current color scheme (light or dark).

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // Sets the active tab color based on the theme.
        headerShown: false, // Hides the header for all tabs.
      }}
    >
      {/* Tab for the Bandage List screen */}
      <Tabs.Screen
        name="(bandage-list)" // Route name for the screen.
        options={{
          title: i18n.t("barItem.bandageList"), // Localized title for the tab.
          tabBarIcon: ({ color, focused }) => (
            // Displays a list icon that changes based on focus state.
            <TabBarIconIonicons name={focused ? 'list' : 'list-outline'} color={color} />
          ),
        }}
      />

      {/* Tab for the Scanner screen */}
      <Tabs.Screen
        name="(scanner)" // Route name for the scanner screen.
        options={{
          title: i18n.t("barItem.scan"), // Localized title for the tab.
          tabBarIcon: ({ color, focused }) => (
            // Displays a QR code icon that changes based on focus state.
            <TabBarIconMaterialCommunityIcons name={focused ? 'qrcode-scan' : 'qrcode'} color={color} />
          ),
        }}
      />

      {/* Tab for the Profile screen */}
      <Tabs.Screen
        name="(profile)" // Route name for the profile screen.
        options={{
          title: i18n.t("barItem.profile"), // Localized title for the tab.
          tabBarIcon: ({ color, focused }) => (
            // Displays a profile icon that changes based on focus state.
            <TabBarIconMaterialCommunityIcons name={focused ? 'account-circle' : 'account-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

