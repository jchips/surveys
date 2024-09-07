import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import RadioGroup from 'react-native-radio-buttons-group';
import app from '../styles/default';

const MultiChoiceResponse = ({ control, choices, index, errors }) => {
  const radioButtons = useMemo(
    () =>
      choices.map((option, index) => {
        return {
          id: index,
          label: option,
          value: option,
        };
      }),
    [choices]
  );
  return (
    <View style={app.controllerContainer}>
      <Controller
        control={control}
        name={`radioGroup${index}`}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            radioButtons={radioButtons}
            onPress={onChange}
            selectedId={value}
            containerStyle={styles.radioButtons}
          />
        )}
      />
      {errors['radioGroup' + index] && (
        <Text style={app.errorText}>response required</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  radioButtons: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default MultiChoiceResponse;
