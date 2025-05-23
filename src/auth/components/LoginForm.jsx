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
import { useForm, Controller } from 'react-hook-form';
import Constants from 'expo-constants';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../../contexts/AuthContext';
import app from '../../styles/default';

const LoginForm = ({ showToast }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, setIsSignedIn, setToken, setUser } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  /**
   * Submits the user's form responses to the serve
   * @param {Object} formData - User's form data
   */
  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const encodedToken = login(formData.username, formData.password);
      axios.defaults.headers.common['Authorization'] = `Basic ${encodedToken}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      let requestUrl = `${API_URL}/signin`;
      let response = await axios.post(requestUrl);
      setUser(response.data.user);
      setToken(response.data.token);
      setError('');
      Keyboard.dismiss();
      Platform.OS === 'android' ? showToast('Log in successful') : null;
      setIsSignedIn(true);
    } catch (error) {
      Keyboard.dismiss();
      setIsSignedIn(false);
      setError(
        error.message === 'Request failed with status code 403'
          ? 'Incorrect username or password'
          : 'Sorry, there has been a server error :('
      );
      console.error(error);
      console.error(error.message);
    }
    reset({
      username: '',
      password: '',
    });
    setIsLoading(false);
  };
  return (
    <View style={styles.container}>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}
      <View style={styles.controllerContainer}>
        <Controller
          name='username'
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='username'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              autoCapitalize='none'
              autoCorrect={false}
            />
          )}
        />
        {errors.username && (
          <Text style={styles.errorText}>username required</Text>
        )}
      </View>

      <View style={styles.controllerContainer}>
        <Controller
          name='password'
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='password'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              textContentType='password'
              autoCapitalize='none'
              autoCorrect={false}
              onSubmitEditing={handleSubmit(onSubmit)}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>password required</Text>
        )}
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={app.button}
        disabled={isLoading}
      >
        <Text style={app.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 48,
    padding: 10,
    borderRadius: 8,
  },
  controllerContainer: {
    margin: 10,
  },
  errorText: {
    color: '#dc3545',
  },
});

export default LoginForm;
