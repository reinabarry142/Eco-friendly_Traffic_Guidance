import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../../components/Common/Button';
import ImageUploader from '../../components/Common/ImageUploader';
import theme from '../../styles/theme';

import * as Location from 'expo-location';
import { signalerObstruction } from '../../services/obstruction.service';

const obstructionTypes = [
  { id: 1, name: 'Embouteillage', icon: 'terrain' },
  { id: 2, name: 'Accident', icon: 'car-crash' },
  { id: 3, name: 'Inondation', icon: 'water' },
  { id: 4, name: 'Manifestations', icon: 'groups' },
];

export default function ContribuerScreen() {
  const [selectedType, setSelectedType] = useState(null);
  const [image, setImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !image) {
      Alert.alert("Erreur", "Veuillez sélectionner un type d'obstruction et une image.");
      return;
    }

    setIsLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "Impossible d'accéder à votre position.");
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const formData = new FormData();
      formData.append("image", {
        uri: image,
        name: "obstruction.jpg",
        type: "image/jpeg",
      });
      formData.append("lat", latitude);
      formData.append("lon", longitude);
      formData.append("obstruction_type", selectedType.name.toLowerCase());

      const response = await signalerObstruction(formData);
      const { status: resultStatus, message } = response;

      if (resultStatus === "confirmed") {
        setIsSubmitted(true);
      } else {
        Alert.alert("Non confirmé", message);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setImage(null);
    setIsSubmitted(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MaterialIcons name="add-location" size={50} color={theme.colors.primary} />
      <Text style={styles.title}>Signaler une obstruction</Text>
      <Text style={styles.subtitle}>
        Aidez la communauté en signalant les obstacles sur votre route
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type d'obstruction</Text>
        <View style={styles.typesContainer}>
          {obstructionTypes.map((type) => (
            <Button
              key={type.id}
              title={type.name}
              icon={type.icon}
              iconFamily="material"
              style={[
                styles.typeButton,
                selectedType?.id === type.id && styles.typeButtonSelected,
              ]}
              textStyle={[
                styles.typeText,
                selectedType?.id === type.id && styles.typeTextSelected,
              ]}
              iconColor={
                selectedType?.id === type.id ? theme.colors.white : theme.colors.primary
              }
              onPress={() => setSelectedType(type)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photo (obligatoire)</Text>
        <ImageUploader
          onImageSelected={(uri) => setImage(uri)}
          style={styles.imageUploader}
        />
      </View>

      <Button
        title={isSubmitted ? "Signalement envoyé" : "Valider le signalement"}
        onPress={handleSubmit}
        loading={isLoading}
        disabled={!selectedType || isSubmitted}
        style={[
          styles.submitButton,
          (!selectedType || isSubmitted) && styles.submitButtonDisabled,
        ]}
      />

      <Modal
        visible={isSubmitted}
        transparent
        animationType="fade"
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="check-circle" size={60} color={theme.colors.primary} />
            <Text style={styles.modalTitle}>Merci pour votre contribution!</Text>
            <Text style={styles.modalText}>
              Votre signalement a été validé et partagé avec la communauté.
            </Text>
            <Button title="Fermer" onPress={resetForm} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginVertical: theme.spacing.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.gray,
    textAlign: 'center',
    marginBottom: theme.spacing.xlarge,
  },
  section: {
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.small,
  },
  typeButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  typeText: {
    color: theme.colors.primary,
  },
  typeTextSelected: {
    color: theme.colors.white,
  },
  imageUploader: {
    marginTop: theme.spacing.small,
  },
  submitButton: {
    marginTop: theme.spacing.small,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.lightGray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xlarge,
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginVertical: theme.spacing.medium,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  modalButton: {
    width: '100%',
  },
});


