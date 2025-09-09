import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import ReturnButton from "@/components/ReturnButton";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useToast } from "@/hooks/useToast";
import { router, useLocalSearchParams } from "expo-router";
import i18n from "@/languages/language-config";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@react-navigation/native";
import {
  clearShareableTreatmentPlaceCode, resetShareableTreatmentPlaceCodeStatus,
  selectShareableTreatmentPlaceCode,
  selectShareableTreatmentPlaceCodeStatus
} from "@/store/treatmentPlace";
import { generateShareableTreatmentPlaceCode } from "@/store/treatmentPlaceThunks";

export default function ShareTreatmentPlaceScreen() {
  const { colors, dark } = useTheme();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const { uuid } = useLocalSearchParams();
  const code = useAppSelector(selectShareableTreatmentPlaceCode);
  const sharingStatus = useAppSelector(selectShareableTreatmentPlaceCodeStatus);

  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const clearSharingCode = () => {
    dispatch(clearShareableTreatmentPlaceCode());
    dispatch(resetShareableTreatmentPlaceCodeStatus());
  }

  const handleGenerateCode = () => {
    if (uuid) {
      dispatch(generateShareableTreatmentPlaceCode(uuid as string));
    } else {
      showToast('error', i18n.t("toastStatus.error"), i18n.t("shareBandage.toast.generateError"));
      router.dismiss();
    }
  }

  useEffect(() => {
    if (sharingStatus === 'succeeded' && code) {
      setIsModalVisible(true);
      return;
    } else if (sharingStatus === 'failed') {
      showToast('error', i18n.t("toastStatus.error"), i18n.t("shareBandage.toast.generateError"));
    }
  }, [sharingStatus, code]);

  const themeStyles = dark ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <ReturnButton />
      <ThemedText style={[styles.title, themeStyles.title]}>{i18n.t("shareBandage.title")}</ThemedText>
      <TouchableOpacity style={[styles.button, themeStyles.button]} onPress={handleGenerateCode}>
        <ThemedText style={styles.buttonText}>{i18n.t("shareBandage.btn")}</ThemedText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalView, themeStyles.modalView]}>
            <ThemedText style={[styles.modalText, themeStyles.modalText]}>{i18n.t("shareBandage.modalTxt")}</ThemedText>
            <View style={styles.codeContainer}>
              <ThemedText style={styles.codeText}>{code}</ThemedText>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              setIsModalVisible(false);
              clearSharingCode();
            }}>
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 100,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
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
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  codeContainer: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  codeText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
  },
  title: {
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
  },
  modalView: {
    backgroundColor: 'white',
  },
  modalText: {
    color: '#333',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  title: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#1e90ff',
  },
  modalView: {
    backgroundColor: '#333',
  },
  modalText: {
    color: '#fff',
  },
});