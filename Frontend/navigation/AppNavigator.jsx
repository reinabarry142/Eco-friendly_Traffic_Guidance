import React, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import AuthStack from './AuthStack';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import TripHistoryScreen from '../screens/Profile/TripHistoryScreen';
import theme from '../styles/theme';
import { AuthContext } from '../contexts/auth.context';
import VehicleSelector from '../components/Vehicules/VehicleSelector';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' }, // You could make this dynamic based on the screen.
        }}
      >
        {/* Main Screen with Bottom Tabs for Authenticated Users */}
        <Stack.Screen name="MainTabs">
          {(props) => (
            <BottomTabNavigator 
              {...props}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          )}
        </Stack.Screen>

        {/* Screens for Authenticated Users */}
        {isAuthenticated && (
          <>
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ 
                headerShown: true,
                title: 'Modifier le profil',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.white,
              }}
            />

            <Stack.Screen 
              name="TripHistory" 
              component={TripHistoryScreen}
              options={{ 
                headerShown: true,
                title: 'Historique des trajets',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.white,
              }}
            />
          </>
        )}

        {/* Authentication Stack for Login/Signup */}
        <Stack.Screen 
          name="AuthStack" 
          options={{ headerShown: false }}
        >
          {(props) => (
            <AuthStack {...props} setIsAuthenticated={setIsAuthenticated} />
          )}
        </Stack.Screen>

         {/* Écran de sélection de véhicule */}
         <Stack.Screen
          name="VehicleSelector"
          component={VehicleSelector}
          options={{
            headerShown: true,
            title: 'Choisir un véhicule',
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.white,
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
