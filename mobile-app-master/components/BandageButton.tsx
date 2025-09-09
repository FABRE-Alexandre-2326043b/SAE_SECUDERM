import React from 'react';
import { TouchableOpacity, View, StyleSheet, useColorScheme, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import {Colors} from "@/constants/Colors";

const { width } = Dimensions.get('window');

type BandageButtonProps = {
    text: string;
    uuid: string;
};

const BandageButton = (props: BandageButtonProps) => {
    const colorScheme = useColorScheme();

    const isDarkMode = colorScheme === 'dark';
    const themedStyles = isDarkMode ? darkStyles : lightStyles;
    const IconColor = isDarkMode ? 'white' : 'black';


    return (
      <Link href={{ pathname: '/[uuid]/bandage-details', params: { uuid: props.uuid } }} asChild>
          <TouchableOpacity style={themedStyles.button}>
              <View style={themedStyles.leftContainer}>
                  <MaterialIcons name="crop-free" size={24} color={IconColor}/>
                  <ThemedText style={themedStyles.text}>{props.text}</ThemedText>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color={IconColor} />
          </TouchableOpacity>
      </Link>
    );
};

// Styles regroupés dans le même fichier
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 20,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: width * 0.9,
        marginBottom: width * 0.025,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: width * 0.045,
        fontWeight: '500',
        marginLeft: 10,
    },
})

// Styles spécifiques au mode clair
const lightStyles = StyleSheet.create({
    ...styles,
    button: {
        ...styles.button,
        backgroundColor: Colors.light.primaryBtn,
        borderColor: 'black',
    },
});

// Styles spécifiques au mode sombre
const darkStyles = StyleSheet.create({
    ...styles,
    button: {
        ...styles.button,
        backgroundColor: Colors.dark.primaryBtn,
        borderColor: 'white',
    },
});

export default BandageButton;
