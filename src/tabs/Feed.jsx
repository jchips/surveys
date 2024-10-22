import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import ModalView from '../components/ModalView';
import formatDate from '../util/formatDate';
import showToast from '../util/showToast';
import api from '../util/apiService';
import app from '../styles/default';
import card from '../styles/card';
import { FONT } from '../styles/constants/styles';

const Feed = ({ navigation }) => {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const { user, token } = useAuth();

  // Set up bearer auth for user
  useEffect(() => {
    api.setTokenGetter(() => token);
  }, [token]);

  // Loads all the surveys in the current user's feed.
  useFocusEffect(
    React.useCallback(() => {
      const fetchSurveys = async () => {
        try {
          setError('');
          let response = await api.getFeed(
            `/surveys/${user.username}/${user.id}`
          );
          setSurveys(response.data);
        } catch (error) {
          console.error('error:', error.message);
          setError('Failed to fetch surveys');
        }
      };
      fetchSurveys();
    }, [])
  );

  /**
   * Removes a survey from the current user's feed.
   * @param {Object} survey - Survey to remove from feed.
   */
  const removeSurvey = async (survey) => {
    try {
      setError('');
      let reqBody = { user_id: user.id, survey_id: survey.id };
      await api.postRemove(reqBody);
      let surveysCopy = [...surveys];
      surveysCopy.splice(
        surveysCopy.findIndex((surveyCard) => surveyCard.id === survey.id),
        1
      );
      setSurveys(surveysCopy);
      Platform.OS === 'android'
        ? showToast('Removed survey successfully')
        : null;
    } catch (error) {
      console.error(error);
      setError('Failed to remove survey. Please try again later.');
    }
  };

  // Survey card
  const renderItem = ({ item }) => {
    const questions = item.qs;
    return (
      <Pressable
        style={styles.item}
        onPress={() => {
          navigation.navigate('Respond', { itemId: item });
        }}
      >
        <View style={card.container}>
          {/* Survey title */}
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
                  uri: 'https://img.icons8.com/fluency-systems-regular/50/e60012/minus-sign.png',
                }}
                alt='Remove'
                style={app.icon}
              />
            </Pressable>
          </View>

          {/* Survey description */}
          <Text style={{ ...card.descriptionText, fontFamily: FONT.regular }}>
            {questions[0].question.length > 50
              ? `${questions[0].question.substring(0, 50)}...`
              : questions[0].question}
          </Text>

          {/* Author and date */}
          <Text style={[card.descriptionText, card.footer]}>
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

      {selectedSurvey ? (
        <ModalView
          actionText='Remove survey'
          submitAction={removeSurvey}
          selection={selectedSurvey}
          viewModal={viewModal}
          setViewModal={setViewModal}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 5,
    width: '100%',
  },
});

export default Feed;
