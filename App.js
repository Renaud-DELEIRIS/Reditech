import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoadingScreen from './loadscreen.js';
import HomeScreen from './home.js'
import {createStackNavigator} from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { apiReddit } from './src/API/reddit.js';
import { Button } from "react-native-paper";

const Stack = createStackNavigator();

export const api = new apiReddit();

function loginScreen(props) {
  return (
    <Button
    style={{ marginBottom: 3 }}
    mode="contained"
    onPress={async () => {
      await api.connectUser();
      if (api.checkConnected())
        props.navigation.replace('HomeScreen');
    }}
  >
    Login
  </Button>
  );
}

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
    <Stack.Navigator initialRouteName="LoadingScreen">
      <Stack.Screen
        name="LoadingScreen"
        component={loginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{headerShown: false}}
      />
    </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}
