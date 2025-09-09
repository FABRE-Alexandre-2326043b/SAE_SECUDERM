import { Href, Link, router, useLocalSearchParams } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import ReturnButton from "@/components/ReturnButton";
import NotesItem from "@/components/NoteItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearPdf,
  resetPdfStatus,
  selectClientNotes,
  selectClientNotesStatus,
  selectPdf,
  selectPdfStatus
} from "@/store/clientNotes";
import { selectUserAuth } from "@/store/auth";
import { useEffect, useState } from "react";
import { getNotes, exportToPdf } from "@/store/clientNotesThunks";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import i18n from "@/languages/language-config";
import { selectTreatmentPlaces } from "@/store/treatmentPlace";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

export default function PersonnalFollowUpScreen() {
  let { uuid } = useLocalSearchParams(); // Retrieve the uuid parameter from the URL

  const dispatch = useAppDispatch(); // Get the dispatch function from Redux
  const clientNotes = useAppSelector(selectClientNotes); // Access client notes from Redux store
  const clientNotesStatus = useAppSelector(selectClientNotesStatus); // Access client notes fetch status from Redux store
  const user = useAppSelector(selectUserAuth); // Access authenticated user from Redux store
  const treatmentPlaces = useAppSelector(selectTreatmentPlaces); // Access treatment places from Redux store

  const pdf = useAppSelector(selectPdf);
  const pdfStatus = useAppSelector(selectPdfStatus);

  // State for selected treatment place based on uuid and client_id
  const [selectedTreatmentPlace, setSelectedTreatmentPlace] = useState(treatmentPlaces.find((tp) => tp.id === uuid));

  // State to check if the user has permission to edit the notes
  const [editable, setEditable] = useState(false);

  // useEffect to fetch client notes when the component mounts
  useEffect(() => {
    handleGetNotes(); // Fetch notes when the component is mounted
  }, []);

  // useEffect to determine if the user is authorized to edit the notes
  useEffect(() => {
    setEditable(user?.id === selectedTreatmentPlace?.client_id); // Set editable if user is the same as the client linked to the treatment place
  }, [clientNotes]);

  // useEffect to handle PDF download and sharing
  useEffect(() => {
    if (pdfStatus === 'succeeded' && pdf) {
      const downloadAndSharePdf = async () => {
        const fileUri = FileSystem.documentDirectory + 'client_notes.pdf';
        const base64Data = pdf.split(',')[1]; // Remove the data URL prefix
        await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Client Notes PDF',
        });
      };
      downloadAndSharePdf().then(() => {
        dispatch(resetPdfStatus());
        dispatch(clearPdf());
      });
    }
  }, [pdfStatus, pdf]);

  /**
   * Function to fetch client notes based on uuid.
   * Dispatches an action to get notes from the Redux store.
   */

  // Function to fetch client notes based on uuid
  const handleGetNotes = () => {
    if (user !== null) {
      if (typeof uuid === "string") {
        dispatch(getNotes(uuid)); // Dispatch action to get notes by uuid
      } else if (Array.isArray(uuid)) {
        dispatch(getNotes(uuid[0])); // If uuid is an array, dispatch action with the first element
      }
      if (clientNotesStatus === 'succeeded') {
        console.log('Notes fetched'); // Log message when notes are fetched successfully
      }
    }
  };

  // Function to handle PDF export
  const handleExportToPdf = () => {
    if (typeof uuid === "string") {
      dispatch(exportToPdf(uuid));
    } else if (Array.isArray(uuid)) {
      dispatch(exportToPdf(uuid[0]));
    }
  };

  const colorScheme = useColorScheme(); // Get the current color scheme (light or dark)
  const currentStyles = colorScheme === 'dark' ? darkStyles : lightStyles; // Apply styles based on color scheme

  return (
    <View style={currentStyles.mainContainer}>
      <View style={currentStyles.buttonsContainer}>
        <ReturnButton />
        <View style={currentStyles.btnContainer}>
          {editable && (
            <Link href={`/(tabs)/(bandage-list)/${uuid}/add-notes-modal`} asChild>
              <TouchableOpacity style={currentStyles.addButton}>
                <ThemedText>{i18n.t("personalFollow.addBtn")}</ThemedText>
              </TouchableOpacity>
            </Link>
          )}
          <TouchableOpacity style={currentStyles.exportButton} onPress={handleExportToPdf}>
            <ThemedText>{i18n.t("personalFollow.exportPdfBtn")}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={{
          alignItems: 'center',
          marginBottom: height * 0.07,
        }}>
          <ThemedText style={{ fontSize: 20 }}>
            {i18n.t("personalFollow.title")} : {selectedTreatmentPlace?.label}
          </ThemedText>
        </View>
        <View style={currentStyles.notesContainer}>
          {clientNotes.length === 0 ? (
            <ThemedText>{i18n.t("personalFollow.noNotes")}</ThemedText>
          ) : (
            clientNotes.map((note) => (
              <NotesItem key={note.id} IsClientNote={true} clientNote={note} />
            ))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={currentStyles.helpButton} onPress={() => router.push('/(tabs)/(bandage-list)/TutoPersonnal')}>
        <MaterialCommunityIcons name="help-circle" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// Shared styles for the component
const styles = StyleSheet.create({
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
    width: 'auto',
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
    width: 'auto',
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
  ...styles,
  addButton: {
    ...styles.addButton,
    borderColor: 'black', // Light theme border color for the add button
  },
  exportButton: {
    ...styles.exportButton,
    borderColor: 'black', // Light theme border color for the export button
  },
});

const darkStyles = StyleSheet.create({
  ...styles,
  addButton: {
    ...styles.addButton,
    borderColor: 'white', // Dark theme border color for the add button
  },
  exportButton: {
    ...styles.exportButton,
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
