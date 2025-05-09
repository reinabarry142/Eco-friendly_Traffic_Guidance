import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VehiclePicker = ({ selectedVehicle, setSelectedVehicle }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('VehicleSelector', {
            setSelectedVehicle: setSelectedVehicle,
        });
    };

    return (
        <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
            <Ionicons name="car-outline" size={20} color="#fff" />
            <Text style={styles.selectedText} numberOfLines={1}>
                {selectedVehicle || 'Choisir un véhicule'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#4CAF50', // Vert forêt
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 50,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        zIndex: 10,
    },
    selectedText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        maxWidth: 140,
    },
});

export default VehiclePicker;
