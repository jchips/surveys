import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, Pressable } from 'react-native';
import SignupForm from './components/SignupForm';
import showToast from '../util/showToast';

const Signup = ({ navigation }) => {
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
