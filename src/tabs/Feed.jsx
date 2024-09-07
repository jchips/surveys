import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import formatDate from '../util/formatDate';
import app from '../styles/default';
import COLORS from '../styles/constants/colors';
import { FONT, FONTSIZE } from '../styles/constants/styles';

const Feed = ({ navigation }) => {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      const fetchSurveys = async () => {
        try {
          setError('');
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${user.token}`;
          axios.defaults.headers.common['Content-Type'] = 'application/json';
          const requestUrl = `${API_URL}/surveys/${user.username}/${user.id}`;
          let response = await axios.get(requestUrl);
          setSurveys(response.data.reverse());
        } catch (error) {
          console.error('error:', error.message);
          setError('Failed to fetch surveys');
        }
      };
      fetchSurveys();
    }, [])
  );

  const renderItem = ({ item }) => {
    const questions = item.questions;
    return (
      <Pressable
        style={styles.item}
        onPress={() => {
          navigation.navigate('Respond', { itemId: item });
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
            @{item.createdBy} | {formatDate(item.createdAt)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={app.container}>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}
      {surveys.length > 0 ? (
        <FlatList
          data={surveys}
          renderItem={renderItem}
          numColumns={1}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={app.newPageText}>No surveys</Text>
      )}
    </View>
  );
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

export default Feed;
