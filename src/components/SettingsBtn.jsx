import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import app from '../styles/default';

const SettingsBtn = ({ navigation }) => {
  return (
    <Pressable
      onPress={() => navigation.navigate('Settings')}
      style={styles.button}
    >
      <Image
        source={{
          uri: 'https://img.icons8.com/fluency-systems-regular/50/e60012/settings--v1.png',
        }}
        alt='settings icon'
        style={app.icon}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
  },
});

export default SettingsBtn;
