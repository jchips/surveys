import React, { useState } from 'react';
import {
  SafeAreaView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import app from '../styles/default';
import SurveyQuestion from '../components/SurveyQuestion';
import { BORDER } from '../styles/constants/styles';
import COLORS from '../styles/constants/colors';

const Create = ({ navigation }) => {
  const [error, setError] = useState('');
  const [addSecondQuestion, setAddSecondQuestion] = useState(false);
  const [addThirdQuestion, setAddThirdQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      responseType: 'text',
    },
  });

  const showToast = () => {
    ToastAndroid.showWithGravity(
      'Survey posted',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError('');
      Keyboard.dismiss();
      let questions = [formData.surveyQuestion1];
      let multiChoiceOptions = [];
      if (formData.surveyQuestion2) {
        questions.push(formData.surveyQuestion2);
      }
      if (formData.surveyQuestion3) {
        questions.push(formData.surveyQuestion3);
      }
      if (formData.multiChoiceOptions1) {
        multiChoiceOptions.push(formData.multiChoiceOptions1);
      }
      if (formData.multiChoiceOptions2) {
        multiChoiceOptions.push(formData.multiChoiceOptions2);
      }
      if (formData.multiChoiceOptions3) {
        multiChoiceOptions.push(formData.multiChoiceOptions3);
      }

      const surveyBody = {
        uid: user.id,
        title: formData.surveyTitle,
        questions: questions,
        multiChoiceOptions: multiChoiceOptions,
      };
      console.log('formData:', surveyBody); // delete later
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      let requestUrl = `${API_URL}/surveys`;
      await axios.post(requestUrl, surveyBody);
      navigation.navigate('Surveys');
      showToast();
      reset({
        surveyTitle: '',
        surveyQuestion1: '',
        surveyQuestion2: '',
        surveyQuestion3: '',
        responseType1: '',
        responseType2: '',
        responseType3: '',
        multiChoiceOptions1: '',
        multiChoiceOptions2: '',
        multiChoiceOptions3: '',
      });
    } catch (error) {
      Keyboard.dismiss();
      setError('Failed to post survey');
      console.log('error:', error.message);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={app.container}>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}
      <ScrollView>
        {/* Survey title */}
        <View style={styles.controllerContainer}>
          <Text style={{ ...app.header, marginTop: 0 }}>Survey title</Text>
          <Controller
            name='surveyTitle'
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder='Give your survey a title'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={app.singleLineInput}
                maxLength={100}
                autoCapitalize='none'
              />
            )}
          />
          {errors.surveyTitle && (
            <Text style={styles.errorText}>survey title required</Text>
          )}
        </View>
        <SurveyQuestion control={control} errors={errors} questionIndex='1' />
        {!addSecondQuestion ? (
          <Pressable
            onPress={() => setAddSecondQuestion(true)}
            style={styles.followUpButton}
          >
            <Text>Add a follow-up question</Text>
          </Pressable>
        ) : null}
        {addSecondQuestion ? (
          <SurveyQuestion control={control} errors={errors} questionIndex='2' />
        ) : null}
        {!addThirdQuestion && addSecondQuestion ? (
          <Pressable
            onPress={() => setAddThirdQuestion(true)}
            style={styles.followUpButton}
          >
            <Text>Add another follow-up question</Text>
          </Pressable>
        ) : null}
        {addThirdQuestion ? (
          <SurveyQuestion control={control} errors={errors} questionIndex='3' />
        ) : null}
      </ScrollView>
      <Pressable
        style={app.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text style={app.buttonText}>Post survey</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  followUpButton: {
    alignItems: 'center',
    backgroundColor: COLORS.lightBG,
    borderRadius: BORDER.radius,
    height: 48,
    justifyContent: 'center',
    margin: 10,
  },
  controllerContainer: {
    margin: 10,
  },
  errorText: {
    color: '#dc3545',
  },
});

export default Create;
