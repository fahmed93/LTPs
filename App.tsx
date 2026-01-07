/**
 * LTPs - Long Term Plans
 * A relationship app for managing shared recipes, grocery lists, travel plans, and home projects
 *
 * @format
 */

import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GroceryList } from './components/GroceryList';

// Theme colors
const COLORS = {
  light: {
    background: '#f5f5f5',
    text: '#000000',
    cardBackground: 'rgba(100, 150, 250, 0.1)',
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    cardBackground: 'rgba(100, 150, 250, 0.1)',
  },
};

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
  const [showGroceryList, setShowGroceryList] = useState(false);

  const backgroundStyle = {
    backgroundColor: theme.background,
    flex: 1,
  };

  const textStyle = {
    color: theme.text,
  };

  if (showGroceryList) {
    const groceryContainerStyle = {
      paddingTop: safeAreaInsets.top,
      paddingBottom: safeAreaInsets.bottom,
      flex: 1,
    };
    
    return (
      <View style={backgroundStyle}>
        <View style={groceryContainerStyle}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              onPress={() => setShowGroceryList(false)}
              style={styles.backButton}>
              <Text style={[styles.backButtonText, textStyle]}>← Back</Text>
            </TouchableOpacity>
          </View>
          <GroceryList isDarkMode={isDarkMode} />
        </View>
      </View>
    );
  }

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

            <TouchableOpacity
              onPress={() => setShowGroceryList(true)}
              style={[styles.featureCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={styles.featureIcon}>🛒</Text>
              <Text style={[styles.featureTitle, textStyle]}>
                Grocery List
              </Text>
              <Text style={[styles.featureDescription, textStyle]}>
                Collaborative shopping lists that sync in real-time
              </Text>
            </TouchableOpacity>

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
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
