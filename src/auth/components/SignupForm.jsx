import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  CheckBox,
  Keyboard,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useForm, Controller } from 'react-hook-form';
import Constants from 'expo-constants';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../../contexts/AuthContext';
import app from '../../styles/default';
import { FONTSIZE } from '../../styles/constants/styles';
import COLORS from '../../styles/constants/colors';

const SignupForm = ({ showToast }) => {
  const [error, setError] = useState('');
  const { login, setIsSignedIn, setToken, token } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      acl: false,
    },
  });

  const onSubmit = async (formData) => {
    try {
      if (formData.password !== formData.confirmPassword) {
        return setError('Passwords do not match');
      }

      const newUserBody = {
        username: formData.username,
        password: formData.password,
        role: formData.acl,
      };
      console.log('formData:', newUserBody); // delete later

      // const encodedToken = login(formData.username, formData.password);
      // axios.defaults.headers.common['Authorization'] = `Basic ${encodedToken}`;
      // axios.defaults.headers.common['Content-Type'] = 'application/json';
      let requestUrl = `${API_URL}/signup`;
      let response = await axios.post(requestUrl, newUserBody);
      // setToken(response.data.token);
      setError('');
      Keyboard.dismiss();
      showToast();
      // setIsSignedIn(true);
    } catch (error) {
      Keyboard.dismiss();
      setIsSignedIn(false);
      setError('Failed to create account');
    }
    reset({
      username: '',
      password: '',
    });
  };
  return (
    <View style={styles.container}>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}

      {/* Username */}
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

      {/* Password */}
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

      {/* Confirm password */}
      <View style={styles.controllerContainer}>
        <Controller
          name='confirmPassword'
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='confirm password'
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

      {/* Account type */}
      <View style={styles.controllerContainer}>
        <Controller
          name='acl'
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <RNPickerSelect
              placeholder={{ label: 'Choose an account type', value: null }}
              onValueChange={onChange}
              value={value}
              items={[
                { label: 'User', value: 'user' },
                { label: 'Creator', value: 'creator' },
              ]}
            />
          )}
        />
        {errors.acl && (
          <Text style={styles.errorText}>account type required</Text>
        )}
      </View>

      <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text style={{ fontSize: FONTSIZE.regular, color: COLORS.white }}>
          Submit
        </Text>
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
  alertColor: {
    // can delete
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
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    margin: 10,
  },
  errorText: {
    color: '#dc3545',
  },
});

export default SignupForm;
