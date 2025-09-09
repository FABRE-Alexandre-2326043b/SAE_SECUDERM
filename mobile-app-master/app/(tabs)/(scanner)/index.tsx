import React, { useState, useEffect, useCallback } from 'react';
import {View, Button, StyleSheet, Text, Modal, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { ThemedText } from "@/components/ThemedText";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useToast } from "@/hooks/useToast";
import { resetQRCodeCreateStatus } from "@/store/qrCode";
import { parse } from 'date-fns';
import { selectUserAuth } from "@/store/auth";
import { Type } from "@/store/enums";
import {router, useFocusEffect } from "expo-router";
import i18n from '@/languages/language-config';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  checkIfTreatmentPlaceExists,
  createTreatmentPlace,
  useShareableTreatmentPlaceCode
} from "@/store/treatmentPlaceThunks";
import {
  clearRedirectToTreatmentPlaceId,
  resetDoctorShareableTreatmentPlaceCodeStatus, resetRedirectToTreatmentPlaceIdStatus,
  selectDoctorShareableTreatmentPlaceCodeStatus,
  selectRedirectToTreatmentPlaceId,
  selectRedirectToTreatmentPlaceIdStatus,
  selectShareableTreatmentPlaceCodeStatus,
  selectTreatmentPlaceCreateStatus,
  selectTreatmentPlaceError
} from "@/store/treatmentPlace";

// Get device screen width and height
const { width, height } = Dimensions.get('window');
/**
 * HomeScreen component manages the QR code scanning functionality for creating treatment places.
 * It handles user input, camera permissions, and dynamic modals for both doctor-specific and general inputs.
 * The UI is responsive to different user roles (doctor vs regular user) and allows users to activate/deactivate the scanner.
 * Toast messages and modals are used to guide the user through the process, providing success or error feedback.
 */

