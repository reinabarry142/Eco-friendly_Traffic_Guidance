import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import PropTypes from 'prop-types';


const RouteInput = ({ 
  startCoords, 
  endCoords, 
  onConfirm, 
  onReset,
  setStartCoords,
  setEndCoords,
  selectionMode,
  setSelectionMode,
}) => {
  const [locationPermission, setLocationPermission] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(true);

  React.useEffect(() => {
    
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  },[]);

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      Alert.alert(
        "Permission requise",
        "Veuillez autoriser l'accès à votre position",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      return [location.coords.longitude, location.coords.latitude];
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible d'obtenir votre position",
        [{ text: "OK" }]
      );
      return null;
    }
  };

  const handleCurrentLocation = async () => {
    const coords = await getCurrentLocation();
    if (coords) {
      if (selectionMode === 'start') {
        setStartCoords(coords);
      } else if (selectionMode === 'end') {
        setEndCoords(coords);
      }
    }
  };

  const toggleVisibility = () => setIsHidden(!isHidden);

  const formatCoords = (coords) => 
    coords ? `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}` : 'Non défini';

  const handleSelectPosition = (type) => {
    if (typeof setSelectionMode !== 'function') {
      console.error('setSelectionMode is not a function');
      return;
    }
    
    setSelectionMode(type);
    Alert.alert(
      "Sélection sur la carte",
      `Cliquez sur la carte pour choisir le point ${type === 'start' ? 'de départ' : "d'arrivée"}`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleVisibility}>
        <Ionicons 
          name={isHidden ? 'location-outline' : 'close-circle-outline'} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>

      {!isHidden && (
        <View style={styles.formContainer}>
          {/* Start Point */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={24} color="#4285F4" />
            <View style={styles.coordContainer}>
              <Text style={styles.label}>Point de départ</Text>
              <Text style={styles.coordText}>{formatCoords(startCoords)}</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.smallButton, styles.selectButton]}
                onPress={() => handleSelectPosition('start')}
              >
                <Text style={styles.smallButtonText}>Sélectionner</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.smallButton, styles.locationButton]}
                onPress={handleCurrentLocation}
              >
                <Ionicons name="compass-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* End Point */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={24} color="#EA4335" />
            <View style={styles.coordContainer}>
              <Text style={styles.label}>Point d'arrivée</Text>
              <Text style={styles.coordText}>{formatCoords(endCoords)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.smallButton, styles.selectButton]}
              onPress={() => handleSelectPosition('end')}
            >
              <Text style={styles.smallButtonText}>Sélectionner</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={onReset}
              disabled={!startCoords && !endCoords}
            >
              <Text style={styles.buttonText}>Réinitialiser</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              disabled={!startCoords || !endCoords}
            >
              <Text style={styles.buttonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

RouteInput.propTypes = {
  startCoords: PropTypes.array,
  endCoords: PropTypes.array,
  onConfirm: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  setStartCoords: PropTypes.func.isRequired,
  setEndCoords: PropTypes.func.isRequired,
  selectionMode: PropTypes.string,
  setSelectionMode: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 65,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    zIndex: 1,
  },
  toggleButton: {
    position: 'absolute',
    top: -30,
    right: 10,
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 20,
    zIndex: 2,
  },
  formContainer: {
    padding: 15,
    paddingTop: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  coordContainer: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  coordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: '#e0e0e0',
  },
  locationButton: {
    backgroundColor: '#4CAF50',
    width: 30,
  },
  smallButtonText: {
    fontSize: 12,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RouteInput;