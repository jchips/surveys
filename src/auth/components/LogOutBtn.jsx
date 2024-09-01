import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const LogOutBtn = () => {
  const { logout } = useAuth();
  return (
    <Pressable onPress={logout} style={styles.logOutButton}>
      <Text>Log out</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  logOutButton: {
    backgroundColor: '#eee',
    padding: 10,
    width: 100,
    borderRadius: 8,
    margin: 5,
    marginHorizontal: 10,
    alignItems: 'center',
  },
});

export default LogOutBtn;
