import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Navigation = ({ webViewRef, selectedRoute, userLocation, startCoords, endCoords }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [distanceRemaining, setDistanceRemaining] = useState('');

  const startNavigation = async () => {
    if (!webViewRef?.current || !startCoords) return;

    setIsNavigating(true);
    setProgress(0);

    const script = `
      try {
        // Zoom to start point and enable tracking
        map.flyTo({
          center: ${JSON.stringify(startCoords)},
          zoom: 16,
          essential: true
        });

        // Activate geolocation tracking
        const geolocate = map._controls.find(c => c instanceof mapboxgl.GeolocateControl);
        if (geolocate) {
          geolocate._watchState = 'ACTIVE_LOCK';
          geolocate._updateCamera();
        }

        // Update start marker in real-time
        map.on('location', (e) => {
          if (e.lngLat) {
            // Update start marker position
            map.getSource('start-marker').setData({
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: e.lngLat.toArray()
                }
              }]
            });

            // Center map on current position
            map.flyTo({
              center: e.lngLat.toArray(),
              zoom: 70,
              essential: true
            });

            // Send position to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'location_update',
              coordinates: e.lngLat.toArray()
            }));
          }
        });
      } catch(e) {
        console.error(e);
      }
      true;
    `;

    await webViewRef.current.injectJavaScript(script);
  };

  const stopNavigation = async () => {
    setIsNavigating(false);
    const script = `
      try {
        map.off('location');
        const geolocate = map._controls.find(c => c instanceof mapboxgl.GeolocateControl);
        if (geolocate) {
          geolocate._watchState = 'OFF';
        }

        // Reset start marker to original position
        map.getSource('start-marker').setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: ${JSON.stringify(startCoords)}
            }
          }]
        });
      } catch(e) {
        console.error(e);
      }
      true;
    `;
    await webViewRef.current.injectJavaScript(script);
  };

  useEffect(() => {
    if (!isNavigating || !userLocation || !selectedRoute || !startCoords || !endCoords) return;

    // Calculate progress
    const start = startCoords;
    const end = endCoords;
    const current = userLocation;

    // Haversine distance calculation
    const toRad = (x) => x * Math.PI / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(end[1]-start[1]);
    const dLon = toRad(end[0]-start[0]);
    const lat1 = toRad(start[1]);
    const lat2 = toRad(end[1]);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const totalDist = R * c;

    const currentDLat = toRad(current[1]-start[1]);
    const currentDLon = toRad(current[0]-start[0]);
    const currentA = Math.sin(currentDLat/2) * Math.sin(currentDLat/2) +
                       Math.sin(currentDLon/2) * Math.sin(currentDLon/2) * Math.cos(lat1) * Math.cos(toRad(current[1]));
    const currentC = 2 * Math.atan2(Math.sqrt(currentA), Math.sqrt(1-currentA));
    const currentDist = R * currentC;

    const newProgress = Math.min(100, (currentDist / totalDist) * 100);
    setProgress(newProgress);
    setDistanceRemaining(`${(totalDist - currentDist).toFixed(1)} km`);

    // Calculate remaining time based on route type
    let speed;
    switch(selectedRoute.type) {
      case 'driving': speed = 50; break; // km/h
      case 'cycling': speed = 15; break;
      case 'walking': speed = 5; break;
      default: speed = 10;
    }

    const remainingTime = ((totalDist - currentDist) / speed) * 60; // in minutes
    setTimeRemaining(remainingTime > 1 ? `${Math.round(remainingTime)} min` : '< 1 min');

    if (newProgress >= 99) {
      stopNavigation();
    }
  }, [userLocation, isNavigating, selectedRoute, startCoords, endCoords]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation</Text>

      {selectedRoute && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>
            {selectedRoute.type === 'driving' ? 'Voiture' :
              selectedRoute.type === 'cycling' ? 'Vélo' : 'Marche'}
          </Text>
          <Text style={styles.distanceText}>
            Distance: {(selectedRoute.distance / 1000).toFixed(1)} km
          </Text>
          <Text style={styles.emissionsText}>
            Émissions: {selectedRoute.carbonEmissions} kg CO₂
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isNavigating && styles.activeButton]}
        onPress={isNavigating ? stopNavigation : startNavigation}
      >
        <MaterialIcons
          name={isNavigating ? 'stop' : 'directions'}
          size={20}
          color="white"
        />
        <Text style={styles.buttonText}>
          {isNavigating ? 'Arrêter' : 'Démarrer'}
        </Text>
      </TouchableOpacity>

      {isNavigating && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>{Math.round(progress)}% complété</Text>
            <View style={styles.distanceTimeContainer}>
              <Text style={styles.distanceText}>{distanceRemaining}</Text>
              <Text style={styles.timeText}>{timeRemaining}</Text>
            </View>
          </View>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>Erreur: {error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
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
  routeInfo: {
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  routeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  distanceText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
  },
  emissionsText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#4AA68F',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4AA68F',
  },
  progressInfo: {
    marginTop: 2,
  },
  distanceTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default Navigation;