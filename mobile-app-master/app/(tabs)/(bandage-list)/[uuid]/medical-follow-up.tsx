import { Href, Link, router, useLocalSearchParams } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import ReturnButton from "@/components/ReturnButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUserAuth } from "@/store/auth";
import { useEffect, useState } from "react";
import {
  clearPrescriptionPdf,
  resetPrescriptionPdfStatus,
  selectPrescriptionPdf,
  selectPrescriptionPdfStatus,
  selectPrescriptions,
  selectPrescriptionStatus
} from "@/store/prescription";
import {exportToPdf, getPrescription} from "@/store/prescriptionThunks";
import NotesItem from "@/components/NoteItem";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import i18n from "@/languages/language-config";
import { selectTreatmentPlaces } from "@/store/treatmentPlace";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');
/**
 * Screen component for displaying medical follow-up information.
 * Fetches and displays prescriptions related to a specific treatment place.
 * Allows adding new prescriptions if the user has the necessary permissions.
 */
export default function MedicalFollowUpScreen() {
  const { uuid } = useLocalSearchParams(); // Retrieve the uuid parameter from the URL

  const dispatch = useAppDispatch(); // Get the dispatch function for Redux actions
  const prescriptions = useAppSelector(selectPrescriptions); // Access prescriptions from Redux store
  const prescriptionStatus = useAppSelector(selectPrescriptionStatus); // Access the prescription fetch status from Redux store
  const user = useAppSelector(selectUserAuth); // Access the authenticated user from Redux store
  const treatmentPlaces = useAppSelector(selectTreatmentPlaces); // Access treatment places from Redux store

  const pdf = useAppSelector(selectPrescriptionPdf);
  const pdfStatus = useAppSelector(selectPrescriptionPdfStatus);

  const [selectedTreatmentPlace, setSelectedTreatmentPlace] = useState(treatmentPlaces.find((tp) => tp.id === uuid)); // State for selected treatment place

  useEffect(() => {
    handleGetPrescriptions(); // Fetch prescriptions when the component mounts
  }, []);

  useEffect(() => {
    if (pdfStatus === 'succeeded' && pdf) {
      const downloadAndSharePdf = async () => {
        const fileUri = FileSystem.documentDirectory + 'prescription.pdf';
        const base64Data = pdf.split(',')[1];
        await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Prescriptions PDF',
        });
      }
      downloadAndSharePdf().then(() => {
        dispatch(resetPrescriptionPdfStatus());
        dispatch(clearPrescriptionPdf());
      });
    }
  }, [pdfStatus, pdf]);

  // Function to handle fetching prescriptions based on uuid
  const handleGetPrescriptions = () => {
    if (user !== null) {
      if (typeof uuid === "string") {
        dispatch(getPrescription(uuid)); // Fetch prescription if uuid is a string
      }
      else if (Array.isArray(uuid)) {
        dispatch(getPrescription(uuid[0])); // Fetch prescription if uuid is an array
      }
      if (prescriptionStatus === 'succeeded') {
        console.log('Prescriptions fetched'); // Log when prescriptions are successfully fetched
      }
    }
  };

  const handleExportToPdf = () => {
    if (typeof uuid === "string") {
      dispatch(exportToPdf(uuid));
    } else if (Array.isArray(uuid)) {
      dispatch(exportToPdf(uuid[0]));
    }
  };

  const colorScheme = useColorScheme(); // Get the current color scheme (light or dark)
  const currentStyles = colorScheme === 'dark' ? darkStyles : lightStyles; // Apply styles based on color scheme

  let editable = false; // Variable to determine if the user has permission to edit
  if (user !== null) {
    editable = user.role === 'admin' || user.type === 'doctor'; // User can edit if they are an admin or doctor
  }

  return (
    <View style={currentStyles.mainContainer}>
      <View style={currentStyles.buttonsContainer}>
        <ReturnButton/>
        <View style={currentStyles.btnContainer}>
          {editable && (
            <Link href={`/(tabs)/(bandage-list)/${uuid}/add-prescriptions-modal` as Href} asChild>
              <TouchableOpacity style={currentStyles.addButton}>
                <ThemedText>{i18n.t("medicalFollow.addBtn")}</ThemedText>
              </TouchableOpacity>
            </Link>
          )}
          <TouchableOpacity style={currentStyles.exportButton} onPress={handleExportToPdf}>
            <ThemedText>{i18n.t("personalFollow.exportPdfBtn")}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={{ alignItems:'center', marginBottom: height * 0.07 }}>
          <ThemedText style={{ fontSize: 20 }}>
            {i18n.t("medicalFollow.title")} {selectedTreatmentPlace?.label}
          </ThemedText>
        </View>
        <View style={currentStyles.notesContainer}>
          {prescriptions.length === 0 ? (
            <ThemedText>{i18n.t("medicalFollow.noNotes")}</ThemedText>
          ) : (
            prescriptions.map((prescription) => (
              <NotesItem key={prescription.id} IsClientNote={false} prescription={prescription}/>
            ))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={currentStyles.helpButton} onPress={() => router.push('/(tabs)/(bandage-list)/TutoMedical')}>
        <MaterialCommunityIcons name="help-circle" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const sharedStyles = StyleSheet.create({
  // Shared styles for both light and dark themes
  mainContainer: {
    flex: 1,
  },
  notesContainer: {
    flex: 1,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.05,
    marginRight: width * 0.02,
    // backgroundColor: 'red',
    gap: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: height * 0.03,
    // marginBottom: height * 0.05,
    // marginRight: width * 0.02,
    borderWidth: 1,
    borderRadius: 25,
    width: width * 0.5,
    height: height * 0.048,
    paddingHorizontal: width * 0.03,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: height * 0.03,
    // marginBottom: height * 0.05,
    // marginRight: width * 0.02,
    borderWidth: 1,
    borderRadius: 25,
    width: width * 0.5,
    height: height * 0.048,
    paddingHorizontal: width * 0.03,
  },
  helpButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 10,
  },
});

const lightStyles = StyleSheet.create({
  ...sharedStyles,
  addButton: {
    ...sharedStyles.addButton,
    borderColor: 'black', // Add black border for light theme
  },
  exportButton: {
    ...sharedStyles.exportButton,
    borderColor: 'black', // Light theme border color for the export button
  },
});

const darkStyles = StyleSheet.create({
  ...sharedStyles,
  addButton: {
    ...sharedStyles.addButton,
    borderColor: 'white', // Add white border for dark theme
  },
  exportButton: {
    ...sharedStyles.exportButton,
    borderColor: 'white', // Dark theme border color for the export button
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
