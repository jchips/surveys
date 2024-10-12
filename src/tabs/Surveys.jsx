import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import ModalView from '../components/ModalView';
import formatDate from '../util/formatDate';
import app from '../styles/default';
import COLORS from '../styles/constants/colors';
import { FONT, FONTSIZE } from '../styles/constants/styles';

const Surveys = ({ navigation }) => {
  const [error, setError] = useState('');
  const [createdSurveys, setCreatedSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const { user } = useAuth();

  // Loads all the current user's created surveys.
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
          setCreatedSurveys(response.data);
        } catch (error) {
          console.error(error.message);
          setError('Failed to load surveys');
        }
      };
      fetchCreatedSurveys();
      setIsLoading(false);
    }, [])
  );

  /**
   * Deletes survey for all users.
   * @param {Object} survey - The survey to delete from all databases.
   */
  const deleteSurvey = async (survey) => {
    try {
      setError('');
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      const removeReqUrl = `${API_URL}/remove/${survey.id}`;
      const responsesReqUrl = `${API_URL}/responses/${survey.id}`;
      const surveysReqUrl = `${API_URL}/surveys/${survey.id}`;

      await axios.delete(removeReqUrl);
      await axios.delete(responsesReqUrl);
      await axios.delete(surveysReqUrl);
      let createdSurveysCopy = [...createdSurveys];
      createdSurveysCopy.splice(
        createdSurveysCopy.findIndex(
          (surveyCard) => surveyCard.id === survey.id
        ),
        1
      );
      setCreatedSurveys(createdSurveysCopy);
    } catch (error) {
      console.error(error);
      setError('Failed to delete survey');
    }
  };

  // Created survey
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
          <View style={styles.cardTitle}>
            <Text style={styles.cardHeader}>{item.title}</Text>
            <Pressable
              onPress={() => {
                setSelectedSurvey(item);
                setViewModal(true);
              }}
            >
              <Image
                source={{
                  uri: 'https://img.icons8.com/fluency-systems-regular/50/e60012/trash--v1.png',
                }}
                alt='Delete icon'
                style={app.icon}
              />
            </Pressable>
          </View>
          <Text style={{ ...styles.descriptionText, fontFamily: FONT.regular }}>
            {questions[0].question.length > 50
              ? `${questions[0].question.substring(0, 50)}...`
              : questions[0].question}
          </Text>
          <Text style={[styles.descriptionText, styles.cardFooter]}>
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
      <Text style={styles.header}>Created Surveys</Text>
      <FlatList
        data={createdSurveys}
        renderItem={renderItem}
        numColumns={1}
        keyExtractor={(item) => item.id}
      />
      {selectedSurvey ? (
        <ModalView
          actionText='Delete'
          submitAction={deleteSurvey}
          selectedSurvey={selectedSurvey}
          viewModal={viewModal}
          setViewModal={setViewModal}
        />
      ) : null}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  header: {
    ...app.header,
    fontFamily: FONT.bold,
    fontWeight: 'normal',
  },
  cardHeader: {
    ...app.header,
    margin: 0,
    marginBottom: 3,
    fontFamily: FONT.bold,
    fontWeight: 'normal',
    lineHeight: 20, // can delete if preferred
  },
  cardTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardFooter: {
    color: COLORS.primary,
    fontFamily: FONT.bold,
    fontSize: FONTSIZE.small,
  },
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
