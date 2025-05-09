import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Modal, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import theme from '../../styles/theme';

const ImageUploader = ({ onImageSelected, initialImage = null, style }) => {
  const [image, setImage] = useState(initialImage);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);

  const verifyPermissions = async () => {
    if (cameraPermission?.status !== 'granted') {
      const { status } = await requestCameraPermission();
      return status === 'granted';
    }
    return true;
  };

  const launchImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: false,
        selectionLimit: 1,
      });

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets?.length > 0) {
        const selectedImage = result.assets[0].uri;
        setImage(selectedImage);
        onImageSelected(selectedImage);
      }
    } catch (error) {
      console.error('Image selection error:', error);
      throw error;
    }
  };

  const handlePhotoLibraryAccess = async () => {
    setIsLoading(true);
    try {
      // First check current permission status
      let { status, accessPrivileges } = await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log("Initial permissions:", { status, accessPrivileges });

      // If denied or undetermined, request permission
      if (status !== 'granted') {
        console.log("Requesting media library permission...");
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Permission request result:", newStatus);
        
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permission requise',
            'Pour accéder à votre galerie, veuillez autoriser l\'accès dans les paramètres.',
            [
              { text: 'Annuler', style: 'cancel' },
              { 
                text: 'Ouvrir Paramètres', 
                onPress: () => Linking.openSettings() 
              }
            ]
          );
          return false;
        }
        status = newStatus;
      }

      // Handle limited access on iOS 14+
      if (Platform.OS === 'ios' && accessPrivileges === 'limited') {
        Alert.alert(
          'Accès limité',
          'Vous avez accordé un accès limité. Pour voir tous vos albums, veuillez autoriser l\'accès complet dans les paramètres.',
          [
            { 
              text: 'Continuer avec accès limité', 
              onPress: () => launchImagePicker() 
            },
            { 
              text: 'Modifier les permissions', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        return true;
      }

      await launchImagePicker();
      return true;
    } catch (error) {
      console.error('Permission handling error:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la galerie.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async (source) => {
    setShowSourceModal(false);
    console.log("Image selection started. Source:", source);

    try {
      if (source === 'camera') {
        console.log("Requesting camera permission...");
        const hasPermission = await verifyPermissions();
        console.log("Camera permission status:", hasPermission);

        if (!hasPermission) {
          Alert.alert(
            'Permission requise',
            'Nous avons besoin de votre permission pour accéder à votre caméra.',
            [{ text: 'OK' }]
          );
          return;
        }

        console.log("Launching camera...");
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (!result.canceled && result.assets?.length > 0) {
          const selectedImage = result.assets[0].uri;
          setImage(selectedImage);
          onImageSelected(selectedImage);
        }
      } else {
        await handlePhotoLibraryAccess();
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  };

  const removeImage = () => {
    setImage(null);
    onImageSelected(null);
  };

  return (
    <View style={[styles.container, style]}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <MaterialIcons name="close" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={() => setShowSourceModal(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <>
              <MaterialIcons name="add-a-photo" size={32} color={theme.colors.primary} />
              <Text style={styles.uploadText}>Ajouter une photo</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      <Modal
        visible={showSourceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir la source</Text>
            
            <TouchableOpacity 
              style={styles.sourceButton}
              onPress={() => pickImage('camera')}
              disabled={isLoading}
            >
              <MaterialIcons name="photo-camera" size={24} color={theme.colors.primary} />
              <Text style={styles.sourceButtonText}>Prendre une photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.sourceButton}
              onPress={() => pickImage('gallery')}
              disabled={isLoading}
            >
              <MaterialIcons name="photo-library" size={24} color={theme.colors.primary} />
              <Text style={styles.sourceButtonText}>Choisir depuis la galerie</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowSourceModal(false)}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.medium,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: theme.spacing.small,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.medium,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme.colors.error,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: theme.spacing.large,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  sourceButtonText: {
    marginLeft: theme.spacing.medium,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
  },
  cancelButton: {
    padding: theme.spacing.medium,
    alignItems: 'center',
    marginTop: theme.spacing.small,
  },
  cancelButtonText: {
    color: theme.colors.error,
    fontFamily: theme.fonts.medium,
  },
});

export default ImageUploader;