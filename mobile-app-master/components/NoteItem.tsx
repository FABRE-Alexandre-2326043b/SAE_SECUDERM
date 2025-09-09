import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Modal,
  TextInput,
  Platform, KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';
import { selectClientNotesStatus } from '@/store/clientNotes';
import { ClientNote, Prescription } from '@/store/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUserAuth } from '@/store/auth';
import { deleteNote, updateNote } from '@/store/clientNotesThunks';
import { deletePrescription, updatePrescription } from '@/store/prescriptionThunks';
import prescription, { selectPrescriptionStatus } from '@/store/prescription';
import { getUserById } from '@/store/userThunks';
import { Colors } from '@/constants/Colors';
import i18n from '@/languages/language-config';

const { width, height } = Dimensions.get('window');

type NoteItemProps = {
  clientNote?: ClientNote;
  prescription?: Prescription;
  IsClientNote: boolean;
};

const NoteItem = (props: NoteItemProps) => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';

  const [text, setText] = useState(
    props.IsClientNote ? props.clientNote?.description ?? '' : props.prescription?.description ?? ''
  );
  const [doctorName, setDoctorName] = useState(
    props.prescription ? props.prescription.doctor.last_name + ' ' + props.prescription.doctor.first_name : ''
  );

  const [date, setDate] = useState(
    props.IsClientNote ? new Date(props.clientNote?.date || Date.now()) : new Date(props.prescription?.date || Date.now())
  );

  const [modalVisible, setModalVisible] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setUpdateDate(currentDate);
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      const newDate = new Date(updateDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setUpdateDate(newDate);
      setShowTimePicker(false);
    }
  };

  const [updateText, setUpdateText] = useState(
    props.IsClientNote ? props.clientNote?.description ?? '' : props.prescription?.description ?? ''
  );
  const [inputHeight, setInputHeight] = useState(40);
  const [updateDate, setUpdateDate] = useState(
    props.IsClientNote ? new Date(props.clientNote?.date || Date.now()) : new Date(props.prescription?.date || Date.now())
  );

  const user = useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();
  const clientNotesStatus = useAppSelector(selectClientNotesStatus);
  const PrescriptionStatus = useAppSelector(selectPrescriptionStatus);

  const handleUpdateNote = () => {
    setText(updateText);
    setDate(updateDate);
    if (props.IsClientNote && props.clientNote != null) {
      dispatch(updateNote({ client_note_id: props.clientNote.id, date: updateDate, description: updateText }));
      if (clientNotesStatus === 'succeeded') {
        console.log('Note updated');
      }
    } else if (!props.IsClientNote && props.prescription != null) {
      dispatch(
        updatePrescription({
          prescription_id: props.prescription.id,
          date: updateDate,
          description: updateText,
          state: props.prescription.state,
        })
      );
      if (PrescriptionStatus === 'succeeded') {
        console.log('Prescription updated');
      }
    }
    setModalVisible(false);
  };

  const handleDeleteNote = () => {
    if (props.IsClientNote && props.clientNote != null) {
      dispatch(deleteNote(props.clientNote?.id));
      if (PrescriptionStatus === 'succeeded') {
        console.log('Note deleted');
      }
      setModalVisible(false);
    } else if (!props.IsClientNote && props.prescription != null) {
      dispatch(deletePrescription(props.prescription?.id));
      if (clientNotesStatus === 'succeeded') {
        console.log('Prescription deleted');
      }
      setModalVisible(false);
    }
  };

  let editable = false;
  if (props.IsClientNote && props.clientNote != null && user != null) {
    if (user.id === props.clientNote?.client_id || user.role === 'admin') {
      editable = true;
    }
  } else if (!props.IsClientNote && props.prescription != null && user != null) {
    if (user.id === props.prescription?.doctor_id || user.role === 'admin' || user.type === 'doctor') {
      editable = true;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Octicons name="dot-fill" size={24} color={iconColor} />
      <View style={styles.textContainer}>
        <ThemedText style={styles.taskText}>{text}</ThemedText>
        <ThemedText style={styles.dateText}>
          {i18n.t("noteItem.date")} : {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </ThemedText>
        {!props.IsClientNote && <ThemedText style={styles.doctorText}>{i18n.t("noteItem.by")} : {doctorName}</ThemedText>}
      </View>

      {editable && (
        <View>
          <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
            <MaterialIcons name="edit" size={20} color={iconColor} />
          </TouchableOpacity>

          <Modal visible={modalVisible} animationType="slide">
            <KeyboardAvoidingView style={styles.modalContainer}>
              <View style={styles.formContainer}>
                <ThemedText style={styles.titleModal}>{i18n.t("noteItem.editModal.title")}</ThemedText>
                {/* Contenu */}
                <View>
                  <View style={styles.labelContainer}>
                    <ThemedText style={styles.label}>{i18n.t("noteItem.editModal.contentInput")}</ThemedText>
                  </View>
                  <TextInput
                    style={[styles.input, { height: inputHeight }]}
                    placeholder={i18n.t("noteItem.editModal.contentPlaceholder")}
                    placeholderTextColor="grey"
                    multiline={true}
                    value={updateText}
                    onChangeText={setUpdateText}
                    onContentSizeChange={(event) => {
                      setInputHeight(event.nativeEvent.contentSize.height);
                    }}
                  />
                </View>
                {/* Date */}
                <View>
                  <View style={styles.labelContainer}>
                    <ThemedText style={styles.label}>{i18n.t("noteItem.editModal.dateInput")}</ThemedText>
                  </View>
                  {Platform.OS === 'ios' ? (
                    <DateTimePicker
                      value={updateDate}
                      mode="datetime"
                      display="default"
                      onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || date;
                        setUpdateDate(currentDate);
                      }}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.datetimePicker}>
                        <ThemedText>
                          {updateDate.toLocaleDateString()} {updateDate.toLocaleTimeString()}
                        </ThemedText>
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker value={updateDate} mode="date" display="default" onChange={handleDateChange} />
                      )}
                      {showTimePicker && (
                        <DateTimePicker value={updateDate} mode="time" display="default" onChange={handleTimeChange} />
                      )}
                    </>
                  )}
                </View>
                {/* Boutons */}
                <View style={styles.formButtons}>
                  <TouchableOpacity style={styles.button} onPress={handleUpdateNote}>
                    <ThemedText>{i18n.t("noteItem.editModal.editBtn")}</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                    <ThemedText>{i18n.t("noteItem.editModal.cancelBtn")}</ThemedText>
                  </TouchableOpacity>
                </View>
                <View style={styles.formButtons}>
                  <TouchableOpacity style={styles.button} onPress={handleDeleteNote}>
                    <ThemedText>{i18n.t("noteItem.editModal.deleteBtn")}</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      )}
    </View>
  );
};

const sharedStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    width: '100%',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    // paddingHorizontal: '5%',
    marginHorizontal: '5%',
    width: '80%',
  },
  taskText: {
    fontSize: width * 0.05,
  },
  dateText: {
    fontSize: width * 0.03,
  },
  editButton: {
    marginLeft: 'auto',
  },
  doctorText: {
    fontSize: width * 0.035,
  },

  titleModal: {
    fontSize: 24,
    marginBottom: height * 0.04,
  },
  label: {
    fontSize: 20,
  },
  labelContainer: {
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    alignItems: 'center',
  },
});

const lightStyles = StyleSheet.create({
  ...sharedStyles,
  dateText: {
    ...sharedStyles.dateText,
    color: Colors.light.infoText,
  },
  input: {
    ...sharedStyles.input,
    backgroundColor: Colors.light.greyBtn,
    borderColor: 'black',
  },
  modalContainer: {
    ...sharedStyles.modalContainer,
    backgroundColor: 'white',
  },
  button: {
    ...sharedStyles.button,
    backgroundColor: Colors.light.secondaryBtn,
  },
  datetimePicker: {
    ...sharedStyles.datetimePicker,
    backgroundColor: Colors.light.greyBtn,
    borderColor: 'black',
  },
});

const darkStyles = StyleSheet.create({
  ...sharedStyles,
  dateText: {
    ...sharedStyles.dateText,
    color: Colors.dark.infoText,
  },
  input: {
    ...sharedStyles.input,
    backgroundColor: Colors.dark.greyBtn,
    borderColor: 'white',
  },
  modalContainer: {
    ...sharedStyles.modalContainer,
    backgroundColor: 'black',
  },
  button: {
    ...sharedStyles.button,
    backgroundColor: Colors.dark.secondaryBtn,
  },
  datetimePicker: {
    ...sharedStyles.datetimePicker,
    backgroundColor: Colors.dark.greyBtn,
    borderColor: 'white',
  },
});

export default NoteItem;
