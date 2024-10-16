import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import COLORS from '../styles/constants/colors';

/**
 * Adds a loading symbol while the video is loading.
 * @returns {Component} - A component with the loading symbol
 */
const Loading = () => {
  return (
    <View style={{ alignItems: 'center' }}>
      <ActivityIndicator
        size='large'
        color={COLORS.primary}
        style={{ position: 'absolute', top: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Loading;
