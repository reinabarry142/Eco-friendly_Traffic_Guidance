import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../Common/Input';
import Button from '../Common/Button';
import theme from '../../styles/theme';

const RegisterForm = ({ 
  name, setName, 
  email, setEmail, 
  password, setPassword, 
  confirmPassword, setConfirmPassword, 
  handleRegister, isLoading 
}) => {
  return (
    <View style={styles.container}>
      <Input
        placeholder="Nom complet"
        value={name}
        onChangeText={setName}
        icon="account-circle"
      />
      
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
      
      <Input
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        icon="lock"
      />
      
      <Button 
        title="S'inscrire" 
        onPress={handleRegister} 
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

export default RegisterForm;