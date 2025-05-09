import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Itinerary = ({ webViewRef, onRouteSelect, startCoords, endCoords, setShowRouteOptions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const generateRoutes = async () => {
    if (!startCoords || !endCoords) return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate 3 different driving routes with different distances
      const routeOptions = [
        { type: 'driving', profile: 'driving', color: '#4AA68F', name: 'Le plus rapide', waypoints: [] },
        { type: 'driving', profile: 'driving', color: '#FFD700', name: 'Équilibré', waypoints: [[startCoords[0] + (endCoords[0]-startCoords[0])*0.3, startCoords[1] + (endCoords[1]-startCoords[1])*0.3]] },
        { type: 'driving', profile: 'driving', color: '#FF4500', name: 'Panoramique', waypoints: [
          [startCoords[0] + (endCoords[0]-startCoords[0])*0.2, startCoords[1] + (endCoords[1]-startCoords[1])*0.4],
          [startCoords[0] + (endCoords[0]-startCoords[0])*0.7, startCoords[1] + (endCoords[1]-startCoords[1])*0.6]
        ]},
        { type: 'cycling', profile: 'cycling', color: '#1E90FF', name: 'Vélo', waypoints: [] },
        { type: 'walking', profile: 'walking', color: '#9370DB', name: 'Marche', waypoints: [] }
      ];

      const generatedRoutes = [];

      for (let i = 0; i < routeOptions.length; i++) {
        const { type, profile, color, name, waypoints } = routeOptions[i];

        // Construct coordinates array with waypoints
        const allCoords = [startCoords, ...waypoints, endCoords];
        const coordinatesString = allCoords.map(c => `${c[0]},${c[1]}`).join(';');

        const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinatesString}?geometries=geojson&access_token=pk.eyJ1IjoicGNkMjAyNSIsImEiOiJjbTlteWtjYmQwamdkMmtxdW15dGp3bXdsIn0.1ifFbARPyMRFgASXXuVymw`;

        const response = await fetch(routeUrl);
        const data = await response.json();

        if (!data.routes || !data.routes[0]) continue;

        const route = data.routes[0];
        generatedRoutes.push({
          id: `route-${i}`,
          type,
          profile,
          coordinates: route.geometry.coordinates,
          distance: route.distance,
          duration: route.duration,
          color,
          name,
          carbonEmissions: calculateCarbonEmissions(type, route.distance),
          waypoints
        });
      }

      // Sort driving routes by distance (shortest first)
      const drivingRoutes = generatedRoutes.filter(r => r.type === 'driving').sort((a, b) => a.distance - b.distance);
      const otherRoutes = generatedRoutes.filter(r => r.type !== 'driving');

      setRoutes([...drivingRoutes, ...otherRoutes]);
      if (drivingRoutes.length > 0) {
        setSelectedRoute(drivingRoutes[0]);
        drawRoute(drivingRoutes[0]);
      }
    } catch (err) {
      console.error('Erreur lors de la génération des itinéraires:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCarbonEmissions = (type, distance) => {
    const distanceKm = distance / 1000;
    switch(type) {
      case 'driving': return (distanceKm * 0.12).toFixed(2);
      case 'cycling': return '0.00';
      case 'walking': return '0.00';
      default: return 'N/A';
    }
  };

  const drawRoute = async (route) => {
    if (!webViewRef?.current) return;

    try {
      const routeString = JSON.stringify(route.coordinates);

      const script = `
        try {
          // Update route
          const routeGeoJSON = ${routeString};
          if (map && map.getSource('route')) {
            map.getSource('route').setData({
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeGeoJSON
              }
            });
            map.setPaintProperty('route', 'line-color', '${route.color}');
          }

          // Fly to the route bounds
          const coords = routeGeoJSON;
          const bounds = coords.reduce((bounds, coord) => {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coords[0], coords[0]));

          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        } catch(e) {
          console.error('Erreur du script:', e);
        }
        true;
      `;

      await webViewRef.current.injectJavaScript(script);
      if (selectedRoute) setSelectedRoute(route);
    } catch (err) {
      console.error('Erreur lors du dessin de l\'itinéraire:', err);
      setError(err.message);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    drawRoute(route);
  };

  useEffect(() => {
    if (startCoords && endCoords) {
      generateRoutes();
    }
  }, [startCoords, endCoords]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowRouteOptions(false)} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Options d'itinéraires</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4AA68F" />
          <Text style={styles.loadingText}>Calcul des itinéraires...</Text>
        </View>
      ) : (
        <>
          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeOption,
                {
                  backgroundColor: selectedRoute?.id === route.id ? route.color : `${route.color}30`,
                  borderColor: route.color,
                  borderWidth: selectedRoute?.id === route.id ? 2 : 1
                }
              ]}
              onPress={() => handleRouteSelect(route)}
            >
              <View style={styles.routeInfo}>
                <MaterialIcons
                  name={route.type === 'driving' ? 'directions-car' :
                        route.type === 'cycling' ? 'directions-bike' : 'directions-walk'}
                  size={20}
                  color={selectedRoute?.id === route.id ? 'white' : route.color}
                />
                <Text style={[
                  styles.routeText,
                  { color: selectedRoute?.id === route.id ? 'white' : 'black' }
                ]}>
                  {route.name}
                </Text>
              </View>
              <View style={styles.routeDetails}>
                <Text style={[
                  styles.routeText,
                  { color: selectedRoute?.id === route.id ? 'white' : 'black' }
                ]}>
                  {(route.distance / 1000).toFixed(1)} km
                </Text>
                <Text style={[
                  styles.routeText,
                  { color: selectedRoute?.id === route.id ? 'white' : 'black' }
                ]}>
                  {Math.round(route.duration / 60)} min
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {selectedRoute && (
            <View style={styles.emissionsContainer}>
              <Text style={styles.emissionsText}>
                Émissions de CO₂: {selectedRoute.carbonEmissions} kg
              </Text>
            </View>
          )}
        </>
      )}

      {error && (
        <Text style={styles.errorText}>Erreur: {error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    minWidth: 200,
    maxWidth: 250,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#4AA68F',
  },
  routeOption: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDetails: {
    alignItems: 'flex-end',
  },
  routeText: {
    marginLeft: 5,
    fontSize: 12,
  },
  emissionsContainer: {
    marginTop: 5,
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  emissionsText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Itinerary;