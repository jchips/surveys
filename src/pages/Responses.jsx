import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import formatDate from '../util/formatDate';
import app from '../styles/default';
import card from '../styles/card';
import COLORS from '../styles/constants/colors';
import { BORDER, FONTSIZE } from '../styles/constants/styles';

const ViewResponse = ({ navigation, route }) => {
  const { survey } = route.params;
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerTitle: survey.title });
  }, [navigation]);

  // Loads all responses to selected survey.
  useFocusEffect(
    React.useCallback(() => {
      const fetchResponses = async () => {
        try {
          setError('');
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${user.token}`;
          axios.defaults.headers.common['Content-Type'] = 'application/json';
          const requestUrl = `${API_URL}/responses/${survey.id}`;
          let response = await axios.get(requestUrl);
          setResponses(response.data);
        } catch (error) {
          console.error('error:', error.message);
          setError('Failed to fetch responses');
        }
        setIsLoading(false);
      };
      fetchResponses();
    }, [])
  );

  /**
   * Displays the questions with the responders' response.
   * @param {Object} question - The question object.
   * @param {String} textResponse - The text input response to the question.
   * @param {Integer} radioResponse - The index of the radio response to the question.
   * @returns {Element} - An element displaying the question with the response.
   */
  const qAndResponse = (question, textResponse, radioResponse) => {
    return (
      <>
        <Text style={[app.boldText, styles.boldText]}>{question.question}</Text>
        {(textResponse || radioResponse !== null) && (
          <Text style={app.text}>
            {textResponse
              ? textResponse
              : question.multiChoiceOptions.split(',')[radioResponse]}
          </Text>
        )}
      </>
    );
  };

  // Response card
  const renderItem = ({ item }) => {
    return (
      <View style={[card.container, styles.card]}>
        <View style={styles.cardHeader}>
          <Text style={[app.header, styles.header]}>
            {item.response.username !== 'anon' ? '@' : null}
            {item.response.username}
          </Text>
        </View>
        <View style={styles.cardBody}>
          {qAndResponse(
            survey.questions[0],
            item.response.textResponse1,
            item.response.radioGroup1
          )}
          {survey.questions[1]
            ? qAndResponse(
                survey.questions[1],
                item.response.textResponse2,
                item.response.radioGroup2
              )
            : null}
          {survey.questions[2]
            ? qAndResponse(
                survey.questions[2],
                item.response.textResponse3,
                item.response.radioGroup3
              )
            : null}
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ ...app.boldText, fontSize: FONTSIZE.xsmall }}>
            Responded: {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return !isLoading ? (
    <View style={app.container}>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}
      <View style={styles.headerContainer}>
        <Text style={app.header}>{survey.title} responses</Text>
        <Text style={app.boldText}>
          {responses.length === 1
            ? responses.length + ' response'
            : responses.length + ' responses'}
        </Text>
      </View>
      <FlatList
        data={responses}
        renderItem={renderItem}
        numColumns={1}
        keyExtractor={(item) => item.id}
      />
      {responses.length > 0 ? (
        <Pressable
          style={app.button}
          onPress={() => navigation.navigate('Graph', { responses, survey })}
        >
          <Text style={app.buttonText}>View responses as pie graph</Text>
        </Pressable>
      ) : null}
    </View>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 0,
    marginBottom: 20,
  },
  header: {
    marginBottom: 15,
    marginTop: 0,
    marginHorizontal: 0,
    color: COLORS.primary,
  },
  cardHeader: {
    alignItems: 'center',
  },
  boldText: {
    color: '#000',
  },
  card: {
    marginBottom: 10,
  },
  cardBody: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: BORDER.radius,
    padding: 10,
  },
});

export default ViewResponse;
