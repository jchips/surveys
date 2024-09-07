import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import app from '../styles/default';

const TextResponse = React.memo(({ control, index, errors }) => {
  return (
    <View style={app.controllerContainer}>
      <Controller
        name={`textResponse${index}`}
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder='Please give your best answer'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={app.multilineInput}
            autoCapitalize='none'
            multiline
            numberOfLines={2}
          />
        )}
      />
      {errors['textResponse' + index] && (
        <Text style={app.errorText}>response required</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({});

export default TextResponse;
