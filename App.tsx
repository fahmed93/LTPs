/**
 * LTPs - Long Term Plans
 * A relationship app for managing shared recipes, grocery lists, travel plans, and home projects
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {COLORS} from './src/theme/colors';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent isDarkMode={isDarkMode} />
    </SafeAreaProvider>
  );
}

function AppContent({ isDarkMode }: { isDarkMode: boolean }) {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const backgroundStyle = {
    backgroundColor: theme.background,
    flex: 1,
  };

  const textStyle = {
    color: theme.text,
  };

  return (
    <View style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={{
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        }}>
        <View style={styles.container}>
          <Text style={[styles.title, textStyle]}>🌱 LTPs</Text>
          <Text style={[styles.subtitle, textStyle]}>Long Term Plans</Text>
          <Text style={[styles.description, textStyle]}>
            A relationship app for managing your shared life together
          </Text>

          <View style={styles.featuresContainer}>
            <Text style={[styles.sectionTitle, textStyle]}>Features</Text>

            <View style={[styles.featureCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={styles.featureIcon}>📖</Text>
              <Text style={[styles.featureTitle, textStyle]}>
                Shared Recipe Lists
              </Text>
              <Text style={[styles.featureDescription, textStyle]}>
                Collect and organize your favorite recipes together
              </Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={styles.featureIcon}>🛒</Text>
              <Text style={[styles.featureTitle, textStyle]}>
                Grocery List
              </Text>
              <Text style={[styles.featureDescription, textStyle]}>
                Collaborative shopping lists that sync in real-time
              </Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={styles.featureIcon}>✈️</Text>
              <Text style={[styles.featureTitle, textStyle]}>
                Travel Plans & Memories
              </Text>
              <Text style={[styles.featureDescription, textStyle]}>
                Plan trips and preserve travel memories
              </Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={styles.featureIcon}>🏠</Text>
              <Text style={[styles.featureTitle, textStyle]}>
                Home Projects
              </Text>
              <Text style={[styles.featureDescription, textStyle]}>
                Track and manage home improvement projects
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  featuresContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
  featureCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default App;
