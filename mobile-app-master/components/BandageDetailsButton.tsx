import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Href, Link } from "expo-router";
import {Colors} from "@/constants/Colors";

const { width } = Dimensions.get('window');
const buttonWidth = width * 0.9;

type BandageDetailsButtonProps = {
  text: string;
  uuid: string;
  icon: JSX.Element;
  url: Href;
};

const BandageDetailsButton = (props: BandageDetailsButtonProps) => {
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';
  const themedStyles = isDarkMode ? darkStyle: lightStyle;

  return (
    <Link href={props.url} asChild>
      <TouchableOpacity style={themedStyles.button}>
        <View style={themedStyles.leftContainer}>
          {props.icon}
          <ThemedText style={styles.text}>{props.text}</ThemedText>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

// Styles centralisés
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: buttonWidth,
    marginBottom: width * 0.075,
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
});

// Styles spécifiques au mode clair
const lightStyle = StyleSheet.create({
  ...styles,
  button: {
    ...styles.button,
    backgroundColor: Colors.light.greyBtn,
    borderColor: '#000000',
  },
});

// Styles spécifiques au mode sombre
const darkStyle = StyleSheet.create({
  ...styles,
  button: {
    ...styles.button,
    backgroundColor: Colors.dark.greyBtn,
    borderColor: '#ffffff',
  },
});

export default BandageDetailsButton;
