import { StyleSheet, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { AuthProvider } from './src/contexts/AuthContext';
import Routing from './src/routing/Routing';

export default function App() {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false; // Disable font scaling
  Text.defaultProps.textBreakStrategy = 'simple'; // Adjust text break strategy
  const [fontLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-ExtraBold': require('./assets/fonts/Inter-ExtraBold.ttf'),
    'Inter-BoldItalic': require('./assets/fonts/Inter-BoldItalic.ttf'),
  });
  return fontLoaded ? (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
