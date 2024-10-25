import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import ModalView from '../components/ModalView';
import Loading from '../components/Loading';
import formatDate from '../util/formatDate';
import showToast from '../util/showToast';
import api from '../util/apiService';
import app from '../styles/default';
import card from '../styles/card';
import { FONTSIZE } from '../styles/constants/styles';

const Profile = () => {
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, logout } = useAuth();

  // Set up bearer auth for user
  useEffect(() => {
    api.setTokenGetter(() => user?.token);
  }, [user]);

  // Load all users (only if the current user is an admin)
  useFocusEffect(
    React.useCallback(() => {
      const fetchUsers = async () => {
        try {
          setError('');
          let allUsers = await api.getUsers();
          let usersArr = allUsers.data.filter((u) => u.role !== 'admin');
          setUsers(usersArr.reverse());
        } catch (error) {
          console.error(error);
          setError('Failed to display users');
        }
      };
      if (user.role === 'admin') {
        fetchUsers();
      }
      setIsLoading(false);
    }, [])
  );

  // Deletes selected user's account permanently.
  // Only admins can perform this action.
  const deleteUser = async () => {
    try {
      setError('');
      await api.deleteUser(selectedUser.username, selectedUser.id);
      let usersCopy = [...users];
      usersCopy.splice(
        usersCopy.findIndex((user) => user.id === selectedUser.id),
        1
      );
      setUsers(usersCopy);
      Platform.OS === 'android'
        ? showToast(`Deleted user @${selectedUser.username}`)
        : null;
    } catch (error) {
      setError('Failed to delete user. Please try again later.');
    }
  };

  // User card
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={card.title}>@{item.username}</Text>
          <Text style={card.footer}>{formatDate(item.createdAt)}</Text>
        </View>
        <Pressable
          onPress={() => {
            setViewModal(true);
            setSelectedUser(item);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Delete user</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={app.container}>
      <View style={styles.cardContainer}>
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
          <Text style={styles.userRole}>{user.role}</Text>
        </Text>
        <Text style={app.text}>
          <Text style={app.boldText}>Account created: </Text>
          {formatDate(user.createdAt)}
        </Text>
      </View>
      {error ? (
        <View style={app.errorAlert}>
          <Text>{error}</Text>
        </View>
      ) : null}
      {user.role === 'admin' ? (
        !isLoading ? (
          <FlatList
            data={users}
            renderItem={renderItem}
            numColumns={1}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Loading />
        )
      ) : null}
      <Pressable style={app.button} onPress={logout}>
        <Text style={app.buttonText}>Log out</Text>
      </Pressable>
      {selectedUser ? (
        <ModalView
          actionText='Delete user'
          submitAction={deleteUser}
          selection={selectedUser?.username}
          viewModal={viewModal}
          setViewModal={setViewModal}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
  },
  cardContainer: {
    ...card.container,
    fontSize: FONTSIZE.regular,
    marginBottom: 5,
  },
  card: {
    ...card.container,
    flex: 1,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRole: {
    textTransform: 'capitalize',
  },
  button: {
    ...app.button,
    margin: 0,
    padding: 0,
    height: 40,
  },
  buttonText: {
    ...app.buttonText,
    margin: 0,
    lineHeight: 15,
    paddingHorizontal: 15,
    fontSize: FONTSIZE.small,
  },
});

export default Profile;
