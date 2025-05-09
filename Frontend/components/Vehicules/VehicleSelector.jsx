import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import vehicleBrands from './VehicleData';
import { useNavigation } from '@react-navigation/native';

const VehicleSelector = ({ route }) => {
    const navigation = useNavigation();
    const { setSelectedVehicle } = route.params;

    const [search, setSearch] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);

    useEffect(() => {
        setFilteredVehicles(vehicleBrands.slice(0, 2500));
    }, []);

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = vehicleBrands.filter((v) =>
            v.toLowerCase().startsWith(text.toLowerCase())
        );
        setFilteredVehicles(filtered.slice(0, 2500));
    };

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
           {/* <Text style={styles.title}>Sélectionnez votre véhicule</Text>*/}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#6c757d" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Rechercher un véhicule..."
                    placeholderTextColor="#6c757d"
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>
            <FlatList
                data={filteredVehicles}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => handleVehicleSelect(item)}>
                        <Text style={styles.itemText}>{item}</Text>
                    </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#f4f9f4',
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 16,
        color: '#2f4f4f',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#e0f2e9',
        borderRadius: 12,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#cde7d8',
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: Platform.OS === 'ios' ? 10 : 6,
        fontSize: 16,
        color: '#2f4f4f',
    },
    item: {
        padding: 14,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default VehicleSelector;