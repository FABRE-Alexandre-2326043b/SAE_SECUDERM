  import { Button, Dimensions, FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
  import BandageButton from "@/components/BandageButton";
  import { useAppDispatch, useAppSelector } from "@/store/hooks";
  import {resetAuthStatus, selectIsAuthenticated, selectStatus, selectUserAuth} from "@/store/auth";
  import { ThemedText } from "@/components/ThemedText";
  import { useIsFocused } from "@react-navigation/core";
  import { useEffect } from "react";
  import { Type } from "@/store/enums";
  import i18n from '@/languages/language-config';
  import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
  import { useRouter } from "expo-router";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { selectTreatmentPlaceFetchStatus, selectTreatmentPlaces } from "@/store/treatmentPlace";
  import { fetchTreatmentPlacesByClientId, fetchTreatmentPlacesByDoctorId } from "@/store/treatmentPlaceThunks";

  /**
   * Screen component for displaying a list of bandages.
   * Fetches and displays treatment places based on the authenticated user's type (doctor or client).
   * Provides a button to refresh the list and a help button to navigate to the tutorial.
   */
  // Get the window dimensions (width and height) for responsive design
  const { width, height } = Dimensions.get('window');

  export default function BandageListScreen() {
    const dispatch = useAppDispatch();
    const treatmentPlaces = useAppSelector(selectTreatmentPlaces);
    const treatmentPlacesFetchStatus = useAppSelector(selectTreatmentPlaceFetchStatus);
    const user = useAppSelector(selectUserAuth);
    const userIsAuth = useAppSelector(selectIsAuthenticated);
    const isFocused = useIsFocused(); // Check if the screen is focused (visible)
    const authStatus = useAppSelector(selectStatus)
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          router.replace("/login");
        }
      };
      checkAuth();
    }, []);

    useEffect(() => {
      if (isFocused) {
        // If the user is authenticated, fetch treatment places based on user type (doctor or client)
        if (userIsAuth && user !== null && user?.id !== undefined) {
          handleFetchTreatmentPlaces();
        }
      }
    }, [isFocused]);

    useEffect(() => {
      if (authStatus === 'failed') {
        dispatch(resetAuthStatus());
        router.replace('/login'); // Redirect to log in screen if authentication fails
      } else if (authStatus === 'succeeded') {
        handleFetchTreatmentPlaces();
      }
    }, [authStatus]);

    // Function to fetch treatment places based on the user's type (Doctor or Client)
    const handleFetchTreatmentPlaces = () => {
      if (user !== null && user?.id !== undefined) {
        if (user.type === Type.DOCTOR) {
          dispatch(fetchTreatmentPlacesByDoctorId(user.id)); // Fetch by doctor ID
          return;
        }
        dispatch(fetchTreatmentPlacesByClientId(user.id)); // Fetch by client ID
        // Log success when fetching treatment places
        if (treatmentPlacesFetchStatus === 'succeeded') {
          console.log('Treatment Places fetched');
        }
      }
    };

    // Function to render each treatment place as a button
    const renderItem = ({ item }: { item: { id: string; text: string } }) => (
      <BandageButton key={item.id} text={item.text} uuid={item.id} />
    );

    return (
      <View style={styles.container}>
        {treatmentPlaces.length === 0 ? (
          <View>
            <ThemedText>{i18n.t("indexBandages.noBandages")}</ThemedText>
            <Button title={i18n.t("indexBandages.refreshBtn")} onPress={handleFetchTreatmentPlaces} />
          </View>
        ) : (
          <FlatList
            data={treatmentPlaces.map((treatmentPlace) => ({ id: treatmentPlace.id, text: treatmentPlace.label }))}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
        <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(tabs)/(bandage-list)/TutoBandage')}>
          <MaterialCommunityIcons name="help-circle" size={width * 0.06} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    listContent: {
      alignItems: "center",
      marginTop: width * 0.05,
    },
    helpButton: {
      position: 'absolute',
      bottom: height * 0.03,
      right: width * 0.05,
      backgroundColor: '#007AFF',
      borderRadius: width * 0.12,
      padding: width * 0.03,
    },
  });
