import React, { useContext } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity 
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from "../../contexts/auth.context";
import theme from "../../styles/theme";
import Button from "../../components/Common/Button";
import AuthPromptScreen from "../Auth/AuthPromptScreen";

const ProfileScreen = ({ navigation }) => {
  const { user, profile, history, loading, logout } = useContext(AuthContext);

  // Structure des données utilisateur par défaut
  const defaultUser = {
    name: user?.name || 'Invité',
    email: user?.email || '',
    ecoPoints: profile?.ecoPoints || 0,
    level: profile?.level || 'Débutant',
    avatar: profile?.avatar || require('../../assets/images/avatar-placeholder.jpg'),
    trips: history?.trips?.length > 0 ? 
      history.trips.map((trip, idx) => ({
        id: idx + 1,
        date: trip.date || `Trajet ${idx + 1}`,
        distance: trip.distance ? `${trip.distance} km` : 'N/A',
        co2Saved: trip.co2Saved || '0 kg',
        transport: trip.transport || 'inconnu'
      })) : [],
    chargingStations: profile?.chargingStations || 0,
    parkingSearches: profile?.parkingSearches || 0,
    contributions: profile?.contributions || 0,
    badges: profile?.badges?.map((badge, idx) => ({
      id: idx + 1,
      name: badge,
      icon: getBadgeIcon(badge),
      achieved: true
    })) || []
  };

  function getBadgeIcon(badgeName) {
    const icons = {
      'Débutant': 'eco',
      '1000 pts': 'star',
      'Chargement': 'ev-station',
      'Vélo Master': 'pedal-bike',
      'Éco-Legend': 'military-tech'
    };
    
    // Essayer de faire correspondre le nom du badge avec les icônes connues
    for (const [key, value] of Object.entries(icons)) {
      if (badgeName.includes(key)) {
        return value;
      }
    }
    
    // Icône par défaut si aucune correspondance trouvée
    return 'star';
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthPromptScreen navigation={navigation} />;
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Section Profil */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profil</Text>
        </View>

        <View style={styles.profileInfo}>
          {defaultUser.avatar && (
            <Image 
              source={typeof defaultUser.avatar === 'string' ? 
                { uri: defaultUser.avatar } : defaultUser.avatar} 
              style={styles.avatar} 
            />
          )}
          <View style={styles.profileText}>
            <Text style={styles.userName}>{defaultUser.name}</Text>
            <Text style={styles.userLevel}>{defaultUser.level}</Text>
            <Text style={styles.userEmail}>{defaultUser.email}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{defaultUser.ecoPoints}</Text>
            <Text style={styles.statLabel}>Points Éco</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{defaultUser.contributions}</Text>
            <Text style={styles.statLabel}>Contributions</Text>
          </View>
        </View>
      </View>

      {/* Bouton Modifier Profil */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
        <Text style={styles.editButtonText}>Modifier votre profil</Text>
      </TouchableOpacity>

      {/* Statistiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vos statistiques écologiques</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="ev-station" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>{defaultUser.chargingStations}</Text>
            <Text style={styles.statLabel}>Bornes trouvées</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="local-parking" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>{defaultUser.parkingSearches}</Text>
            <Text style={styles.statLabel}>Parkings trouvés</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="thumb-up" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>{defaultUser.contributions}</Text>
            <Text style={styles.statLabel}>Contributions</Text>
          </View>
        </View>
      </View>

      {/* Historique des trajets */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vos derniers trajets</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TripHistory')}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {defaultUser.trips.length > 0 ? (
          defaultUser.trips.map(trip => (
            <TouchableOpacity 
              key={trip.id} 
              style={styles.tripItem}
              onPress={() => navigation.navigate('TripDetails', { trip })}
            >
              <View style={styles.tripIcon}>
                <MaterialIcons 
                  name={trip.transport === 'vélo' ? 'directions-bike' : 'directions-bus'} 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </View>
              <View style={styles.tripDetails}>
                <Text style={styles.tripDate}>{trip.date}</Text>
                <Text style={styles.tripDistance}>{trip.distance} • {trip.co2Saved} CO₂ économisé</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noTrips}>Aucun trajet enregistré.</Text>
        )}
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vos récompenses</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesScrollContainer}
        >
          {defaultUser.badges.map(badge => (
            <View 
              key={badge.id} 
              style={styles.badge}
            >
              <MaterialIcons 
                name={badge.icon} 
                size={30} 
                color={theme.colors.primary} 
              />
              <Text style={styles.badgeText}>
                {badge.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bouton Déconnexion */}
      <Button
        title="Déconnexion"
        onPress={logout}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
        icon="logout"
        iconColor="white"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  userLevel: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.gray,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  editButtonText: {
    color: theme.colors.primary,
    marginLeft: 8,
    fontFamily: theme.fonts.medium,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.gray,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
  },
  seeAll: {
    color: theme.colors.primary,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  tripIcon: {
    backgroundColor: theme.colors.lightPrimary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripDetails: {
    flex: 1,
  },
  tripDate: {
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  tripDistance: {
    fontSize: 12,
    color: theme.colors.gray,
    marginTop: 4,
    fontFamily: theme.fonts.regular,
  },
  noTrips: {
    textAlign: 'center',
    color: theme.colors.gray,
    fontFamily: theme.fonts.regular,
    marginVertical: 10,
  },
  badgesScrollContainer: {
    paddingHorizontal: 5,
  },
  badge: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    width: 90,
    position: 'relative',
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: 5,
    fontFamily: theme.fonts.medium,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    marginVertical: 20,
  },
  logoutButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.medium,
  },
});

export default ProfileScreen;