import {View, Text, Button, TouchableOpacity, Modal, TextInput, StyleSheet, Dimensions} from "react-native";
import { Camera, CameraView } from "expo-camera";
import i18n from "@/languages/language-config";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUserAuth } from "@/store/auth";
import { useToast } from "@/hooks/useToast";
import { fetchTreatmentPlacesByClientId, replaceBandage } from "@/store/treatmentPlaceThunks";
import { parse } from "date-fns";
import { ThemedText } from "@/components/ThemedText";
import {
  clearReplaceBandageError,
  resetReplaceBandageStatus,
  selectReplaceBandageError,
  selectReplaceBandageStatus,
} from "@/store/treatmentPlace";
import { Loading } from "@/components/Loading";
const { width, height } = Dimensions.get('window');
/**
 * Component for replacing a bandage.
 * Allows users to scan a QR code, input bandage details, and submit the replacement.
 */
export default function ReplaceBandage() {
  const { uuid } = useLocalSearchParams();

  // State variables to manage camera and QR scanning data
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State variables for bandage details
  const [labelValue, setLabelValue] = useState('');
  const [refProduct, setRefProduct] = useState('');
  const [dimension, setDimension] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [numberInLot, setNumberInLot] = useState('');

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserAuth);
  const replaceBandageStatus = useAppSelector(selectReplaceBandageStatus);
  const replaceBandageError = useAppSelector(selectReplaceBandageError);

  const { showToast } = useToast();

  // Request camera permissions when the component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle QR code scan event
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    parseQRCodeData(data); // Parse the scanned QR code data
    setIsScannerActive(!isScannerActive); // Toggle scanner active state
    setIsModalVisible(true); // Show modal with scanned details
  };

  // Parse the QR code data and populate the state with bandage details
  const parseQRCodeData = (data: string) => {
    let parsedData;
    try {
      parsedData = JSON.parse(data);
      setRefProduct(parsedData?.ref_product);
      setDimension(parsedData?.dimension);
      setLotNumber(parsedData?.lot_number);
      setExpirationDate(parsedData?.expiration_date);
    } catch (error) {
      console.error('Failed to parse JSON string:', error);
      showToast('error', i18n.t('homeScreen.toastMessages.error.title'), i18n.t('homeScreen.toastMessages.error.qrCodeReadFailed'));
      resetData(); // Reset data if parsing fails
    }
  };

  // Reset all form fields and scanned data
  const resetData = () => {
    setRefProduct('');
    setDimension('');
    setLotNumber('');
    setExpirationDate('');
    setLabelValue('');
    setNumberInLot('');
  };

  // Handle form submission for replacing the bandage
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
    dispatch(replaceBandage({
      treatment_place_id: uuid as string,
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

  // Effect to show success or error messages and navigate after bandage replacement
  useEffect(() => {
    if (replaceBandageStatus === 'succeeded') {
      showToast('success', i18n.t('homeScreen.toastMessages.success.title'), i18n.t('homeScreen.toastMessages.success.bandageReplaced'));
      dispatch(resetReplaceBandageStatus());
      router.replace('/(tabs)/(bandage-list)');
    } else if (replaceBandageStatus === 'failed') {
      showToast('error', i18n.t('homeScreen.toastMessages.error.title'), i18n.t('homeScreen.toastMessages.error.bandageReplaceFailed'));
      dispatch(resetReplaceBandageStatus());
      dispatch(clearReplaceBandageError());
    }
  }, [replaceBandageStatus, replaceBandageError]);

  let currentLocale = i18n.locale;

  // Ensure the UI updates when the language changes
  useFocusEffect(
    useCallback(() => {
      if (currentLocale != i18n.locale) {
        router.replace('/(tabs)/(scanner)');
      }
    }, [i18n.locale])
  );

  // Handle permission states for the camera
  if (hasPermission === null) {
    return <ThemedText>{i18n.t('homeScreen.cameraPermission.requesting')}</ThemedText>;
  }
  if (!hasPermission) {
    return <ThemedText>{i18n.t('homeScreen.cameraPermission.noAccess')}</ThemedText>;
  }

  // Show loading spinner when bandage replacement is in progress
  if (replaceBandageStatus === 'loading') {
    return <Loading />;
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
        <Button title={isScannerActive ? i18n.t('homeScreen.buttons.deactivateScanner') : i18n.t('homeScreen.buttons.activateScanner')} onPress={() => setIsScannerActive(!isScannerActive)} />
        {scanned && <Button title={i18n.t('homeScreen.buttons.scanAgain')} onPress={() => setScanned(false)} />}
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
  )
}

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
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 120,
    alignItems: 'center',
  },
  scannerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
