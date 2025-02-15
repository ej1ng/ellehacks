import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Text } from 'react-native';

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
    detectedColor, 
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
    detectedColor?: string; 
}) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image
                style={styles.previewContainer}
                source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
            />
        </View>

        {}
        {detectedColor && (
            <View style={[styles.colorBox, { backgroundColor: detectedColor }]}>
                <Text style={styles.colorText}>Detected Color: {detectedColor}</Text>
            </View>
        )}

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                <Fontisto name='trash' size={36} color='black' />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '95%',
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: "center",
    },
    previewContainer: {
        width: '95%',
        height: '85%',
        borderRadius: 15,
    },
    colorBox: {
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    colorText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: "center",
        width: '100%',
    },
    button: {
        backgroundColor: 'gray',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PhotoPreviewSection;
