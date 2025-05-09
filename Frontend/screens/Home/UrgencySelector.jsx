import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UrgencySelector = ({ isInAHurry, setIsInAHurry }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => setExpanded(!expanded);

    return (
        <View style={styles.wrapper}>
            {expanded ? (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.question}>Êtes-vous pressé ?</Text>
                        <TouchableOpacity onPress={toggleExpanded}>
                            <Ionicons name="chevron-up-outline" size={20} color="#2f4f4f" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.options}>
                        <TouchableOpacity
                            style={[styles.button, isInAHurry && styles.selected]}
                            onPress={() => setIsInAHurry(true)}
                        >
                            <Ionicons name="flash-outline" size={18} color={isInAHurry ? 'white' : '#2f4f4f'} />
                            <Text style={[styles.buttonText, isInAHurry && styles.selectedText]}>Oui</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, isInAHurry === false && styles.selected]}
                            onPress={() => setIsInAHurry(false)}
                        >
                            <Ionicons name="leaf-outline" size={18} color={isInAHurry === false ? 'white' : '#2f4f4f'} />
                            <Text style={[styles.buttonText, isInAHurry === false && styles.selectedText]}>Non</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity style={styles.iconOnly} onPress={toggleExpanded}>
                    <Ionicons name="flash-outline" size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 75,
        left: 20,
        zIndex: 10,
    },
    iconOnly: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    container: {
        backgroundColor: '#e6f4ea',
        borderRadius: 16,
        padding: 12,
        width: 220,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    question: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2f4f4f',
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    buttonText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#2f4f4f',
    },
    selected: {
        backgroundColor: 'green',
    },
    selectedText: {
        color: 'white',
    },
});

export default UrgencySelector;