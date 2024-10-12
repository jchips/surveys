import { ToastAndroid } from 'react-native';

/**
 * Displays a brief Toast on Android phones.
 * @param {String} message - The message to be displayed in the Toast.
 */
const showToast = (message) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM
  );
}

export default showToast;
