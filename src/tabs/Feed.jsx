import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import formatDate from '../util/formatDate';
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
    } catch (error) {
      console.error(error);
      setError('Failed to remove survey');
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

      {selectedSurvey ? (
        <Modal
          animationType='fade'
          transparent={true}
          visible={viewModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setViewModal(!viewModal);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={app.text}>
                Remove <Text style={app.boldText}>{selectedSurvey.title}</Text>{' '}
                survey?
              </Text>
              <Text style={app.smallText}>(This cannot be undone)</Text>
              <View style={styles.buttons}>
                <Pressable
                  style={[app.button, styles.button, styles.backButton]}
                  onPress={() => setViewModal(!viewModal)}
                >
                  <Text style={{ ...app.buttonText, color: '#000' }}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  style={[app.button, styles.button]}
                  onPress={() => {
                    removeSurvey(selectedSurvey);
                    setViewModal(!viewModal);
                  }}
                >
                  <Text style={app.buttonText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
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
    lineHeight: 20,
  },
  cardTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '45%',
  },
  backButton: {
    backgroundColor: COLORS.lightBG,
  },
  buttons: {
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: BORDER.radius,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Feed;
