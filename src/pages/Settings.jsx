import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import ModalView from '../components/ModalView';
import api from '../util/apiService';
import app from '../styles/default';
import card from '../styles/card';

const Settings = ({ navigation }) => {
  const [error, setError] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const { user, logout } = useAuth();

  // Set up bearer auth for user
  useEffect(() => {
    api.setTokenGetter(() => user?.token);
  }, [user]);

  // Deletes a user's account
  const deleteAccount = async () => {
    try {
      setError('');
      await api.deleteUser(user.username, user.id);
      logout();
    } catch (error) {
      setError('Failed to delete account. Please try again later.');
    }
  };

  return (
    <View style={app.container}>
      <Pressable onPress={() => navigation.navigate('About')}>
        <View style={[card.container, styles.card]}>
          <Text style={[card.title]}>About Surveys</Text>
        </View>
      </Pressable>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}
      <Pressable style={app.button} onPress={() => setViewModal(true)}>
        <Text style={app.buttonText}>Delete account</Text>
      </Pressable>
      <ModalView
        actionText='Delete account'
        submitAction={deleteAccount}
        selection={user.username}
        viewModal={viewModal}
        setViewModal={setViewModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 5,
  },
});

export default Settings;
