import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform
} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import ReturnButton from "@/components/ReturnButton";
import {useColorScheme} from "@/hooks/useColorScheme";
import {useState} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import {Link, router, useLocalSearchParams} from "expo-router";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {selectClientNotesStatus} from "@/store/clientNotes";
import {createPrescription} from "@/store/prescriptionThunks";
import {TreatmentPlace} from "@/store/types";
import i18n from "@/languages/language-config";
import {useToast} from "@/hooks/useToast";
import {selectTreatmentPlaces} from "@/store/treatmentPlace";


const {width, height} = Dimensions.get('window');

/**
 * Component for adding prescriptions in a modal.
 * Allows users to input prescription content and select date and time.
 * Dispatches an action to create a prescription in the Redux store.
 */
export default function AddNotesModal() {
  const { uuid } = useLocalSearchParams(); // Extract parameters from the URL, such as treatment place UUID

  const colorScheme = useColorScheme(); // Get current theme (dark or light)
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles; // Select styles based on the current theme

  const [text, setText] = useState(''); // State to hold the prescription description
  const [inputHeight, setInputHeight] = useState(40); // State to manage input field height dynamically

  const [date, setDate] = useState(new Date()); // State to manage the date and time of the prescription

  // Android-specific states for showing the date/time pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { showToast } = useToast(); // Toast notification helper function

  // Handles changes in the date picker (when a date is selected)
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date; // If a date is selected, update the state
    setDate(currentDate); // Update the date state
    setShowDatePicker(false); // Hide date picker after selection
    setShowTimePicker(true); // Show time picker after selecting date
  };

  // Handles changes in the time picker (when a time is selected)
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      const newDate = new Date(date); // Create a new Date object from the current date
      newDate.setHours(selectedTime.getHours()); // Set the selected time's hour
      newDate.setMinutes(selectedTime.getMinutes()); // Set the selected time's minute
      setDate(newDate); // Update the date state with the new time
      setShowTimePicker(false); // Hide time picker after selection
    }
  };

  const dispatch = useAppDispatch(); // Dispatch function to trigger actions in Redux
  const clientNotesStatus = useAppSelector(selectClientNotesStatus); // Select the status of client notes from Redux
  const treatmentPlaces = useAppSelector(selectTreatmentPlaces); // Select the available treatment places

  // Determine the selected treatment place based on the uuid passed as a URL parameter
  let selectedTreatmentPlace: TreatmentPlace | undefined;
  if (Array.isArray(uuid)) {
    selectedTreatmentPlace = treatmentPlaces.find((tp) => tp.id === uuid[0]); // If uuid is an array, find the first treatment place
  } else {
    selectedTreatmentPlace = treatmentPlaces.find((tp) => tp.id === uuid); // If uuid is a single value, find that treatment place
  }

  // Function to handle adding a new prescription
  const handleAddPrescription = () => {
    if (typeof uuid === "string" && selectedTreatmentPlace) {
      // Dispatch action to create prescription for a single treatment place
      dispatch(createPrescription({
        treatment_place_id: uuid,
        date: date,
        description: text,
        state: false,
      }));
    } else if (Array.isArray(uuid)) {
      // Dispatch action to create prescription for an array of treatment places
      dispatch(createPrescription({
        treatment_place_id: uuid[0],
        date: date,
        description: text,
        state: false,
      }));
    }

    // After successful creation, show a success message and navigate back
    if (clientNotesStatus === 'succeeded') {
      console.log('Prescription added');
      showToast("success", i18n.t("toastStatus.success"), i18n.t("addPrescription.toast.success"));
      router.back(); // Go back to the previous screen
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <ReturnButton />
        <View style={styles.formContainer}>
          <ThemedText style={styles.titleModal}>
            {i18n.t("addPrescription.title")}
          </ThemedText>
          <View>
            <View style={styles.labelContainer}>
              <ThemedText style={styles.label}>{i18n.t("addPrescription.ContentLabel")}</ThemedText>
            </View>
            <TextInput
              style={[styles.input, { height: inputHeight }]}
              placeholder={i18n.t("addPrescription.contentPlaceholder")}
              placeholderTextColor={'grey'}
              multiline={true}
              value={text}
              onChangeText={setText}
              onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
            />
          </View>
          <View>
            <View style={styles.labelContainer}>
              <ThemedText style={styles.label}>{i18n.t("addPrescription.dateLabel")}</ThemedText>
            </View>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'datetime'}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || date;
                  setDate(currentDate);
                }}
              />
            ) : Platform.OS === 'android' ? (
              <View>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.datetimePicker}>
                  <ThemedText>
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </ThemedText>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode={'date'}
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {showTimePicker && (
                  <DateTimePicker
                    value={date}
                    mode={'time'}
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            ) : null}
          </View>
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.button} onPress={handleAddPrescription}>
              <ThemedText>{i18n.t("addPrescription.btn.add")}</ThemedText>
            </TouchableOpacity>
            <Link href={".."} asChild>
              <TouchableOpacity style={styles.button}>
                <ThemedText>{i18n.t("addPrescription.btn.cancel")}</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const sharedStyles = StyleSheet.create({
  // Shared styles for the form layout, labels, input fields, and buttons
  formContainer: {
    alignItems: "center",
  },
  titleModal: {
    fontSize: 24,
    marginBottom: height * 0.04,
  },
  label: {
    fontSize: 20,
  },
  labelContainer: {
    alignItems: "center",
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
  },
  input: {
    borderWidth: 1,
    width: width * 0.9,
    minHeight: height * 0.05,
    borderRadius: 5,
    fontSize: height * 0.03,
    paddingHorizontal: width * 0.01,
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: height * 0.05,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    width: width * 0.2,
    height: height * 0.065,
    marginHorizontal: width * 0.02,
  },
  datetimePicker: {
    borderWidth: 1,
    width: 'auto',
    minHeight: height * 0.05,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.01,
  },
});

const lightStyles = StyleSheet.create({
  ...sharedStyles,
  input:{
    ...sharedStyles.input,
    backgroundColor : "white",
    borderColor: 'grey',
  },
  button:{
    ...sharedStyles.button,
    backgroundColor: '#f5f5f5',
  },
  datetimePicker:{
    ...sharedStyles.datetimePicker,
    backgroundColor: '#f5f5f5',
    borderColor: 'grey',
  },
});

const darkStyles = StyleSheet.create({
  ...sharedStyles,
  input:{
    ...sharedStyles.input,
    backgroundColor : "#333333",
    borderColor: 'grey',
    color: '#f5f5f5',
  },
  button:{
    ...sharedStyles.button,
    backgroundColor: '#333333',
  },
  datetimePicker:{
    ...sharedStyles.datetimePicker,
    backgroundColor: '#333333',
    borderColor: 'grey',
  },
});
