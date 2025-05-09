// LoginScreen.jsx
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import theme from '../../styles/theme';
import { AuthContext } from '../../contexts/auth.context';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      Alert.alert('Connexion réussie');
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Erreur', err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="eco" size={80} color={theme.colors.primary} />
        </View>

        <Text style={styles.title}>Eco-Friendly Traffic</Text>
        <Text style={styles.subtitle}>Conduisez plus vert</Text>

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

        <Text style={styles.footerText}>
          Pas encore de compte?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          >
            S'inscrire
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    marginTop: 24,
  },
  footerText: {
    marginTop: 24,
    textAlign: 'center',
    color: theme.colors.gray,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
