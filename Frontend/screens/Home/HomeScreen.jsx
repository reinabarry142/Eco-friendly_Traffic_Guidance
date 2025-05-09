import React, { useRef, useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HereMapView from '../../components/Common/HereMapView';
import theme from '../../styles/theme';
import RouteInput from '../../components/Common/RouteInput';
import VehicleSelector from '../../components/Vehicules/VehicleSelector';
import VehiclePicker from '../../components/Vehicules/VehiclePicker';
import { Ionicons } from '@expo/vector-icons';
import UrgencySelector from './UrgencySelector';
import RouteLegend from './RouteLegend';

const HomeScreen = ({ navigation, isAuthenticated,setIsMapReady }) => {

  const [routePoints, setRoutePoints] = useState(null);
  /*const [vehicleInfo, setVehicleInfo] = useState(null);
  const routeInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');*/

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isInAHurry, setIsInAHurry] = useState(null); // null = pas encore choisi
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [showRouteInput, setShowRouteInput] = useState(true); // état pour contrôler l'affichage de l'input
  const mapRef = useRef(null);

  // Fonction pour changer l'état du champ de saisie (rétracter ou afficher)
  const toggleRouteInput = () => {
    setShowRouteInput(!showRouteInput);
  };

  /*const handlePointsSelected = (startCoords, endCoords) => {
    setRoutePoints({ start: startCoords, end: endCoords });
    calculateRoute(startCoords, endCoords, vehicleInfo);
  };

  const handleVehicleSelect = (vehicle) => {
    setVehicleInfo(vehicle);
    if (routePoints) {
      calculateRoute(routePoints.start, routePoints.end, vehicle);
    }
  };

  const calculateRoute = (start, end, vehicle) => {
    if (!start || !end || !vehicle) return;
    
    console.log("Calcul d'itinéraire avec :", {
      start,
      end,
      vehicle
    });
    //  logique de calcul d'itinéraire
  };

  const handleSearch = () => {
    console.log("Recherche pour :", searchQuery);
    //  logique de recherche 
  };*/

  return (
    <View style={styles.container}>

      {/* Carte */}
      <HereMapView
        style={styles.map}
        mapPadding={{
          top: 70,  // Espace pour la searchBar
          right: 0,
          bottom: 60,  // Espace pour les tabs
          left: 0
        }}
        onMapReady={setIsMapReady}
        routePoints={routePoints}
        vehicleInfo={selectedVehicle}
      />

      <VehiclePicker
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        navigation={navigation}
      />
      <RouteLegend />

      <View style={styles.urgencyContainer}>
        <UrgencySelector
          isInAHurry={isInAHurry}
          setIsInAHurry={setIsInAHurry}
        />
      </View>

      {/* Icône rétractable pour afficher/cacher le formulaire de saisie */}
      {/* <TouchableOpacity
        style={styles.routeToggleButton}
        onPress={toggleRouteInput}
      >
        <Ionicons name={showRouteInput ? 'arrow-up-circle' : 'arrow-down-circle'} size={30} color="#4CAF50" />
        <Text style={styles.routeToggleText}>
          {showRouteInput ? 'Rétracter la saisie' : 'Saisir la route'}
        </Text>
      </TouchableOpacity> */}
      {/*<View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v11"
          zoomLevel={12}
        />
      </View>
*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: theme.colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.small,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },


  urgencyContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  routeToggleButton: {
    position: 'absolute',
    bottom: 80, // Positionner au-dessus de la carte, avant la destination
    left: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Ombre pour l'élément flottant
  },
  routeToggleText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
  },
  routeInputContainer: {
    position: 'absolute',
    top: 100, // Positionner plus haut sur la page
    left: 20,
    right: 20,
    zIndex: 5,// S'assurer que le formulaire est au-dessus de la carte

  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  profileButton: {
    position: 'absolute',
    bottom: 100,
    left: theme.spacing.medium,
    backgroundColor: theme.colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 5,
  },
});

export default HomeScreen;