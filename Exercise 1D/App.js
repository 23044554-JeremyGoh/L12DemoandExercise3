import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Barometer } from 'expo-sensors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
    }
});

export default function App() {
    const [{ pressure, relativeAltitude }, setData] = useState({ pressure: 0, relativeAltitude: 0 });

    useEffect(() => {
        if (Barometer.isAvailableAsync()) {
            Barometer.setUpdateInterval(1000); // Update every second
            const subscription = Barometer.addListener(setData);
            return () => subscription.remove();
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text style={styles.text}>Barometer Readings:</Text>
            <Text style={styles.text}>Pressure: {pressure.toFixed(2)} hPa</Text>
            <Text style={styles.text}>Relative Altitude: {relativeAltitude ? relativeAltitude.toFixed(2) : 'N/A'} meters</Text>
        </View>
    );
}
