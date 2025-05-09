import React from 'react';
import { View, StyleSheet, Text, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import Button from '../../components/Common/Button';

const AuthPromptScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../../assets/images/eco-bg.jpg')} 
      style={styles.container}
      blurRadius={2}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="eco" size={60} color={theme.colors.primary} />
            <Text style={styles.title}>Rejoignez la communauté</Text>
            <Text style={styles.subtitle}>Accédez à votre profil et gagnez des points éco</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              title="Se connecter"
              onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}
              style={styles.primaryButton}
              icon="login"
              iconColor="white"
            />

            <Button
              title="Créer un compte"
              onPress={() => navigation.navigate('AuthStack', { screen: 'Register' })}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
              icon="person-add"
              iconColor={theme.colors.primary}
            />
          </View>

          <View style={styles.benefitsContainer}>
            {[
              { icon: 'local-offer', text: 'Récompenses écologiques' },
              { icon: 'show-chart', text: 'Suivi de votre impact' },
              { icon: 'star', text: 'Accès exclusifs' }
            ].map((item, index) => (
              <View key={index} style={styles.benefitItem}>
                <MaterialIcons name={item.icon} size={20} color={theme.colors.primary} />
                <Text style={styles.benefitText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  buttonsContainer: {
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
  benefitsContainer: {
    marginTop: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    marginLeft: 12,
    color: theme.colors.text,
  },
});

export default AuthPromptScreen;