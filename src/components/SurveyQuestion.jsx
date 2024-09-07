import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useForm, Controller } from 'react-hook-form';
import app from '../styles/default';
import COLORS from '../styles/constants/colors';
import { BORDER } from '../styles/constants/styles';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SurveyQuestion = (props) => {
  const { control, errors, questionIndex } = props;
  const [isMultichoice, setIsMultichoice] = useState(false);
  return (
    <View>
      {/* Survey question */}
      <View style={styles.controllerContainer}>
        <Text style={{ ...app.header, marginTop: 0 }}>
          Survey question {questionIndex > 1 ? questionIndex : null}
        </Text>
        <Controller
          name={`surveyQuestion${questionIndex}`}
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Ask a question for users to respond to'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={app.multilineInput}
              autoCapitalize='none'
              maxLength={400}
              multiline
              numberOfLines={4}
            />
          )}
        />
        {errors['surveyQuestion' + questionIndex] && (
          <Text style={styles.errorText}>survey question required</Text>
        )}
      </View>

      {/* Response type */}
      <View style={styles.controllerContainer}>
        <Text style={{ ...app.header, marginTop: 0 }}>Response type</Text>
        <Controller
          name={`responseType${questionIndex}`}
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <RNPickerSelect
              placeholder={{ label: 'Choose a response type', value: null }}
              onValueChange={(value) => {
                onChange(value);
                value === 'multiChoice'
                  ? setIsMultichoice(true)
                  : setIsMultichoice(false);
              }}
              value={value}
              items={[
                { label: 'Text', value: 'text' },
                { label: 'Multi-choice', value: 'multiChoice' },
              ]}
              useNativeAndroidPickerStyle={false}
              textInputProps={{
                style: {
                  color: Platform.OS === 'ios' ? '#C7C7CD' : 'gray',
                  padding: 10,
                  backgroundColor: COLORS.white,
                  borderRadius: BORDER.radius,
                },
              }}
              Icon={() => {
                return (
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>▼</Text>
                  </View>
                );
              }}
            />
          )}
        />
        {errors['responseType' + questionIndex] && (
          <Text style={styles.errorText}>response type required</Text>
        )}
      </View>

      {isMultichoice ? (
        <View style={styles.controllerContainer}>
          <Controller
            name={`multiChoiceOptions${questionIndex}`}
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder='Separate your multi-choice options by commas'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={app.singleLineInput}
                autoCapitalize='none'
                autoCorrect={false}
              />
            )}
          />
          {errors['multiChoiceOptions' + questionIndex] && (
            <Text style={styles.errorText}>multichoice options required</Text>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  controllerContainer: {
    margin: 10,
  },
  errorText: {
    color: '#dc3545',
  },
  arrowContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
    margin: 10,
  },
  arrow: {
    color: 'black',
    fontSize: 15, // 20
    position: 'absolute',
    top: '50%',
    right: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 7, // 10
    borderTopColor: 'black',
    borderRightWidth: 6, // 8
    borderRightColor: 'transparent',
    borderLeftWidth: 6, // 8
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
  },
});

export default SurveyQuestion;
