import Toast from "react-native-toast-message";

type ToastType = 'success' | 'error' | 'info';

export function useToast() {
  const showToast = (type: ToastType, title: string, message?: string) => {
    Toast.show({
      type,
      text1: title,
      text2: message ?? undefined,
    });
  };

  return { showToast };
}
