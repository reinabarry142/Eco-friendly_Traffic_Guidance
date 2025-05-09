// src/navigation/AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/Home/HomeScreen';
import VehiclePicker from '../components/Vehicules/VehiclePicker';

const Stack = createStackNavigator();

const VehicleNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="VehiclePicker" component={VehiclePicker} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default VehicleNavigator;