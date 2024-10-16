import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import app from '../styles/default';
import card from '../styles/card';
import COLORS from '../styles/constants/colors';

const Settings = ({ navigation }) => {
  return (
    <View style={app.container}>
      <Pressable onPress={() => navigation.navigate('About')}>
        <View style={card.container}>
          <Text style={[card.title]}>About Surveys</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: COLORS.primary,
  },
});

export default Settings;
