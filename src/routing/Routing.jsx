import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import Login from '../auth/Login';
import BottomTabs from '../components/BottomTabs';
import Signup from '../auth/Signup';

const Stack = createStackNavigator();

const Routing = () => {
  const { isSignedIn, token } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen
              name='Tabs'
              component={BottomTabs}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name='Sign up'
              component={Signup}
              options={{ headerShadowVisible: 'false', headerShown: 'false' }}
            />
            <Stack.Screen
              name='Log in'
              component={Login}
              options={{ headerShadowVisible: 'false', headerShown: 'false' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default Routing;
