import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import formatDate from '../util/formatDate';
import app from '../styles/default';
import card from '../styles/card';
import { FONTSIZE } from '../styles/constants/styles';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <View style={app.container}>
      <View style={{ ...card.container, fontSize: FONTSIZE.regular }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/default-pfp.png')}
            alt='default profile picture'
            style={styles.image}
          />
        </View>
        <Text style={app.text}>
          <Text style={app.boldText}>Username: </Text>@{user.username}
        </Text>
        <Text style={app.text}>
          <Text style={app.boldText}>Account type: </Text>
          {user.role}
        </Text>
        <Text style={app.text}>
          <Text style={app.boldText}>Account created: </Text>
          {formatDate(user.createdAt)}
        </Text>
      </View>
      <Pressable style={app.button} onPress={logout}>
        <Text style={app.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
  },
});

export default Profile;
