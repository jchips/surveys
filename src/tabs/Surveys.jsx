import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import ModalView from '../components/ModalView';
import Loading from '../components/Loading';
import formatDate from '../util/formatDate';
import api from '../util/apiService';
import app from '../styles/default';
import card from '../styles/card';
import { FONT } from '../styles/constants/styles';

const Surveys = ({ navigation }) => {
  const [error, setError] = useState('');
  const [createdSurveys, setCreatedSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const { user } = useAuth();

  // Set up bearer auth for user
  useEffect(() => {
    api.setTokenGetter(() => user?.token);
  }, [user]);

  // Loads all the current user's created surveys.
  useFocusEffect(
    React.useCallback(() => {
      const fetchCreatedSurveys = async () => {
        try {
          setError('');
          let response = await api.getSurveys(
            `/surveys?createdBy=${user.username}`
          );
          setCreatedSurveys(response.data);
        } catch (error) {
          console.error(error.message);
          setError('Failed to load surveys');
        }
        setIsLoading(false);
      };
      fetchCreatedSurveys();
    }, [])
  );

  /**
   * Deletes survey for all users.
   * @param {Object} survey - The survey to delete from all databases.
   */
  const deleteSurvey = async (survey) => {
    try {
      setError('');
      await api.deleteSurvey(survey.id);
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
    const questions = item.qs; // change to questions later
    return (
      <Pressable
        style={styles.item}
        onPress={() => {
          navigation.navigate('Responses', {
            survey: item,
          });
        }}
      >
        <View style={card.container}>
          <View style={card.header}>
            <Text style={card.title}>{item.title}</Text>
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
          <Text style={{ ...card.descriptionText, fontFamily: FONT.regular }}>
            {questions[0].question.length > 50
              ? `${questions[0].question.substring(0, 50)}...`
              : questions[0].question}
          </Text>
          <Text style={[card.descriptionText, card.footer]}>
            {formatDate(item.createdAt)}
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
      <Pressable
        style={app.button}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={app.buttonText}>Create new</Text>
      </Pressable>
      <Text style={styles.header}>Created Surveys</Text>
      {!isLoading ? (
        createdSurveys.length > 0 ? (
          <FlatList
            data={createdSurveys}
            renderItem={renderItem}
            numColumns={1}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={styles.text}>No created surveys yet.</Text>
        )
      ) : (
        <Loading />
      )}
      {selectedSurvey ? (
        <ModalView
          actionText='Delete survey'
          submitAction={deleteSurvey}
          selection={selectedSurvey}
          viewModal={viewModal}
          setViewModal={setViewModal}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    ...app.header,
    fontFamily: FONT.bold,
    fontWeight: 'normal',
  },
  item: {
    marginVertical: 5,
    width: '100%',
  },
  text: {
    ...app.text,
    textAlign: 'center',
  },
});

export default Surveys;
