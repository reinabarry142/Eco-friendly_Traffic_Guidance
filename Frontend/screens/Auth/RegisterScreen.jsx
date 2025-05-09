import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, Keyboard } from 'react-native';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import theme from '../../styles/theme';
import { AuthContext } from '../../contexts/auth.context';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!userData.name.trim()) {
      newErrors.name = 'Le nom est requis';
      valid = false;
    }

    if (!userData.email.trim()) {
      newErrors.email = "L'email est requis";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      newErrors.email = "L'email n'est pas valide";
      valid = false;
    }

    if (!userData.password) {
      newErrors.password = 'Le mot de passe est requis';
      valid = false;
    } else if (userData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      valid = false;
    }

    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    Keyboard.dismiss(); 
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      Alert.alert('Inscription réussie');
      navigation.replace('MainTabs');
      
    } catch (err) {
      let errorMessage = err.message || 'Une erreur est survenue.';
      
      // Handle specific error cases
      if (err.message.includes('email')) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (err.message.includes('password')) {
        setErrors(prev => ({ ...prev, password: errorMessage }));
      } else {
        Alert.alert('Erreur', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Créer un compte</Text>

        <Input
          placeholder="Nom complet"
          value={userData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          icon="account-circle"
          error={errors.name}
        />

        <Input
          placeholder="Email"
          value={userData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          icon="email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          placeholder="Mot de passe"
          value={userData.password}
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry
          icon="lock"
          error={errors.password}
        />

        <Input
          placeholder="Confirmer le mot de passe"
          value={userData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
          secureTextEntry
          icon="lock"
          error={errors.confirmPassword}
        />

        <Button 
          title="S'inscrire" 
          onPress={handleRegister} 
          style={styles.button} 
          loading={isLoading}
          disabled={isLoading}
        />

        <Text style={styles.footerText}>
          Déjà un compte?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            Se connecter
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xlarge,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    textAlign: 'center',
    marginBottom: theme.spacing.xlarge,
  },
  button: {
    marginTop: theme.spacing.large,
  },
  footerText: {
    marginTop: theme.spacing.medium,
    textAlign: 'center',
    color: theme.colors.gray,
  },
  link: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
  },
});

export default RegisterScreen;