import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';

const ProfileCard = ({ user }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image 
          source={require('../../assets/images/avatar-placeholder.jpg')} 
          style={styles.avatar}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        
        <View style={styles.badge}>
          <MaterialIcons name="eco" size={16} color={theme.colors.white} />
          <Text style={styles.badgeText}>Éco-utilisateur</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.large,
    ...theme.shadow,
  },
  avatarContainer: {
    marginRight: theme.spacing.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: theme.colors.gray,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  badgeText: {
    color: theme.colors.white,
    marginLeft: 6,
    fontSize: 12,
    fontFamily: theme.fonts.medium,
  },
});

export default ProfileCard;