import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useInspections } from '../contexts/InspectionContext';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const defectTypeLabels: Record<string, string> = {
  hole: 'Hole',
  stain: 'Stain',
  uneven_stitching: 'Uneven Stitching',
  color_mismatch: 'Color Mismatch',
  misaligned_pattern: 'Misaligned Pattern',
};

const defectColors: Record<string, string> = {
  hole: '#ef4444',
  stain: '#f59e0b',
  uneven_stitching: '#8b5cf6',
  color_mismatch: '#ec4899',
  misaligned_pattern: '#06b6d4',
};

const qualityConfig = {
  excellent: { color: '#10b981', icon: CheckCircle, label: 'Excellent' },
  good: { color: '#3b82f6', icon: CheckCircle, label: 'Good' },
  fair: { color: '#f59e0b', icon: AlertTriangle, label: 'Fair' },
  poor: { color: '#ef4444', icon: AlertCircle, label: 'Poor' },
};

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { inspections } = useInspections();
  const router = useRouter();
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });

  const inspection = id 
    ? inspections.find(i => i.id === id)
    : inspections[0];

  if (!inspection) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#ef4444" />
        <Text style={styles.errorText}>Inspection not found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const quality = qualityConfig[inspection.overallQuality];
  const QualityIcon = quality.icon;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: inspection.imageUri }}
          style={styles.image}
          contentFit="contain"
          onLoad={(event) => {
            const { width, height } = event.source;
            const aspectRatio = width / height;
            const containerWidth = SCREEN_WIDTH;
            const displayHeight = containerWidth / aspectRatio;
            setImageLayout({ width: containerWidth, height: displayHeight });
          }}
        />
        {imageLayout.width > 0 && inspection.defects.map((defect, index) => {
          const left = (defect.x / 100) * imageLayout.width;
          const top = (defect.y / 100) * imageLayout.height;
          const width = (defect.width / 100) * imageLayout.width;
          const height = (defect.height / 100) * imageLayout.height;
          const color = defectColors[defect.type] || '#ef4444';

          return (
            <View
              key={index}
              style={[
                styles.defectBox,
                {
                  left,
                  top,
                  width,
                  height,
                  borderColor: color,
                },
              ]}
            >
              <View style={[styles.defectLabel, { backgroundColor: color }]}>
                <Text style={styles.defectLabelText}>
                  {defectTypeLabels[defect.type]}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.content}>
        <View style={[styles.qualityCard, { borderLeftColor: quality.color }]}>
          <View style={styles.qualityHeader}>
            <QualityIcon size={32} color={quality.color} />
            <View style={styles.qualityTextContainer}>
              <Text style={styles.qualityLabel}>Overall Quality</Text>
              <Text style={[styles.qualityValue, { color: quality.color }]}>
                {quality.label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fabric Composition</Text>
          <View style={styles.fabricCard}>
            <View style={styles.fabricRow}>
              <View style={styles.fabricItem}>
                <View style={[styles.fabricDot, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.fabricLabel}>Cotton</Text>
              </View>
              <Text style={styles.fabricValue}>{inspection.fabricType.cotton}%</Text>
            </View>
            <View style={styles.fabricRow}>
              <View style={styles.fabricItem}>
                <View style={[styles.fabricDot, { backgroundColor: '#8b5cf6' }]} />
                <Text style={styles.fabricLabel}>Polyester</Text>
              </View>
              <Text style={styles.fabricValue}>{inspection.fabricType.polyester}%</Text>
            </View>
            <View style={styles.fabricRow}>
              <View style={styles.fabricItem}>
                <View style={[styles.fabricDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.fabricLabel}>Other</Text>
              </View>
              <Text style={styles.fabricValue}>{inspection.fabricType.other}%</Text>
            </View>
            <View style={styles.fabricBar}>
              <View
                style={[
                  styles.fabricBarSegment,
                  {
                    width: `${inspection.fabricType.cotton}%`,
                    backgroundColor: '#3b82f6',
                  },
                ]}
              />
              <View
                style={[
                  styles.fabricBarSegment,
                  {
                    width: `${inspection.fabricType.polyester}%`,
                    backgroundColor: '#8b5cf6',
                  },
                ]}
              />
              <View
                style={[
                  styles.fabricBarSegment,
                  {
                    width: `${inspection.fabricType.other}%`,
                    backgroundColor: '#f59e0b',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Detected Defects ({inspection.defects.length})
          </Text>
          {inspection.defects.length === 0 ? (
            <View style={styles.noDefectsCard}>
              <CheckCircle size={32} color="#10b981" />
              <Text style={styles.noDefectsText}>No defects detected</Text>
            </View>
          ) : (
            inspection.defects.map((defect, index) => (
              <View key={index} style={styles.defectCard}>
                <View
                  style={[
                    styles.defectColorBar,
                    { backgroundColor: defectColors[defect.type] || '#ef4444' },
                  ]}
                />
                <View style={styles.defectCardContent}>
                  <View style={styles.defectCardHeader}>
                    <Text style={styles.defectType}>
                      {defectTypeLabels[defect.type]}
                    </Text>
                    <Text style={styles.defectConfidence}>
                      {Math.round(defect.confidence)}%
                    </Text>
                  </View>
                  <Text style={styles.defectDescription}>{defect.description}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {inspection.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{inspection.notes}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.timestamp}>
            Inspected on {new Date(inspection.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
    position: 'relative' as const,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  defectBox: {
    position: 'absolute' as const,
    borderWidth: 3,
    borderStyle: 'solid' as const,
  },
  defectLabel: {
    position: 'absolute' as const,
    top: -24,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defectLabelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  content: {
    padding: 20,
  },
  qualityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 6,
  },
  qualityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qualityTextContainer: {
    flex: 1,
  },
  qualityLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  qualityValue: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 12,
  },
  fabricCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  fabricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fabricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fabricDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  fabricLabel: {
    fontSize: 16,
    color: '#374151',
  },
  fabricValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#111827',
  },
  fabricBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 12,
  },
  fabricBarSegment: {
    height: '100%',
  },
  defectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  defectColorBar: {
    width: 6,
  },
  defectCardContent: {
    flex: 1,
    padding: 16,
  },
  defectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  defectType: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#111827',
  },
  defectConfidence: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  defectDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  noDefectsCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  noDefectsText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#10b981',
  },
  notesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});