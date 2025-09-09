/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    //Colors for buttons
    primaryBtn: '#FF9D3D',
    secondaryBtn: '#7fc6f6',
    greyBtn: '#d8d7d7',
    logoutBtn: '#ff4d4d',
    //Colors for error blocks
    errorBlock: '#FF8585',
    errorBlockBorder: '#FF4646',
    //Link text color
    linkText: '#133E87',
    infoText: '#666',
  },
  dark: {
    text: '#ECEDEE',
    background: '#282828',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    //Colors for buttons
    primaryBtn: '#FF6500',
    secondaryBtn: '#1E3E62',
    greyBtn: '#6c6b6b',
    logoutBtn: '#d9534f',
    //Colors for error blocks
    errorBlock: '#950101',
    errorBlockBorder: '#FF0000',
    //Link text color
    linkText: '#608BC1',
    infoText: '#666',
  },
};
