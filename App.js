import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    text: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default function App() {
    const [isShaking, setIsShaking] = useState(false);
    const [mySound, setMySound] = useState(null);

    useEffect(() => {
        async function setupAudio() {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });

            const { sound } = await Audio.Sound.createAsync(
                require('./piano.wav')
            );
            setMySound(sound);
        }

        setupAudio();

        return () => {
            if (mySound) {
                mySound.unloadAsync();
            }
        };
    }, []);

    const playSound = async () => {
        if (mySound) {
            try {
                await mySound.replayAsync();
                console.log('✅ Sound played successfully');
            } catch (error) {
                console.error('❌ Error playing sound:', error);
            }
        } else {
            console.warn('⚠️ Sound is not loaded yet.');
        }
    };

    useEffect(() => {
        Accelerometer.setUpdateInterval(100); // Update every 100ms
        const subscription = Accelerometer.addListener(({ x, y, z }) => {
            const acceleration = Math.sqrt(x * x + y * y + z * z);
            if (acceleration > 1.5) { // Adjust threshold for sensitivity
                if (!isShaking) { // Play sound only if not already shaking
                    setIsShaking(true);
                    playSound();
                }
            } else {
                setIsShaking(false);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [mySound]); // Ensure sound object is ready

    return (
        <View style={styles.container}>
            <StatusBar />
            {isShaking && <Text style={styles.text}>SHAKE</Text>}
        </View>
    );
}
