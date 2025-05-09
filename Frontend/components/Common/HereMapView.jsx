import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { getChargingStations } from '../../services/openCharge.service';
import { fetchParkingData } from '../../services/openParking.service';
import Itinerary from './Itinerary';
import Navigation from './Navigation';
import RouteInput from './RouteInput';
import { getValidatedObstructions } from '../../services/obstruction.service';


const HereMapView = ({navigation,selectedRoute,setSelectedRoute}) => {
  const webViewRef = useRef(null);
  const [chargingStations, setChargingStations] = useState([]);
  const [parkingData, setParkingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectionMode, setSelectionMode] = useState(null); 
  const [userLocation, setUserLocation] = useState(null);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [obstructions, setObstructions] = useState([]);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  

  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicGNkMjAyNSIsImEiOiJjbTlteWtjYmQwamdkMmtxdW15dGp3bXdsIn0.1ifFbARPyMRFgASXXuVymw';
  const DUBAI_COORDS = { latitude: 25.276987, longitude: 55.296249 };

  const handleCenterPress = () => {
    if (!webViewRef?.current) return;

    webViewRef.current.injectJavaScript(`
      map.flyTo({
        center: [${DUBAI_COORDS.longitude}, ${DUBAI_COORDS.latitude}],
        zoom: 14,
        essential: true
      });
      true;
    `);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stations, parkings] = await Promise.all([
          getChargingStations(DUBAI_COORDS.latitude, DUBAI_COORDS.longitude),
          fetchParkingData(DUBAI_COORDS.latitude, DUBAI_COORDS.longitude)
        ]);
        setChargingStations(stations);
        setParkingData(parkings);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const initializeMap = () => {
    if (!webViewRef.current) return;

    webViewRef.current.injectJavaScript(`
      // Add route source and layer
      if (!map.getSource('route')) {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });
        
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4AA68F',
            'line-width': 4
          }
        });
      }
      
      // Add marker sources
      if (!map.getSource('start-marker')) {
        map.addSource('start-marker', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        
        map.addLayer({
          id: 'start-marker',
          type: 'circle',
          source: 'start-marker',
          paint: {
            'circle-radius': 10,
            'circle-color': '#4285F4',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
      }
      
      if (!map.getSource('end-marker')) {
        map.addSource('end-marker', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        
        map.addLayer({
          id: 'end-marker',
          type: 'circle',
          source: 'end-marker',
          paint: {
            'circle-radius': 10,
            'circle-color': '#EA4335',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
      }

      // Setup click handler for map
      map.on('click', (e) => {
        const coordinates = e.lngLat.toArray();
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'map_click',
          coordinates: coordinates
        }));
      });

      true;
    `);
  };

  const updateMarkers = () => {
    if (!webViewRef.current || !startCoords || !endCoords) return;

    webViewRef.current.injectJavaScript(`
      try {
        // Update start marker
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
        
        // Add start icon
        if (window.startMarker) window.startMarker.remove();
        window.startMarker = new mapboxgl.Marker({
          element: (() => {
            const el = document.createElement('div');
            el.innerHTML = '<i class="fas fa-map-marker-alt fa-3x" style="color:#4285F4;"></i>';
            return el;
          })()
        }).setLngLat(${JSON.stringify(startCoords)}).addTo(map);

        // Update end marker
        map.getSource('end-marker').setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: ${JSON.stringify(endCoords)}
            }
          }]
        });
        
        // Add end icon
        if (window.endMarker) window.endMarker.remove();
        window.endMarker = new mapboxgl.Marker({
          element: (() => {
            const el = document.createElement('div');
            el.innerHTML = '<i class="fas fa-map-marker-alt fa-3x" style="color:#EA4335;"></i>';
            return el;
          })()
        }).setLngLat(${JSON.stringify(endCoords)}).addTo(map);

        // Fit bounds to markers
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(${JSON.stringify(startCoords)});
        bounds.extend(${JSON.stringify(endCoords)});
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 14
        });
      } catch(e) {
        console.error(e);
      }
      true;
    `);
  };

  const generateHtml = () => {
    const chargingMarkers = chargingStations.map(station => {
      const { AddressInfo, OperatorInfo, Connections, StatusType } = station;
      const connectionTypes = Connections ? Connections.map(c => c.ConnectionType?.Title).join(', ') : 'N/A';
      const operator = OperatorInfo?.Title || 'Unknown Operator';
      const status = StatusType?.Title || 'Unknown';
  
      return `
        new mapboxgl.Marker({
          element: (() => {
            const el = document.createElement('div');
            el.innerHTML = '<i class="fas fa-charging-station fa-3x" style="color:darkgreen;"></i>';
            return el;
          })()
        })
        .setLngLat([${AddressInfo.Longitude}, ${AddressInfo.Latitude}])
        .setPopup(new mapboxgl.Popup().setHTML(
          '<h3>${AddressInfo.Title}</h3>' +
          '<p>${AddressInfo.AddressLine1 || ''}, ${AddressInfo.Town || ''}</p>' +
          '<p><strong>Operator:</strong> ${operator}</p>' +
          '<p><strong>Connection Types:</strong> ${connectionTypes}</p>' +
          '<p><strong>Status:</strong> ${status}</p>'
        ))
        .addTo(map);
      `;
    }).join('');

    const obstructionMarkers = obstructions.map(obs => {
      const iconMap = {
        accident: 'fas fa-car-crash',
        embouteillage: 'fas fa-traffic-light',
        inondation: 'fas fa-water',
        manifestations: 'fas fa-users'
      };
      const icon = iconMap[obs.obstruction_type] || 'fas fa-exclamation-triangle';
      const colorMap = {
        accident: 'red',
        embouteillage: 'orange',
        inondation: 'blue',
        manifestations: 'purple'
      };
      const color = colorMap[obs.obstruction_type] || 'gray';
      return `
        new mapboxgl.Marker({
          element: (() => {
            const el = document.createElement('div');
            el.innerHTML = '<i class="${icon} fa-2x" style="color:${color};"></i>';
            return el;
          })()
        })
        .setLngLat([${obs.longitude}, ${obs.latitude}])
        .setPopup(new mapboxgl.Popup().setHTML(
          '<strong>Obstruction détectée :</strong><br/>${obs.obstruction_type}'
        ))
        .addTo(map);
      `;
    }).join('');
  

    const parkingMarkers = parkingData.map(p => {
      const lat = p.lat || p.center?.lat;
      const lon = p.lon || p.center?.lon;
      const name = p.tags?.name || 'Public Parking';
      const capacity = p.tags?.capacity || 'Not specified';
  
      return `
        new mapboxgl.Marker({
          element: (() => {
            const el = document.createElement('div');
            el.innerHTML = '<i class="fas fa-parking fa-2x" style="color:black;"></i>';
            return el;
          })()
        })
        .setLngLat([${lon}, ${lat}])
        .setPopup(new mapboxgl.Popup().setHTML(
          '<strong>${name}</strong><br/>Capacity: ${capacity}'
        ))
        .addTo(map);
      `;
    }).join('');
  
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Mapbox</title>
          <script src="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js"></script>
          <link href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
          <style>
            body { margin: 0; padding: 0; }
            #map { position: absolute; top: 0; bottom: 0; width: 100%; }
            .mapboxgl-marker i {
              pointer-events: none;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            mapboxgl.accessToken = '${MAPBOX_ACCESS_TOKEN}';
            const map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: [${DUBAI_COORDS.longitude}, ${DUBAI_COORDS.latitude}],
              zoom: 12
            });

            // Add navigation controls
            map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
            
            // Add geolocation control with enhanced tracking
            const geolocate = new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              trackUserLocation: true,
              showUserLocation: true,
              showAccuracyCircle: false,
              fitBoundsOptions: {
                maxZoom: 15
              }
            });
            map.addControl(geolocate, 'bottom-right');

            map.on('load', () => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'map_loaded'
              }));
            });

            // Listen for location updates
            map.on('location', (e) => {
              if (e.lngLat) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'location_update',
                  coordinates: e.lngLat.toArray()
                }));
              }
            });

            ${chargingMarkers}
            ${parkingMarkers}
            ${obstructionMarkers}
          
          </script>
        </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'map_loaded') {
        setIsMapReady(true);
        initializeMap();
        setIsLoading(false);
      } else if (data.type === 'location_update') {
        setUserLocation(data.coordinates);
      } else if (data.type === 'map_click') {
        // Handle map click based on selection mode from RouteInput
        if (selectionMode === 'start') {
          setStartCoords(data.coordinates);
          setSelectionMode(null); // Reset selection mode
        } else if (selectionMode === 'end') {
          setEndCoords(data.coordinates);
          setSelectionMode(null); // Reset selection mode
        }
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };
  
  const handleConfirmLocations = () => {
    if (startCoords && endCoords) {
      updateMarkers();
      setShowRouteOptions(true);
    }
  };

  const handleResetLocations = () => {
    setStartCoords(null);
    setEndCoords(null);
    setShowRouteOptions(false);
    
    
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        try {
          map.getSource('start-marker').setData({
            type: 'FeatureCollection',
            features: []
          });
          map.getSource('end-marker').setData({
            type: 'FeatureCollection',
            features: []
          });
          if (window.startMarker) window.startMarker.remove();
          if (window.endMarker) window.endMarker.remove();
        } catch(e) {
          console.error(e);
        }
        true;
      `);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <WebView
            ref={webViewRef}
            style={styles.map}
            originWhitelist={['*']}
            source={{ html: generateHtml() }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={handleWebViewMessage}
            onError={(error) => console.error('WebView error:', error)}
          />

          <TouchableOpacity style={styles.centerButton} onPress={handleCenterPress}>
            <MaterialIcons name="my-location" size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          {isMapReady && (
            <>
              {!showRouteOptions ? (
                <RouteInput 
                  startCoords={startCoords}
                  endCoords={endCoords}
                  onConfirm={handleConfirmLocations}
                  onReset={handleResetLocations}
                  setStartCoords={setStartCoords}
                  setEndCoords={setEndCoords}
                  selectionMode={selectionMode}
                  setSelectionMode={setSelectionMode}
                />
              ) : (
                <>
                  <Itinerary 
                    webViewRef={webViewRef} 
                    startCoords={startCoords}
                    endCoords={endCoords}
                    setShowRouteOptions={setShowRouteOptions}
                  />
                  <Navigation 
                    webViewRef={webViewRef} 
                    selectedRoute={selectedRoute}
                    userLocation={userLocation}
                    startCoords={startCoords}
                    endCoords={endCoords}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
});

export default HereMapView;