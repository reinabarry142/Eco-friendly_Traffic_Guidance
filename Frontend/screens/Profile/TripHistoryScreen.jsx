import React, { useContext } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/auth.context';
import theme from '../../styles/theme';

const TripHistoryScreen = () => {
  const { tripHistory } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historique des trajets</Text>
      {tripHistory.length > 0 ? (
        tripHistory.map((trip, index) => (
          <View key={index} style={styles.tripCard}>
            <Text style={styles.tripText}>Date: {trip.date}</Text>
            <Text style={styles.tripText}>Distance: {trip.distance} km</Text>
            <Text style={styles.tripText}>CO2 Sauvé: {trip.co2Saved} g</Text>
            <Text style={styles.tripText}>Transport: {trip.transport}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noTrips}>Aucun trajet à afficher.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
    marginBottom: 20,
  },
  tripCard: {
    backgroundColor: theme.colors.lightBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  tripText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 5,
  },
  noTrips: {
    fontSize: 16,
    color: theme.colors.gray,
    textAlign: 'center',
  },
});

export default TripHistoryScreen;
