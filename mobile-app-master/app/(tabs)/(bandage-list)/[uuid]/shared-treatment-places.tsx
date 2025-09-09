import { Button, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUserAuth } from "@/store/auth";
import {
  resetRemoveSharedTreatmentPlaceStatus,
  selectRemoveSharedTreatmentPlaceStatus,
  selectSharedTreatmentPlaces,
  selectTreatmentPlaceFetchStatus
} from "@/store/treatmentPlace";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { fetchSharedTreatmentPlaces, removeSharedTreatmentPlace } from "@/store/treatmentPlaceThunks";
import { Loading } from "@/components/Loading";
import ReturnButton from "@/components/ReturnButton";
import i18n from "@/languages/language-config";
import { useToast } from "@/hooks/useToast";

const { height } = Dimensions.get('window');
/**
 * Component to display and manage shared treatment places.
 * Fetches shared treatment places and allows the user to remove them.
 */
export default function SharedTreatmentPlaces() {
  const { uuid } = useLocalSearchParams(); // Get the treatment place UUID from URL parameters

  const { showToast } = useToast(); // Custom hook to show toast notifications

  const dispatch = useAppDispatch(); // Redux dispatch function to dispatch actions
  const user = useAppSelector(selectUserAuth); // Select user authentication data from the store
  const sharedTreatmentPlaces = useAppSelector(selectSharedTreatmentPlaces); // Select the shared treatment places from the store
  const sharedTreatmentPlacesFetchStatus = useAppSelector(selectTreatmentPlaceFetchStatus); // Fetch status for treatment places
  const removeSharedTreatmentPlaceStatus = useAppSelector(selectRemoveSharedTreatmentPlaceStatus); // Fetch status for removing a shared treatment place

  // Fetch shared treatment places when the component is first mounted
  useEffect(() => {
    dispatch(fetchSharedTreatmentPlaces(uuid as string)); // Dispatch action to fetch shared treatment places
  }, []);

  // Effect to handle the result of removing a shared treatment place
  useEffect(() => {
    if (removeSharedTreatmentPlaceStatus === 'succeeded') {
      showToast('info', i18n.t('toastStatus.info'), i18n.t('sharedTreatmentPlaces.toast.removeSuccess'));
      dispatch(fetchSharedTreatmentPlaces(uuid as string)); // Re-fetch shared treatment places after removal
      dispatch(resetRemoveSharedTreatmentPlaceStatus()); // Reset the removal status
    } else if (removeSharedTreatmentPlaceStatus === 'failed') {
      showToast('error', i18n.t('toastStatus.error'), i18n.t('sharedTreatmentPlaces.toast.removeFailed'));
      dispatch(resetRemoveSharedTreatmentPlaceStatus()); // Reset the removal status
    }
  }, [removeSharedTreatmentPlaceStatus]); // Run this effect when the remove status changes

  // Show loading spinner while fetching shared treatment places
  if (sharedTreatmentPlacesFetchStatus === 'loading') {
    return <Loading />;
  }

  // Show message when no shared treatment places are available
  if (sharedTreatmentPlaces.length === 0) {
    return (
      <View style={styles.headerContainer}>
        <ReturnButton />
        <View style={styles.centeredContainer}>
          <ThemedText style={styles.centeredText}>{i18n.t('sharedTreatmentPlaces.emptyList')}</ThemedText>
        </View>
      </View>
    );
  }

  // Render each shared treatment place in the list
  const renderItem = ({ item }: { item: { id: string; doctor: { first_name: string; last_name: string } } }) => (
    <View style={styles.itemContainer}>
      <ThemedText>{`${item.doctor.first_name} ${item.doctor.last_name}`}</ThemedText>
      <Button title={i18n.t('sharedTreatmentPlaces.btn.remove')} onPress={() => handleRemove(item.id)} />
    </View>
  );

  // Function to handle removal of a shared treatment place
  const handleRemove = (id: string) => {
    console.log('remove', id); // Log the ID of the treatment place to be removed
    dispatch(removeSharedTreatmentPlace(id)); // Dispatch action to remove shared treatment place
  };

  return (
    <View style={styles.headerContainer}>
      <ReturnButton />
      <View>

        <FlatList
          data={sharedTreatmentPlaces}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    fontSize: 18,
    color: '#888',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listContent: {
    padding: 20,
    height: height * 0.8,
  },
});
