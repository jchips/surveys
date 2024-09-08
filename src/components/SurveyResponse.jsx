import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Pressable,
  Keyboard,
  Platform,
  ToastAndroid,
} from 'react-native';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import TextResponse from './TextResponse';
import MultiChoiceResponse from './MultiChoiceResponse';
import app from '../styles/default';

const SurveyResponse = ({ navigation, route }) => {
  const {
    formData,
    index,
    question,
    surveyTitle,
    surveyId,
    createdBy,
    questions,
  } = route.params;
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const responseIndex =
    question.responseType === 'text'
      ? `textResponse${index}`
      : `radioGroup${index}`;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // [responseIndex]: formData?.[responseIndex] || '',
    },
  });

  useEffect(() => {
    navigation.setOptions({ headerTitle: surveyTitle + ' Question ' + index });
    responseIndex
      ? reset({
          [responseIndex]: formData?.[responseIndex] || '',
        })
      : null;
  }, [navigation, index, responseIndex, formData]);

  const showToast = () => {
    ToastAndroid.showWithGravity(
      'Response submitted',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  const onNext = (data) => {
    navigation.push('SurveyResponse', {
      formData: { ...formData, ...data },
      errors,
      surveyTitle,
      surveyId,
      createdBy,
      questions,
      question: questions[index],
      index: index + 1,
    });
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      let finalFormData = { ...formData, ...data };
      let responseBody = {
        surveyId,
        createdBy,
        response: finalFormData,
      };
      console.log('responseBody:', responseBody); // delete later
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      let requestURL1 = `${API_URL}/responses`;
      await axios.post(requestURL1, responseBody);
      let requestURL2 = `${API_URL}/surveys/${surveyId}`;
      await axios.patch(requestURL2, { responder: user.id });
      Keyboard.dismiss();
      navigation.navigate('Feed');
      Platform.OS === 'android' ? showToast() : null;
    } catch (error) {
      Keyboard.dismiss();
      setError('Failed to submit response');
      console.error('error:', error.message);
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
      <Text style={app.header}>
        {questions.length < 1 ? 'Question' : 'Question ' + index}
      </Text>
      <Text style={{ ...app.text, ...styles.text }}>{question.question}</Text>
      {question.responseType === 'text' ? (
        <TextResponse control={control} index={index} errors={errors} />
      ) : (
        <MultiChoiceResponse
          control={control}
          index={index}
          errors={errors}
          choices={question.multiChoiceOptions.split(',')}
        />
      )}
      {questions[index] ? (
        <View style={styles.buttons}>
          <Pressable
            style={[app.button, styles.button]}
            onPress={() => navigation.goBack()}
          >
            <Text style={app.buttonText}>Back</Text>
          </Pressable>
          <Pressable
            style={[app.button, styles.button]}
            onPress={handleSubmit(onNext)}
          >
            <Text style={app.buttonText}>Next question</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.buttons}>
          <Pressable
            style={[app.button, styles.button]}
            onPress={() => navigation.goBack()}
          >
            <Text style={app.buttonText}>Back</Text>
          </Pressable>
          <Pressable
            style={[app.button, styles.button]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text style={app.buttonText}>Submit response</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    marginHorizontal: 10,
  },
  buttons: {
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 10,
  },
  button: {
    width: '45%',
  },
});

export default SurveyResponse;
