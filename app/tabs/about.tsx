import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScanLine, Sparkles, Shield, Zap } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <ScanLine size={64} color="#2563eb" strokeWidth={1.5} />
        </View>
        <Text style={styles.appName}>GarmentDefect AI</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the App</Text>
          <Text style={styles.description}>
            GarmentDefect AI is an advanced mobile application that uses artificial intelligence to detect defects in garments and identify fabric compositions. Our AI-powered analysis helps ensure quality control in textile manufacturing and retail.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Sparkles size={24} color="#2563eb" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI-Powered Detection</Text>
                <Text style={styles.featureText}>
                  Advanced computer vision to identify holes, stains, stitching issues, and more
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Shield size={24} color="#2563eb" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Fabric Analysis</Text>
                <Text style={styles.featureText}>
                  Accurate identification of fabric composition including cotton, polyester, and blends
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Zap size={24} color="#2563eb" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Real-Time Results</Text>
                <Text style={styles.featureText}>
                  Get instant analysis results with visual defect highlighting and detailed reports
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Defects</Text>
          <View style={styles.defectTypes}>
            <View style={styles.defectTag}>
              <Text style={styles.defectTagText}>Holes & Tears</Text>
            </View>
            <View style={styles.defectTag}>
              <Text style={styles.defectTagText}>Stains</Text>
            </View>
            <View style={styles.defectTag}>
              <Text style={styles.defectTagText}>Uneven Stitching</Text>
            </View>
            <View style={styles.defectTag}>
              <Text style={styles.defectTagText}>Color Mismatch</Text>
            </View>
            <View style={styles.defectTag}>
              <Text style={styles.defectTagText}>Pattern Misalignment</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Take a photo or upload an image of the garment</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>AI analyzes the image for defects and fabric type</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Review detailed results with visual highlights</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Access your inspection history anytime</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.footerSection]}>
          <Text style={styles.footerText}>© 2025 GarmentDefect AI</Text>
          <Text style={styles.footerSubtext}>Built with ❤️ for quality assurance</Text>
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
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#9ca3af',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  featureList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  defectTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  defectTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  defectTagText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#2563eb',
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: '#d1d5db',
  },
});
