import React, {useState, useEffect, Component} from 'react';
import {Text, View, FlatList, ActivityIndicator} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { IconButton, Colors } from 'react-native-paper';
import SearchRoute from './searchroute.js'
import Profile from './profile.js'
import HomePage from './homePage.js'

const Tab = createBottomTabNavigator();

const HomeScreen = ({navigation}) => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } if (route.name === 'Profile') {
          iconName = 'account';
        } if (route.name === 'Search') {
          iconName = 'magnify'
        }
        return <IconButton icon={iconName} color={Colors.red500} size={20} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
      <Tab.Screen options={{headerShown: false}} name="Home" component={HomePage} />
      <Tab.Screen options={{headerShown: false}} name="Profile" component={Profile} />
      <Tab.Screen options={{headerShown: false, tabBarHideOnKeyboard: true}} name="Search" component={SearchRoute} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
