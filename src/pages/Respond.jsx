import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Switch,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import app from '../styles/default';
import COLORS from '../styles/constants/colors';
import { FONTSIZE } from '../styles/constants/styles';
import card from '../styles/card';

// Respond to survey. route.params from Feed.jsx
const Respond = ({ navigation, route }) => {
  const { itemId } = route.params;
  const questions = itemId.qs;
  const [isAnon, setIsAnon] = useState(false);
  const toggleSwitch = () => setIsAnon((previousState) => !previousState);
  const { user } = useAuth();
  const {
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  return itemId ? (
    <View style={app.container}>
      <View style={card.container}>
        <Text style={[app.header, styles.title]}>{itemId.title} survey</Text>
        <Text style={{ textAlign: 'center' }}>
          created by <Text style={app.boldText}>@{itemId.createdBy}</Text>
        </Text>
      </View>
      <View style={styles.switchContainer}>
        <Text style={app.text}>
          Please choose how you would like your response to be submitted.
        </Text>
        <View style={styles.switch}>
          <Switch
            trackColor={{ false: '#767577', true: COLORS.secondary }}
            thumbColor={isAnon ? COLORS.primary : COLORS.white}
            ios_backgroundColor='#3e3e3e'
            onValueChange={toggleSwitch}
            value={isAnon}
            style={{ marginRight: Platform.OS === 'ios' ? 10 : null }}
          />
          <Text style={app.text}>anonymous</Text>
        </View>
      </View>
      <Pressable
        style={app.button}
        onPress={() =>
          navigation.navigate('SurveyResponse', {
            formData: {
              username: isAnon ? 'anon' : user.username,
            },
            index: 1,
            errors: errors,
            surveyId: itemId.id,
            surveyTitle: itemId.title,
            createdBy: itemId.createdBy,
            question: questions[0],
            questions: questions,
          })
        }
      >
        <Text style={app.buttonText}>Start survey</Text>
      </Pressable>
    </View>
  ) : (
    navigation.navigate('Error')
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: FONTSIZE.xlarge,
    marginTop: 0,
    lineHeight: 25,
  },
  text: {
    marginHorizontal: 10,
  },
  switchContainer: {
    margin: 10,
  },
  switch: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Respond;
