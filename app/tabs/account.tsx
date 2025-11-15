import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useInspections } from '../../contexts/InspectionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, BarChart3, Clock, Award, ChevronRight, Moon, LogOut } from 'lucide-react-native';

export default function AccountScreen() {
  const router = useRouter();
  const { inspections } = useInspections();
  const { user, isAuthenticated, signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const totalInspections = inspections.length;
  const defectsFound = inspections.reduce((sum, i) => sum + i.defects.length, 0);
  const excellentCount = inspections.filter(i => i.overallQuality === 'excellent').length;
  
  const avgDefects = totalInspections > 0 ? (defectsFound / totalInspections).toFixed(1) : '0';
  const qualityRate = totalInspections > 0 ? Math.round((excellentCount / totalInspections) * 100) : 0;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/signin');
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notAuthContainer}>
          <User size={64} color={colors.textSecondary} />
          <Text style={[styles.notAuthTitle, { color: colors.text }]}>Not Signed In</Text>
          <Text style={[styles.notAuthText, { color: colors.textSecondary }]}>
            Sign in to access your account and statistics
          </Text>
          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/signin')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authButtonSecondary, { borderColor: colors.primary }]}
            onPress={() => router.push('/signup')}
          >
            <Text style={[styles.authButtonSecondaryText, { color: colors.primary }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <User size={48} color={colors.primary} />
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Quality Inspector'}</Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || 'inspector@garmentai.com'}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.primaryLight }]}>
                <BarChart3 size={24} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{totalInspections}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Inspections</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#fef3c7' }]}>
                <Clock size={24} color="#f59e0b" />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{avgDefects}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Defects</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#d1fae5' }]}>
                <Award size={24} color="#10b981" />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{qualityRate}%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Quality Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          <View style={[styles.menuList, { backgroundColor: colors.surface }]}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Moon size={20} color={colors.iconColor} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Notifications</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Camera Settings</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Analysis Sensitivity</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Export Data</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          <View style={[styles.menuList, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Help Center</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Contact Us</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Privacy Policy</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>Terms of Service</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.error }]}
            onPress={handleSignOut}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.logoutButtonText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  notAuthTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 16,
  },
  notAuthText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  authButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  authButtonSecondary: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  authButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  menuList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    marginLeft: 16,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
