import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import Settings from '../pages/Settings';
import Create from '../pages/Create';
import BottomTabs from '../components/BottomTabs';
import COLORS from '../styles/constants/colors';

const Stack = createStackNavigator();

const Routing = () => {
  const { isSignedIn } = useAuth();
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
            <Stack.Screen
              name='Settings'
              component={Settings}
              options={{ headerTintColor: COLORS.primary }}
            />
            <Stack.Screen
              name='Create'
              component={Create}
              options={{ headerTitle: 'Create survey' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name='Log in'
              component={Login}
              options={{ headerShadowVisible: false, headerShown: false }}
            />
            <Stack.Screen
              name='Sign up'
              component={Signup}
              options={{ headerShadowVisible: false, headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default Routing;
