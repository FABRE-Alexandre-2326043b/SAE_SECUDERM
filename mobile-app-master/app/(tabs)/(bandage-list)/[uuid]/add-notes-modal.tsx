import React, { useState } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import ReturnButton from "@/components/ReturnButton";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectClientNotesStatus } from "@/store/clientNotes";
import { createNote } from "@/store/clientNotesThunks";
import { Colors } from "@/constants/Colors";
import i18n from "@/languages/language-config";
import { useToast } from "@/hooks/useToast";

// Get the window dimensions for responsive styling
const { width, height } = Dimensions.get("window");

export default function AddNotesModal() {
  const { uuid } = useLocalSearchParams(); // Fetch the UUID from the route parameters
  const colorScheme = useColorScheme(); // Get the current color scheme (dark or light)
  const styles = colorScheme === "dark" ? darkStyles : lightStyles; // Set styles based on the color scheme

  // State hooks for the form data (text input, date, and time)
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(40); // Dynamic height for multiline text input
  const [date, setDate] = useState(new Date()); // Initial date state
  const [showDatePicker, setShowDatePicker] = useState(false); // Flag to show/hide date picker
  const [showTimePicker, setShowTimePicker] = useState(false); // Flag to show/hide time picker

  const { showToast } = useToast(); // Custom hook to show toasts

  const dispatch = useAppDispatch(); // Dispatch actions from Redux
  const clientNotesStatus = useAppSelector(selectClientNotesStatus); // Select client notes status from Redux

  // Handle date change when the user picks a date
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDatePicker(false); // Close the date picker
    setShowTimePicker(true); // Open the time picker
  };
  // Handle time change when the user picks a time
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours()); // Set the selected hour
      newDate.setMinutes(selectedTime.getMinutes()); // Set the selected minute
      setDate(newDate);
      setShowTimePicker(false); // Close the time picker
    }
  };
  /**
   * Function to add a note to the store.
   * Dispatches an action to create the note.
   */

  // Function to add a note to the store
  const handleAddNote = () => {
    const notePayload = {
      treatment_place_id: Array.isArray(uuid) ? uuid[0] : uuid, // Treatment place UUID
      date, // The selected date and time
      description: text, // Note content
    };

    if (notePayload.treatment_place_id) {
      dispatch(createNote(notePayload)); // Dispatch action to create the note
    }

    // If note creation succeeded, show success toast and navigate back
    if (clientNotesStatus === "succeeded") {
      console.log("Note added");
      showToast("success", i18n.t("toastStatus.success"), i18n.t("addNote.toast.success"));
      router.back(); // Go back to the previous screen
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <ReturnButton />
        <View style={styles.formContainer}>
          <ThemedText style={styles.titleModal}>{i18n.t("addNote.title")}</ThemedText>
          <View>
            <View style={styles.labelContainer}>
              <ThemedText style={styles.label}>{i18n.t("addNote.ContentLabel")}</ThemedText>
            </View>
            <TextInput
              style={[styles.input, { height: inputHeight }]}
              placeholder={i18n.t("addNote.contentPlaceholder")}
              placeholderTextColor="grey"
              multiline
              value={text}
              onChangeText={setText}
              onContentSizeChange={(event) =>
                setInputHeight(event.nativeEvent.contentSize.height)
              }
            />
          </View>
          <View>
            <View style={styles.labelContainer}>
              <ThemedText style={styles.label}>{i18n.t("addNote.dateLabel")}</ThemedText>
            </View>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || date;
                  setDate(currentDate);
                }}
              />
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.datetimePicker}
                >
                  <ThemedText>
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </ThemedText>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {showTimePicker && (
                  <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            )}
          </View>
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.button} onPress={handleAddNote}>
              <ThemedText>{i18n.t("addNote.btn.add")}</ThemedText>
            </TouchableOpacity>
            <Link href=".." asChild>
              <TouchableOpacity style={styles.button}>
                <ThemedText>{i18n.t("addNote.btn.cancel")}</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const sharedStyles = {
  formContainer: {
    alignItems: "center" as "center",
  },
  titleModal: {
    fontSize: 24,
    marginBottom: height * 0.04,
  },
  label: {
    fontSize: 20,
  },
  labelContainer: {
    alignItems: "center" as "center",
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: width * 0.9,
    minHeight: height * 0.05,
    fontSize: height * 0.03,
    paddingHorizontal: width * 0.01,
  },
  formButtons: {
    flexDirection: "row" as "row",
    marginTop: height * 0.05,
  },
  button: {
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    borderWidth: 1,
    borderRadius: 10,
    width: width * 0.2,
    height: height * 0.065,
    marginHorizontal: width * 0.02,
  },
  datetimePicker: {
    borderWidth: 1,
    borderColor: "grey",
    width: "auto" as "auto",
    minHeight: height * 0.05,
    borderRadius: 5,
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    paddingHorizontal: width * 0.01,
  },
};

// Light mode styles
const lightStyles = StyleSheet.create({
  ...sharedStyles,
  input: {
    ...sharedStyles.input,
    backgroundColor: "white",
    borderColor: "grey",
  },
  button: {
    ...sharedStyles.button,
    backgroundColor: Colors.light.greyBtn,
  },
  datetimePicker: {
    ...sharedStyles.datetimePicker,
    backgroundColor: "#f5f5f5",
    borderColor: "grey",
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  ...sharedStyles,
  input: {
    ...sharedStyles.input,
    backgroundColor: "#333333",
    borderColor: "grey",
    color: "#f5f5f5",
  },
  button: {
    ...sharedStyles.button,
    backgroundColor: Colors.dark.greyBtn,
  },
  datetimePicker: {
    ...sharedStyles.datetimePicker,
    backgroundColor: "#333333",
    borderColor: "grey",
  },
});
