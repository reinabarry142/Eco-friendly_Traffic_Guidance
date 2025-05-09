import React,{useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import { AuthContext } from '../contexts/auth.context';

const Stack = createStackNavigator();

const AuthStack = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login"
        options={{ headerShown: false }}
      >
        {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      
      <Stack.Screen 
        name="Register" 
        options={{ 
          title: 'Inscription',
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#fff',
        }}
      >
        {(props) => <RegisterScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;