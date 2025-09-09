// app/terms-conditions.tsx
import { View, ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import i18n from "@/languages/language-config";
import { Stack } from "expo-router";

export default function TermsAndConditionsScreen() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: i18n.t("terms.title") }} />
            <ScrollView>
                <ThemedText style={styles.title}>{i18n.t("terms.title")}</ThemedText>
                <ThemedText style={styles.content}>
                    {i18n.t("terms.content")}
                </ThemedText>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
});