import { Href, router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, useColorScheme, Dimensions, Animated, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import BandageDetailsButton from "@/components/BandageDetailsButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ScrollView = Animated.ScrollView;
import ReturnButton from "@/components/ReturnButton";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import React, {useEffect, useState} from "react";
import i18n from "@/languages/language-config";
import {resetDeleteTreatmentPlaceStatus, selectDeleteStatus, selectTreatmentPlaces} from "@/store/treatmentPlace";
import { TabBarIconMaterialCommunityIcons } from "@/components/navigation/TabBarIcon";
import { Alert } from "react-native";
import {deleteTreatmentPlace} from "@/store/treatmentPlaceThunks";
import {useToast} from "@/hooks/useToast";

const { width, height } = Dimensions.get('window');

export default function BandageDetailsScreen () {
  let { uuid } = useLocalSearchParams(); // Retrieve the uuid parameter from the URL
  const treatmentPlaces = useAppSelector(selectTreatmentPlaces); // Access treatment places from Redux store

  // If uuid is an array, take the first value
  if (Array.isArray(uuid)) {
    uuid = uuid[0];
  }

  const { showToast } = useToast();

  const dispatch = useAppDispatch();
  const deleteTreatmentPlaceStatus = useAppSelector(selectDeleteStatus);

  const [selectedTreatmentPlace, setSelectedTreatmentPlace] = useState(treatmentPlaces.find((tp) => tp.id === uuid)); // State for the selected treatment place

  const colorScheme = useColorScheme(); // Get the current color scheme (light or dark)
  const iconColor = colorScheme === 'dark' ? 'white' : 'black'; // Set icon color based on the color scheme
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles; // Apply styles based on the color scheme

  const handleDelete = () => {
    Alert.alert(
      i18n.t("bandageDetails.alert.title"),
      i18n.t("bandageDetails.alert.content"),
      [
        {
          text: i18n.t("bandageDetails.alert.cancelBtn"),
          style: "cancel"
        },
        {
          text: i18n.t("bandageDetails.alert.deleteBtn"),
          style: "destructive",
          onPress: () => {
            dispatch(deleteTreatmentPlace(uuid as string));
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (deleteTreatmentPlaceStatus === 'succeeded') {
      dispatch(resetDeleteTreatmentPlaceStatus());
      router.push('/(tabs)/(bandage-list)');
    } else if (deleteTreatmentPlaceStatus === 'failed') {
      dispatch(resetDeleteTreatmentPlaceStatus()); // TODO - add toast message
    }
  }, [deleteTreatmentPlaceStatus]);

  if (!selectedTreatmentPlace) {
    router.navigate('/(tabs)/(bandage-list)');
  }

  return (
    <View style={styles.mainContainer}>
      <ReturnButton/>
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => router.push('/(tabs)/(bandage-list)/TutoBandageDetails')}>
        <MaterialCommunityIcons name="help-circle" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView>
        <View style={{
          alignItems:'center',
          marginBottom: height * 0.07,
        }}>
          <ThemedText style={{ fontSize: 20 }}>
            {i18n.t("bandageDetails.title")} {selectedTreatmentPlace?.label}
          </ThemedText>
        </View>
        <View style={styles.buttonsContainer}>
          <BandageDetailsButton
            uuid={Array.isArray(uuid) ? uuid[0] : uuid}
            text={i18n.t("bandageDetails.btn.doctor")}
            icon={<MaterialCommunityIcons name="stethoscope" size={24} color={iconColor} />}
            url={`/(bandage-list)/${uuid}/medical-follow-up` as Href}/>
          <BandageDetailsButton
            uuid={Array.isArray(uuid) ? uuid[0] : uuid}
            text={i18n.t("bandageDetails.btn.personal")}
            icon={<MaterialCommunityIcons name="note-text-outline" size={24} color={iconColor} />}
            url={`/(bandage-list)/${uuid}/personnal-follow-up` as Href}/>
          <BandageDetailsButton
            uuid={Array.isArray(uuid) ? uuid[0] : uuid}
            text={i18n.t("bandageDetails.btn.photo")}
            icon={<MaterialCommunityIcons name="camera" size={24} color={iconColor} />}
            url={`/(tabs)/(bandage-list)/${uuid}/add-image`}/>
          <BandageDetailsButton
            uuid={Array.isArray(uuid) ? uuid[0] : uuid}
            text={i18n.t("bandageDetails.btn.video")}
            icon={<MaterialCommunityIcons name="filmstrip" size={24} color={iconColor} />}
            url={`/(tabs)/(bandage-list)/${uuid}/add-video`}/>
          <BandageDetailsButton
            uuid={Array.isArray(uuid) ? uuid[0] : uuid}
            text={i18n.t("bandageDetails.btn.seeMedia")}
            icon={<MaterialCommunityIcons name="file-image" size={24} color={iconColor} />}
            url={`/(tabs)/(bandage-list)/${uuid}/see-media`}/>
          <BandageDetailsButton
            uuid={Array.isArray(uuid) ? uuid[0] : uuid}
            text={i18n.t("bandageDetails.btn.share")}
            icon={<MaterialCommunityIcons name="share-outline" size={24} color={iconColor} />}
            url={`/(bandage-list)/${uuid}/share-treatment-place`}/>
          <BandageDetailsButton
            uuid={Array.isArray(uuid) ? uuid[0] : uuid}
            text={i18n.t("bandageDetails.btn.shared")}
            icon={<MaterialCommunityIcons name="share-outline" size={24} color={iconColor} />}
            url={`/(bandage-list)/${uuid}/shared-treatment-places`}/>
          <BandageDetailsButton
            uuid={Array.isArray(uuid) ? uuid[0] : uuid}
            text={i18n.t("bandageDetails.btn.replace")}
            icon={<TabBarIconMaterialCommunityIcons name={'qrcode'} size={24} color={iconColor} />}
            url={`/(bandage-list)/${uuid}/replace-bandage`}/>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}>
            <MaterialCommunityIcons name="delete" size={24} color="white" />
            <ThemedText style={{ color: 'white', marginLeft: 8 }}>
              {i18n.t("bandageDetails.btn.delete")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  helpButton: {
    position: 'absolute',
    top: 35,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

const darkStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  helpButton: {
    position: 'absolute',
    top: height * 0.04,
    right: width * 0.05,
    backgroundColor: '#007AFF',
    borderRadius: width * 0.12,
    padding: width * 0.03,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    padding: width * 0.03,
    borderRadius: width * 0.02,
    marginTop: 10,
    marginBottom: height * 0.07,
  },
});
