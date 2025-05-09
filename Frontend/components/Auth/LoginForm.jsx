import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../Common/Input';
import Button from '../Common/Button';
import theme from '../../styles/theme';

const LoginForm = ({ email, setEmail, password, setPassword, handleLogin, isLoading }) => {
  return (
    <View style={styles.container}>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        icon="email"
        keyboardType="email-address"
      />
      
      <Input
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        icon="lock"
      />
      
      <Button 
        title="Se connecter" 
        onPress={handleLogin} 
        style={styles.button}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.large,
  },
});

export default LoginForm;