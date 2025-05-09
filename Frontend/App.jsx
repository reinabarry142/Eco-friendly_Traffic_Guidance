import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/auth.context';


const App = () => {

  return (
    <AuthProvider>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <AppNavigator 
      />
    </AuthProvider>
    
  );
};

export default App;