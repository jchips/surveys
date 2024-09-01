import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  ToastAndroid,
  Pressable,
} from 'react-native';
import SignupForm from './components/SignupForm';

const Signup = ({ navigation }) => {
  function showToast() {
    ToastAndroid.showWithGravity(
      'Sign up successful',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign up</Text>
      <SignupForm showToast={showToast} />
      <Pressable
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Log in' }],
          })
        }
      >
        <Text>Already have an account? Log in</Text>
      </Pressable>
      {/* <Pressable onPress={() => navigation.navigate('Log in')}>
        <Text>Log in</Text>
      </Pressable> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default Signup;
