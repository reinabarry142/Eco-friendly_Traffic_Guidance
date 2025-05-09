import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import theme from '../../styles/theme';

const EditProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    transportPref: 'vélo',
  });

  const handleSave = () => {
    // Ici vous ajouterez la logique pour sauvegarder les modifications
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <MaterialIcons name="account-circle" size={100} color={theme.colors.primary} />
        </View>
        <Text style={styles.changePhoto}>Changer la photo</Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Nom complet"
          value={user.name}
          onChangeText={(text) => setUser({...user, name: text})}
          icon="account-circle"
        />
        
        <Input
          label="Email"
          value={user.email}
          onChangeText={(text) => setUser({...user, email: text})}
          keyboardType="email-address"
          icon="email"
        />
        
        <Input
          label="Téléphone"
          value={user.phone}
          onChangeText={(text) => setUser({...user, phone: text})}
          keyboardType="phone-pad"
          icon="phone"
        />
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mode de transport préféré</Text>
          <View style={styles.transportOptions}>
            {['vélo', 'transports', 'marche', 'voiture'].map((transport) => (
              <View key={transport} style={styles.transportOption}>
                <MaterialIcons
                  name={
                    transport === 'vélo' ? 'directions-bike' :
                    transport === 'transports' ? 'directions-bus' :
                    transport === 'marche' ? 'directions-walk' : 'directions-car'
                  }
                  size={24}
                  color={user.transportPref === transport ? theme.colors.primary : theme.colors.gray}
                />
                <Text 
                  style={[
                    styles.transportText,
                    user.transportPref === transport && styles.transportTextSelected
                  ]}
                >
                  {transport}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Enregistrer les modifications"
          onPress={handleSave}
          style={styles.saveButton}
        />
        <Button
          title="Annuler"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  changePhoto: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    color: theme.colors.text,
    fontWeight: '500',
  },
  transportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transportOption: {
    alignItems: 'center',
    padding: 10,
  },
  transportText: {
    marginTop: 5,
    color: theme.colors.gray,
  },
  transportTextSelected: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  cancelButtonText: {
    color: theme.colors.text,
  },
});

export default EditProfileScreen;
