import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Constants from 'expo-constants';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ showToast }) => {
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
  const [error, setError] = useState('');
  const { login, setIsSignedIn, setToken, token } = useAuth();

  const onSubmit = async (formData) => {
    try {
      const encodedToken = login(formData.username, formData.password);
      axios.defaults.headers.common['Authorization'] = `Basic ${encodedToken}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      let requestUrl = `${API_URL}/signin`;
      let response = await axios.post(requestUrl);
      setToken(response.data.token);
      setError('');
      Keyboard.dismiss();
      showToast();
      setIsSignedIn(true);
    } catch (error) {
      Keyboard.dismiss();
      setIsSignedIn(false);
      setError('Incorrect username or password');
    }
    reset({
      username: '',
      password: '',
    });
  };
  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.alertColor}>
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
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>password required</Text>
        )}
      </View>

      <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 0.5,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    width: '100%',
  },
  alertColor: {
    backgroundColor: 'rgb(248, 215, 218)',
    padding: 16,
    borderRadius: 8,
    margin: 10,
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
  button: {
    alignItems: 'center',
    backgroundColor: 'rgb(93, 95, 222)',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    margin: 10,
  },
  errorText: {
    color: '#dc3545',
  },
});

export default LoginForm;
