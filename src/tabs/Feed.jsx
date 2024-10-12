import React, { useState } from 'react';
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
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import ModalView from '../components/ModalView';
import formatDate from '../util/formatDate';
import showToast from '../util/showToast';
import app from '../styles/default';
import COLORS from '../styles/constants/colors';
import { BORDER, FONT, FONTSIZE } from '../styles/constants/styles';

const Feed = ({ navigation }) => {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
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

  /**
   * Removes a survey from the current user's feed.
   * @param {Object} survey - Survey to remove from feed.
   */
  const removeSurvey = async (survey) => {
    try {
      setError('');
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      const requestUrl = `${API_URL}/remove`;
      let reqBody = { user_id: user.id, survey_id: survey.id };
      await axios.post(requestUrl, reqBody);
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
    const questions = item.questions;
    return (
      <Pressable
        style={styles.item}
        onPress={() => {
          navigation.navigate('Respond', { itemId: item });
        }}
      >
        <View style={app.card}>
          {/* Survey title */}
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
                  uri: 'https://img.icons8.com/fluency-systems-regular/50/e60012/minus-sign.png',
                }}
                alt='Remove'
                style={app.icon}
              />
            </Pressable>
          </View>

          {/* Survey description */}
          <Text style={{ ...styles.descriptionText, fontFamily: FONT.regular }}>
            {questions[0].question.length > 50
              ? `${questions[0].question.substring(0, 50)}...`
              : questions[0].question}
          </Text>

          {/* Author and date */}
          <Text style={[styles.descriptionText, styles.cardFooter]}>
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
          actionText='Remove'
          submitAction={removeSurvey}
          selectedSurvey={selectedSurvey}
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
  descriptionText: {
    color: '#808080',
    marginVertical: 3,
    lineHeight: 20,
  },
  cardFooter: {
    color: COLORS.primary,
    fontFamily: FONT.bold,
    fontSize: FONTSIZE.small,
  },
});

export default Feed;
