import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';

export default function AideScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="help-outline" size={50} color={theme.colors.primary} />
      <Text style={styles.title}>Centre d'aide</Text>
      <Text style={styles.subtitle}>Trouvez des réponses à vos questions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginVertical: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray,
    textAlign: 'center',
  },
});