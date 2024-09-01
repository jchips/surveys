import { StyleSheet } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import Routing from './src/routing/Routing';

export default function App() {
  return (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
