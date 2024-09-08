import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import app from '../styles/default';
import formatDate from '../util/formatDate';
import COLORS from '../styles/constants/colors';
import { BORDER, FONTSIZE } from '../styles/constants/styles';

const ViewResponse = ({ navigation, route }) => {
  const { survey } = route.params;
  const [error, setError] = useState('');
  const [responses, setResponses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerTitle: survey.title });
  }, [navigation]);

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
          setResponses(response.data.reverse());
        } catch (error) {
          console.error('error:', error.message);
          setError('Failed to fetch responses');
        }
      };
      fetchResponses();
    }, [])
  );

  const renderItem = ({ item }) => {
    return (
      <View style={[app.card, styles.card]}>
        <View style={styles.cardHeader}>
          <Text style={[app.header, styles.header]}>
            {item.response.username !== 'anon' ? '@' : null}
            {item.response.username}
          </Text>
        </View>
        {/* TODO: make more DRY */}
        <View style={styles.cardBody}>
          <Text style={[app.boldText, styles.boldText]}>
            {survey.questions[0].question}
          </Text>
          <Text style={app.text}>
            {item.response.textResponse1
              ? item.response.textResponse1
              : survey.questions[0].multiChoiceOptions.split(',')[
                  item.response.radioGroup1
                ]}
          </Text>
          {survey.questions[1] ? (
            <>
              <Text style={[app.boldText, styles.boldText]}>
                {survey.questions[1].question}
              </Text>
              {item.response.textResponse2 ||
              item.response.radioGroup2 !== null ? (
                <Text style={app.text}>
                  {item.response.textResponse2
                    ? item.response.textResponse2
                    : survey.questions[1].multiChoiceOptions.split(',')[
                        item.response.radioGroup2
                      ]}
                </Text>
              ) : null}
            </>
          ) : null}
          {survey.questions[2] ? (
            <>
              <Text style={[app.boldText, styles.boldText]}>
                {survey.questions[2].question}
              </Text>

              {item.response.textResponse3 ||
              item.response.radioGroup3 !== null ? (
                <Text style={app.text}>
                  {item.response.textResponse3
                    ? item.response.textResponse3
                    : survey.questions[2].multiChoiceOptions.split(',')[
                        item.response.radioGroup3
                      ]}
                </Text>
              ) : null}
            </>
          ) : null}
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ ...app.boldText, fontSize: FONTSIZE.small }}>
            Responded: {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={app.container}>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}
      <View style={styles.headerContainer}>
        <Text style={app.header}>{survey.title} Responses</Text>
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
      <Pressable style={app.button}>
        <Text style={app.buttonText}>View responses as pie graph</Text>
      </Pressable>
    </View>
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
    color: '#000000',
  },
  card: {
    marginVertical: 5,
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
