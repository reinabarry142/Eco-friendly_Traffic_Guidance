import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const Button = ({ title, onPress,iconFamily, style, textStyle, icon, iconColor, loading }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text style={[styles.text, textStyle]}>{title}</Text>
            {icon && (
                  iconFamily === 'community' ? (
                    <MaterialCommunityIcons 
                      name={icon} 
                      size={24} 
                      color={iconColor || theme.colors.white} 
                      style={styles.icon} 
                    />
                  ) : (
                    <MaterialIcons 
                      name={icon} 
                      size={24} 
                      color={iconColor || theme.colors.white} 
                      style={styles.icon} 
                    />
                  )
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 8,
  },
});

export default Button;