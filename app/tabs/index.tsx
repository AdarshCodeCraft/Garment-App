import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, ScanLine, X } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import { useInspections } from '../../contexts/InspectionContext';
import { InspectionResult, DefectArea, FabricComposition } from '../../types/inspection';

const defectSchema = z.object({
  defects: z.array(z.object({
    type: z.enum(['hole', 'stain', 'uneven_stitching', 'color_mismatch', 'misaligned_pattern']),
    confidence: z.number().min(0).max(100),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    description: z.string(),
  })),
  fabricType: z.object({
    cotton: z.number().min(0).max(100),
    polyester: z.number().min(0).max(100),
    other: z.number().min(0).max(100),
  }),
  overallQuality: z.enum(['excellent', 'good', 'fair', 'poor']),
  notes: z.string().optional(),
});

export default function InspectScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const { addInspection } = useInspections();
  const router = useRouter();

  const analyzeMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const base64Image = await fetch(imageUri).then(async (res) => {
        const blob = await res.blob();
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]);
          };
          reader.readAsDataURL(blob);
        });
      });

      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image: base64Image,
              },
              {
                type: 'text',
                text: `Analyze this garment image for defects and fabric composition. 
                
Identify any defects (holes, stains, uneven stitching, color mismatches, misaligned patterns) and provide:
- Defect type
- Confidence level (0-100)
- Approximate position (x, y as percentage of image: 0-100)
- Approximate size (width, height as percentage of image: 0-100)
- Brief description

Also identify the fabric composition:
- Cotton percentage (0-100)
- Polyester percentage (0-100)
- Other materials percentage (0-100)
(Percentages should sum to 100)

Rate the overall quality as: excellent, good, fair, or poor.

If no visible garment is present, mark quality as 'poor' and add a note explaining this.`,
              },
            ],
          },
        ],
        schema: defectSchema,
      });

      const inspection: InspectionResult = {
        id: Date.now().toString(),
        imageUri,
        timestamp: Date.now(),
        defects: result.defects as DefectArea[],
        fabricType: result.fabricType as FabricComposition,
        overallQuality: result.overallQuality,
        notes: result.notes,
      };

      addInspection(inspection);
      return inspection;
    },
  });

  const handleTakePhoto = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }
    }
    setShowCamera(true);
  };

  const capturePhoto = async () => {
    if (!cameraRef) return;

    try {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
      });

      if (photo?.uri) {
        setShowCamera(false);
        await analyzeMutation.mutateAsync(photo.uri);
        router.push('/result');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await analyzeMutation.mutateAsync(result.assets[0].uri);
        router.push('/result');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const insets = useSafeAreaInsets();

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={setCameraRef}
        >
          <View style={[styles.cameraOverlay, { paddingTop: insets.top + 20 }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <X size={32} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.scanLineContainer}>
            <ScanLine size={200} color="#2563eb" strokeWidth={2} />
            <Text style={styles.scanText}>Position garment in frame</Text>
          </View>

          <View style={[styles.captureContainer, { paddingBottom: insets.bottom + 40 }]}>
            <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GarmentDefect AI</Text>
        <Text style={styles.subtitle}>
          Detect defects and identify fabric types with AI
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <ScanLine size={80} color="#2563eb" strokeWidth={1.5} />
          </View>
        </View>

        <Text style={styles.infoText}>
          Take a photo or upload an image of a garment to analyze for:
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Holes and tears</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Stains and discoloration</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Uneven stitching</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Color mismatches</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Misaligned patterns</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Fabric composition</Text>
          </View>
        </View>

        {analyzeMutation.isPending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Analyzing garment...</Text>
          </View>
        )}

        {!analyzeMutation.isPending && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleTakePhoto}
              disabled={analyzeMutation.isPending}
            >
              <Camera size={24} color="#fff" />
              <Text style={styles.primaryButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleUploadImage}
              disabled={analyzeMutation.isPending}
            >
              <Upload size={24} color="#2563eb" />
              <Text style={styles.secondaryButtonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  featureList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 17,
    fontWeight: '600' as const,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLineContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    marginTop: 24,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  captureContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#2563eb',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
  },
});
