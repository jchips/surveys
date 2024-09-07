import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import Feed from '../tabs/Feed';
import Profile from '../tabs/Profile';
import Surveys from '../tabs/Surveys';
import SettingsBtn from '../components/SettingsBtn';
import app from '../styles/default';
import COLORS from '../styles/constants/colors';

const Tab = createBottomTabNavigator();

const BottomTabs = ({ navigation }) => {
  const { user } = useAuth();

  const headerOptions = {
    headerTintColor: COLORS.primary,
    headerShadowVisible: false,
    headerRight: () => {
      return <SettingsBtn navigation={navigation} />;
    },
  };
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarIconStyle: { display: 'none' },
        // tabBarButton: () => null,
        tabBarVisible: false,
        tabBarActiveBackgroundColor: COLORS.lightBG,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontWeight: '700',
          // fontFamily: 'Lato-Bold',
          fontSize: 12,
          color: COLORS.primary,
        },
      }}
    >
      <Tab.Screen
        name='Feed'
        component={Feed}
        options={{
          tabBarIcon: () => (
            <Image
              source={{
                uri: 'https://img.icons8.com/fluency-systems-regular/50/e60012/home--v1.png',
              }}
              alt='home icon'
              style={app.icon}
            />
          ),
          ...headerOptions,
        }}
      />

      {user.role === 'creator' || user.role === 'admin' ? (
        <Tab.Screen
          name='Surveys'
          component={Surveys}
          options={{
            tabBarIcon: () => (
              <Image
                source={{
                  uri: 'https://img.icons8.com/fluency-systems-regular/50/e60012/create-new.png',
                }}
                alt='create new survey icon'
                style={app.icon}
              />
            ),
            ...headerOptions,
          }}
        />
      ) : null}

      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          tabBarIcon: () => (
            <Image
              source={{
                uri: 'https://img.icons8.com/fluency-systems-regular/50/e60012/user-male-circle--v1.png',
              }}
              alt='profile icon'
              style={app.icon}
            />
          ),
          headerTitle: `@${user.username}`,
          ...headerOptions,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default BottomTabs;
