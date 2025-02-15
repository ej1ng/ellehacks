import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraType, CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import PhotoPreviewSection from '@/components/PhotoPreviewSection';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [detectedColor, setDetectedColor] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (!cameraRef.current) {
      console.error("❌ Camera reference is null");
      return;
    }

    try {
      const options = { quality: 1, base64: true, exif: false };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);

      if (!takenPhoto) {
        console.error("❌ Failed to take photo");
        return;
      }

      setPhoto(takenPhoto);
      analyzeColor(takenPhoto.uri);
    } catch (error) {
      console.error("❌ Error taking photo:", error);
    }
  };

  const analyzeColor = async (uri: string) => {
    try {
      const manipulatedPhoto = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1, height: 1 } }],
        { base64: true }
      );

      if (!manipulatedPhoto.base64) {
        console.error("❌ Error: Base64 data is undefined");
        return;
      }

      getColorFromBase64(manipulatedPhoto.base64);
    } catch (error) {
      console.error("❌ Error detecting color:", error);
    }
  };

  const getColorFromBase64 = (base64: string) => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const buffer = new Uint8Array(byteNumbers);

      // Ensure at least 4 values exist (RGBA)
      if (buffer.length < 4) {
        console.error("❌ Invalid pixel data extracted.");
        return;
      }

      const [r, g, b, a] = buffer;
      console.log(`🎨 Extracted RGBA: R=${r}, G=${g}, B=${b}, A=${a}`);

      // Handle black (alpha = 0 issue)
      if (a === 0) {
        console.warn("⚠️ Pixel might be transparent, interpreting as black.");
        setDetectedColor("rgb(0, 0, 0)");
        return;
      }

      const rgbColor = `rgb(${r}, ${g}, ${b})`;
      setDetectedColor(rgbColor);
      console.log("✅ Final Detected Color:", rgbColor);
    } catch (error) {
      console.error("❌ Error processing base64 image:", error);
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
    setDetectedColor(null);
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <PhotoPreviewSection 
          photo={photo} 
          handleRetakePhoto={handleRetakePhoto} 
          detectedColor={detectedColor ?? undefined}
        />
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <AntDesign name="retweet" size={44} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
              <AntDesign name="camera" size={44} color="black" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
      {detectedColor && (
        <View style={[styles.colorPreview, { backgroundColor: detectedColor }]}> 
          <Text style={styles.colorText}>{detectedColor}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  colorPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  colorText: { color: 'white', fontWeight: 'bold' },
});