export default function HomeScreen() {
  // State variables for camera permission, scanning status, QR code data, and modal visibility
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Additional state for doctor modal and QR code data
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);
  const [doctorCode, setDoctorCode] = useState('');
  const doctorLinkingStatus = useAppSelector(selectDoctorShareableTreatmentPlaceCodeStatus);

  // State for form inputs (label, product reference, dimension, lot number, expiration date)
  const [labelValue, setLabelValue] = useState('');
  const [refProduct, setRefProduct] = useState('');
  const [dimension, setDimension] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [numberInLot, setNumberInLot] = useState('');

  // Redux dispatch and state selection for treatment place creation status and errors
  const dispatch = useAppDispatch();
  const treatmentPlaceCreateStatus = useAppSelector(selectTreatmentPlaceCreateStatus);
  const treatmentPlaceCreateError = useAppSelector(selectTreatmentPlaceError);
  const redirectToTreatmentPlaceId = useAppSelector(selectRedirectToTreatmentPlaceId);
  const redirectTreatmentPlaceStatus = useAppSelector(selectRedirectToTreatmentPlaceIdStatus);

  // Select the current user from state
  const user = useAppSelector(selectUserAuth);

  // Hook for showing toast messages
  const { showToast } = useToast();

  // Request camera permission when the component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle changes in treatment place creation status and show appropriate toast message
  // redirectTreatmentPlaceStatus redirect to existing treatment place instead of creating a new one
  useEffect(() => {
    if (redirectTreatmentPlaceStatus === 'succeeded' && redirectToTreatmentPlaceId) {
      setIsScannerActive(false);
      dispatch(clearRedirectToTreatmentPlaceId());
      dispatch(resetRedirectToTreatmentPlaceIdStatus());
      resetData();
      router.navigate(`/(tabs)/(bandage-list)/${redirectToTreatmentPlaceId}/bandage-details`);
    }
    if (redirectTreatmentPlaceStatus === 'failed' && !redirectToTreatmentPlaceId) {
      setIsModalVisible(true);
      dispatch(clearRedirectToTreatmentPlaceId());
      dispatch(resetRedirectToTreatmentPlaceIdStatus());
    }
    if (treatmentPlaceCreateStatus === 'failed' && !redirectToTreatmentPlaceId && redirectTreatmentPlaceStatus === 'failed') {
      showToast('error', i18n.t('homeScreen.toastMessages.error.title'), treatmentPlaceCreateError ?? i18n.t('homeScreen.modals.bandage.errorGeneric'));
      setIsScannerActive(false);
      dispatch(resetQRCodeCreateStatus());
    }
    if (treatmentPlaceCreateStatus === 'succeeded' && redirectTreatmentPlaceStatus === 'failed') {
      showToast('success', i18n.t('homeScreen.toastMessages.success.title'), i18n.t('homeScreen.modals.bandage.success'));
      setIsScannerActive(false);
      dispatch(resetQRCodeCreateStatus());
    }
  }, [treatmentPlaceCreateStatus, treatmentPlaceCreateError, redirectToTreatmentPlaceId, redirectTreatmentPlaceStatus]);

  // Handle the QR code scanning and data parsing
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setIsScannerActive(!isScannerActive);
    parseQRCodeData(data);
    // setIsModalVisible(true);
  };

  // Parse the QR code data into relevant fields
  const parseQRCodeData = (data: string) => {
    let parsedData;
    try {
      parsedData = JSON.parse(data);
      setRefProduct(parsedData?.ref_product);
      setDimension(parsedData?.dimension);
      setLotNumber(parsedData?.lot_number);
      setExpirationDate(parsedData?.expiration_date);
      setNumberInLot(parsedData?.number_in_lot);
    } catch (error) {
      console.error('Failed to parse JSON string:', error);
      showToast('error', i18n.t('homeScreen.toastMessages.error.title'), i18n.t('homeScreen.toastMessages.error.qrCodeReadFailed'));
      resetData();
    }
  };

  useEffect(() => {
    if (refProduct && numberInLot && lotNumber) {
      dispatch(checkIfTreatmentPlaceExists({ number_in_lot: numberInLot, ref_product: refProduct, lot_number: lotNumber }));
    }
  }, [numberInLot, refProduct, lotNumber]);

  // Reset the form fields
  const resetData = () => {
    setRefProduct('');
    setDimension('');
    setLotNumber('');
    setExpirationDate('');
    setLabelValue('');
    setNumberInLot('');
  };

  // Handle the form submission after QR code data is parsed
  const handleSubmit = () => {
    if (!labelValue) {
      showToast('error', i18n.t('homeScreen.toastMessages.error.title'), i18n.t('homeScreen.modals.bandage.error.nameMissing'));
      return;
    }
    if (!refProduct || !dimension || !lotNumber || !expirationDate) {
      setIsModalVisible(false);
      resetData();
      showToast('error', i18n.t('homeScreen.toastMessages.error.title'), i18n.t('homeScreen.modals.bandage.error.scanAgain'));
      return;
    }
    console.log(labelValue, refProduct, dimension, numberInLot, lotNumber, expirationDate);
    dispatch(createTreatmentPlace({
      label: labelValue,
      ref_product: refProduct,
      dimension: dimension,
      number_in_lot: numberInLot,
      lot_number: lotNumber,
      expiration_date: parse(expirationDate, 'dd/MM/yyyy', new Date()),
    }));
    setIsModalVisible(false);
    resetData();
  };

  // Handle the doctor's form submission
  const handleSubmitDoctor = () => {
    if (!doctorCode) {
      showToast('error', i18n.t('homeScreen.toastMessages.error.title'), i18n.t('homeScreen.modals.doctor.error.missingCode'));
      return;
    }
    dispatch(useShareableTreatmentPlaceCode(doctorCode));
  };

  // Handle changes in the doctor's linking status and show toast messages
  useEffect(() => {
    if (doctorLinkingStatus === 'succeeded') {
      showToast('success', i18n.t('homeScreen.toastMessages.success.title'), i18n.t('homeScreen.modals.doctor.success'));
      setDoctorCode('');
      dispatch(resetDoctorShareableTreatmentPlaceCodeStatus());
      setIsDoctorModalVisible(false);
      router.navigate('/(tabs)/(bandage-list)');
    } else if (doctorLinkingStatus === 'failed') {
      showToast('error', i18n.t('homeScreen.toastMessages.error.title'), i18n.t('homeScreen.modals.doctor.error.linkFailed'));
      setDoctorCode('');
      dispatch(resetDoctorShareableTreatmentPlaceCodeStatus());
      setIsDoctorModalVisible(false);
    }
  }, [doctorLinkingStatus]);

  // Check if the language has changed and navigate to the scanner screen if needed
  let currentLocale = i18n.locale;
  useFocusEffect(
    useCallback(() => {
      if (currentLocale != i18n.locale){
        router.replace('/(tabs)/(scanner)');
      }
    }, [i18n.locale])
  );

  // Handle case when camera permission is not yet granted or denied
  if (hasPermission === null) {
    return <ThemedText>{i18n.t('homeScreen.cameraPermission.requesting')}</ThemedText>;
  }
  // Show message when camera permission is denied
  if (!hasPermission) {
    return <ThemedText>{i18n.t('homeScreen.cameraPermission.noAccess')}</ThemedText>;
  }

  // Show loading text when treatment place creation is in progress
  if (treatmentPlaceCreateStatus === 'loading') {
    return <ThemedText>{i18n.t('homeScreen.loading')}</ThemedText>;
  }

  // Show doctor modal if the user is a doctor
  if (user !== null && user.type === Type.DOCTOR) {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Button title={i18n.t('homeScreen.buttons.submit')} onPress={() => setIsDoctorModalVisible(true)} />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isDoctorModalVisible}
          onRequestClose={() => setIsDoctorModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('homeScreen.modals.doctor.title')}
                value={doctorCode}
                onChangeText={setDoctorCode}
              />
              <View style={styles.buttonContainer}>
                <Button title={i18n.t('homeScreen.buttons.submit')} onPress={handleSubmitDoctor} />
                <Button title={i18n.t('homeScreen.buttons.cancel')} onPress={() => {
                  setIsDoctorModalVisible(false);
                  setDoctorCode('');
                }} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isScannerActive ? (
        <CameraView
          ref={(ref) => setCameraRef(ref)}
          style={styles.cameraView}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </CameraView>
      ) : (
        <View style={styles.cameraViewPlaceholder} />
      )}
      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.scannerButton} onPress={() => setIsScannerActive(!isScannerActive)}>
          <Text style={styles.scannerButtonText}>{isScannerActive ? i18n.t('homeScreen.buttons.deactivateScanner') : i18n.t('homeScreen.buttons.activateScanner')}</Text>
        </TouchableOpacity>
        {scanned && <TouchableOpacity style={styles.scannerButton} onPress={() => setScanned(false)}>
            <Text style={styles.scannerButtonText}>{i18n.t('homeScreen.buttons.scanAgain')}</Text>
        </TouchableOpacity>
        }
      </View>
      <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(tabs)/(scanner)/TutoScanner')}>
        <MaterialCommunityIcons name="help-circle" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('homeScreen.modals.bandage.title')}
              value={labelValue}
              onChangeText={setLabelValue}
            />
            {scanned && (
              <View style={styles.infoContainer}>
                <Text>{i18n.t('homeScreen.modals.bandage.refProduct')}: {refProduct}</Text>
                <Text>{i18n.t('homeScreen.modals.bandage.dimension')}: {dimension}</Text>
                <Text>{i18n.t('homeScreen.modals.bandage.numberInLot')}: {numberInLot}</Text>
                <Text>{i18n.t('homeScreen.modals.bandage.lotNumber')}: {lotNumber}</Text>
                <Text>{i18n.t('homeScreen.modals.bandage.expirationDate')}: {expirationDate}</Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <Button title={i18n.t('homeScreen.buttons.submit')} onPress={handleSubmit} />
              <Button title={i18n.t('homeScreen.buttons.cancel')} onPress={() => {
                setIsModalVisible(false);
                resetData();
              }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Define styles for the layout of the components
const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cameraView: {
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    marginTop: '10%',
  },
  cameraViewPlaceholder: {
    width: '80%',
    aspectRatio: 1,
    marginTop: '10%',
  },
  overlay: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    right: '25%',
    bottom: '25%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#ffffff',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#ffffff',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#ffffff',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#ffffff',
  },
  infoContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  scannerButton: {
    backgroundColor: '#3f88fc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, // Coins arrondis
    marginBottom: 10,
  },
  scannerButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center', // Centrer le texte
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
