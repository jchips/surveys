import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import app from '../styles/default';

const Error = () => {
  return (
    <View style={app.container}>
      <Image
        source={require('./../../assets/icon.png')}
        style={{ height: 100, width: 100 }}
      />
      <Text style={app.text}>Sorry this survey doesn't exist anymore</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Error;
