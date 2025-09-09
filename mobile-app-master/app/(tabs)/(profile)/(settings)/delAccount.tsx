import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import i18n from '@/languages/language-config';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { logout } from "@/store/auth";
import { api } from '@/services/api';

/**
 * DelAccount - Écran de suppression de compte utilisateur
 */
export default function DelAccount() {
    const params = useLocalSearchParams();
    const uuid = params.uuid as string;
    const router = useRouter();
    const dispatch = useDispatch();
    const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#121212' }, 'background');
    const [isDeleting, setIsDeleting] = useState(false);

    // Couleur rouge pour les actions dangereuses
    const dangerColor = '#FF3B30';

    // Gérer la suppression du compte
    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);

            // Appel API pour supprimer le compte utilisateur
            await api.delete(`/users/${uuid}`);

            // Redirection vers l'écran de connexion après suppression
            dispatch(logout());
            router.replace('/login');
        } catch (error) {
            Alert.alert(
                i18n.t('common.error', { defaultValue: 'Erreur' }),
                i18n.t('account.deleteError', { defaultValue: 'Impossible de supprimer le compte' }),
                [{ text: i18n.t('common.ok', { defaultValue: 'OK' }) }]
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // Afficher une confirmation avant de supprimer
    const confirmDelete = () => {
        // Utilisation de la fonction Alert.alert pour afficher une boîte de dialogue
        Alert.alert(
            // Titre de la boîte de dialogue (traduit via i18n)
            i18n.t('account.confirmDeleteTitle', { defaultValue: 'Confirmation' }),

            // Message explicatif dans la boîte de dialogue (traduit via i18n)
            i18n.t('account.confirmDeleteMessage', {
                defaultValue: 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.'
            }),

            // Boutons dans la boîte de dialogue (un tableau d'objets)
            [
                // Premier bouton : Annuler (permet à l'utilisateur d'annuler l'action)
                {
                    text: i18n.t('common.cancel', { defaultValue: 'Annuler' }),
                    style: 'cancel', // Style standard pour un bouton d'annulation
                },

                // Deuxième bouton : Supprimer (déclenche la suppression effective du compte)
                {
                    text: i18n.t('account.confirmDelete', { defaultValue: 'Supprimer' }),
                    style: 'destructive', // Style rouge pour indiquer une action dangereuse
                    onPress: handleDeleteAccount, // Appelle la fonction qui supprime réellement le compte
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen
                options={{
                    title: i18n.t('account.deleteAccount', { defaultValue: 'Supprimer le compte' }),
                    headerBackVisible: true,
                }}
            />

            <View style={styles.content}>
                <Feather name="alert-triangle" size={64} color={dangerColor} style={styles.icon} />

                <ThemedText style={styles.title}>
                    {i18n.t('account.deleteTitle', { defaultValue: 'Supprimer votre compte' })}
                </ThemedText>

                <ThemedText style={styles.message}>
                    {i18n.t('account.deleteMessage', {
                        defaultValue: 'Vous êtes sur le point de supprimer définitivement votre compte. Cette action supprimera toutes vos données personnelles.'
                    })}
                </ThemedText>

                <ThemedText style={[styles.warning, { color: dangerColor }]}>
                    {i18n.t('account.deleteWarning', {
                        defaultValue: 'Cette action est irréversible et vos données ne pourront pas être récupérées.'
                    })}
                </ThemedText>

                {/* Le bouton de suppression qui était manquant */}
                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: dangerColor }]}
                    onPress={confirmDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <ThemedText style={styles.deleteButtonText}>
                            {i18n.t('account.delete', { defaultValue: 'Supprimer mon compte' })}
                        </ThemedText>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },
    warning: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    deleteButton: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});