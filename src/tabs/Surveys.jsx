import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import formatDate from '../util/formatDate';
import app from '../styles/default';
import COLORS from '../styles/constants/colors';
import { FONT, FONTSIZE } from '../styles/constants/styles';

const Surveys = ({ navigation }) => {
  const [error, setError] = useState('');
  const [createdSurveys, setCreatedSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      const fetchCreatedSurveys = async () => {
        try {
          setError('');
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${user.token}`;
          axios.defaults.headers.common['Content-Type'] = 'application/json';
          const requestUrl = `${API_URL}/surveys?createdBy=${user.username}`;
          let response = await axios.get(requestUrl);
          setCreatedSurveys(response.data.reverse());
        } catch (error) {
          console.error(error.message);
          setError('Failed to load surveys');
        }
      };
      fetchCreatedSurveys();
      setIsLoading(false);
    }, [])
  );

  const renderItem = ({ item }) => {
    const questions = item.questions;
    return (
      <Pressable
        style={styles.item}
        onPress={() => {
          navigation.navigate('Responses', {
            survey: item,
          });
        }}
      >
        <View style={app.card}>
          <Text
            style={{
              ...app.header,
              margin: 0,
              marginBottom: 3,
              fontFamily: FONT.bold,
              fontWeight: 'normal',
            }}
          >
            {item.title}
          </Text>
          <Text style={{ ...styles.descriptionText, fontFamily: FONT.regular }}>
            {questions[0].question.length > 50
              ? `${questions[0].question.substring(0, 50)}...`
              : questions[0].question}
          </Text>
          <Text
            style={{
              ...styles.descriptionText,
              color: COLORS.primary,
              fontFamily: FONT.bold,
              fontSize: FONTSIZE.small,
            }}
          >
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return !isLoading ? (
    <View style={app.container}>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}
      <Pressable
        style={app.button}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={app.buttonText}>Create new</Text>
      </Pressable>
      <Text
        style={{
          ...app.header,
          fontFamily: FONT.bold,
          fontWeight: 'normal',
        }}
      >
        Created Surveys
      </Text>
      <FlatList
        data={createdSurveys}
        renderItem={renderItem}
        numColumns={1}
        keyExtractor={(item) => item.id}
      />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 5,
    width: '100%',
  },
  descriptionText: {
    color: '#808080',
    marginVertical: 3,
  },
});

export default Surveys;
