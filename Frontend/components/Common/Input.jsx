import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';

const Input = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
  icon, 
  keyboardType = 'default',
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <MaterialIcons 
          name={icon} 
          size={24} 
          color={theme.colors.gray} 
          style={styles.icon} 
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor={theme.colors.gray}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.medium,
    marginVertical: theme.spacing.small,
    elevation: 2,
  },
  icon: {
    marginRight: theme.spacing.small,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
  },
});

export default Input;