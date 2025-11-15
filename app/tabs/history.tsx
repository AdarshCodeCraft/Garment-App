import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useInspections } from '../../contexts/InspectionContext';
import { Trash2, FileText, Calendar, AlertCircle } from 'lucide-react-native';

const qualityColors = {
  excellent: '#10b981',
  good: '#3b82f6',
  fair: '#f59e0b',
  poor: '#ef4444',
};

export default function HistoryScreen() {
  const { inspections, deleteInspection, clearAll } = useInspections();
  const router = useRouter();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Inspection',
      'Are you sure you want to delete this inspection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteInspection(id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all inspections? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearAll,
        },
      ]
    );
  };

  if (inspections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FileText size={64} color="#d1d5db" />
        <Text style={styles.emptyTitle}>No Inspections Yet</Text>
        <Text style={styles.emptyText}>
          Your inspection history will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspection History</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={inspections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const qualityColor = qualityColors[item.overallQuality];
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/result?id=${item.id}`)}
            >
              <Image
                source={{ uri: item.imageUri }}
                style={styles.thumbnail}
                contentFit="cover"
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.qualityBadge, { backgroundColor: qualityColor }]}>
                    <Text style={styles.qualityBadgeText}>
                      {item.overallQuality.toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <AlertCircle size={16} color="#6b7280" />
                    <Text style={styles.statText}>
                      {item.defects.length} {item.defects.length === 1 ? 'defect' : 'defects'}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Calendar size={16} color="#6b7280" />
                    <Text style={styles.statText}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.fabricRow}>
                  <Text style={styles.fabricLabel}>Fabric:</Text>
                  <Text style={styles.fabricText}>
                    {item.fabricType.cotton > 50 ? 'Cotton' :
                     item.fabricType.polyester > 50 ? 'Polyester' :
                     'Mixed'}
                    {' '}({Math.max(
                      item.fabricType.cotton,
                      item.fabricType.polyester,
                      item.fabricType.other
                    )}%)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#111827',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#ef4444',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 120,
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qualityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qualityBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#6b7280',
  },
  fabricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fabricLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  fabricText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#111827',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
