import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Search from './search.js';
import Subreddit from './subreddit.js'
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function SearchRoute() {
    return (
        <Stack.Navigator initialRouteName="SearchSub">
            <Stack.Screen
                name="SearchSub"
                component={Search}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Subreddit"
                component={Subreddit}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
}