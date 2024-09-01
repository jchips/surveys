import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from '../tabs/Feed';
import Settings from '../tabs/Settings';
import LogOutBtn from '../auth/components/LogOutBtn';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIconStyle: { display: 'none' },
        tabBarLabelPosition: 'beside-icon',
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 15,
        },
      }}
    >
      <Tab.Screen
        name='Feed'
        component={Feed}
        options={{
          headerRight: () => {
            return <LogOutBtn />;
          },
        }}
      />
      <Tab.Screen name='Settings' component={Settings} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default BottomTabs;
