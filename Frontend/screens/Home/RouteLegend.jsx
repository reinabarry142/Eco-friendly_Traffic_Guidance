/*port React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RouteLegend = () => {
    return (
        <View style={styles.container}>
            <View style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.label}>Écologique</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.label}>Standard</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: '#F44336' }]} />
                <Text style={styles.label}>Moins vert</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorBox: {
        width: 14,
        height: 14,
        borderRadius: 3,
        marginRight: 6,
    },
    label: {
        fontSize: 14,
        color: '#333',
    },
});

export default RouteLegend;
*/
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RouteLegend = () => {
    const [visible, setVisible] = useState(false);

    const toggleLegend = () => {
        setVisible(!visible);
    };

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={toggleLegend} style={styles.toggleContainer}>
                <View style={styles.greenSquare} />
                <Text style={styles.toggleText}>Légende</Text>
            </TouchableOpacity>

            {visible && (
                <View style={styles.legendBox}>
                    <View style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: '#4CAF50' }]} />
                        <Text style={styles.label}>Écologique</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: '#FFC107' }]} />
                        <Text style={styles.label}>Standard</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: '#F44336' }]} />
                        <Text style={styles.label}>Moins vert</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        alignItems: 'flex-end',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        elevation: 3,
    },
    greenSquare: {
        width: 12,
        height: 12,
        backgroundColor: 'white',
        borderRadius: 2,
        marginRight: 6,
    },
    toggleText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
    legendBox: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    colorBox: {
        width: 14,
        height: 14,
        borderRadius: 3,
        marginRight: 6,
    },
    label: {
        fontSize: 13,
        color: '#333',
    },
});

export default RouteLegend;