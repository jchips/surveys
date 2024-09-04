import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../contexts/AuthContext';
import formatDate from '../util/formatDate';
import app from '../styles/default';
import COLORS from '../styles/constants/colors';
import { FONTSIZE } from '../styles/constants/styles';

const Surveys = ({ navigation }) => {
  const [error, setError] = useState('');
  const [createdSurveys, setCreatedSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const [fontLoaded] = useFonts({
    'Lato-Regular': require('./../../assets/Lato-Regular.ttf'),
    'Lato-Bold': require('./../../assets/Lato-Bold.ttf'),
    NunitoSans: require('./../../assets/NunitoSans.ttf'),
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchCreatedSurveys = async () => {
        try {
          setError('');
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${user.token}`;
          axios.defaults.headers.common['Content-Type'] = 'application/json';
          const requestUrl = `${API_URL}/surveys?uid=${user.id}`;
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

  const renderItem = ({ item }) => {
    return (
      <Pressable style={styles.item} onPress={() => {}}>
        <View style={app.card}>
          <Text style={{ ...app.header, margin: 0, marginBottom: 3 }}>
            {item.title}
          </Text>
          {/* <View
            style={{
              borderBottomColor: '#eee',
              borderBottomWidth: 1,
              marginVertical: 6,
              width: '27%',
              borderRadius: 8,
            }}
          /> */}
          <Text style={styles.descriptionText}>
            {item.questions[0].length > 100
              ? `${item.questions[0].substring(0, 100)}...`
              : item.questions[0]}
          </Text>
          <Text
            style={{
              ...styles.descriptionText,
              fontStyle: 'italic',
              color: COLORS.primary,
              fontFamily: 'NunitoSans',
              fontSize: FONTSIZE.small,
              fontWeight: 700,
              // color: '#C7C7CD',
            }}
          >
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return !isLoading && fontLoaded ? (
    <View style={{ ...app.container }}>
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
      <Text style={{ ...app.header, fontFamily: 'NunitoSans' }}>
        Created Surveys
      </Text>
      <FlatList
        data={createdSurveys}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
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
