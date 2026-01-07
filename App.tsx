/**
 * LTPs - Long Term Plans
 * A relationship app for managing shared recipes, grocery lists, travel plans, and home projects
 *
 * @format
 */

import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {COLORS} from './src/theme/colors';
import {GroceryListScreen} from './src/features/grocery-list/components/GroceryListScreen';
import {NavigationSidebar} from './src/features/navigation/components/NavigationSidebar';
import {useSidebarAnimation} from './src/features/navigation/hooks/useSidebarAnimation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<string>('Home');
  const {
    isOpen,
    position,
    openSidebar,
    closeSidebar,
  } = useSidebarAnimation();

  const handleNavigate = (route: string) => {
    setCurrentScreen(route);
    closeSidebar();
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {currentScreen === 'Home' ? (
        <AppContent
          isDarkMode={isDarkMode}
          onNavigateToGroceryList={() => handleNavigate('GroceryList')}
          onOpenSidebar={openSidebar}
        />
      ) : currentScreen === 'GroceryList' ? (
        <GroceryListScreen onOpenSidebar={openSidebar} />
      ) : (
        <PlaceholderScreen
          screen={currentScreen}
          isDarkMode={isDarkMode}
          onOpenSidebar={openSidebar}
        />
      )}
      <NavigationSidebar
        isOpen={isOpen}
        position={position}
        currentRoute={currentScreen}
        isDarkMode={isDarkMode}
        onNavigate={handleNavigate}
        onClose={closeSidebar}
      />
    </SafeAreaProvider>
  );
}

function AppContent({
  isDarkMode,
  onNavigateToGroceryList,
  onOpenSidebar,
}: {
  isDarkMode: boolean;
  onNavigateToGroceryList: () => void;
  onOpenSidebar: () => void;
}) {
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onOpenSidebar}
          style={styles.hamburgerButton}
          accessibilityLabel="Open navigation menu"
          accessibilityRole="button">
          <Text style={[styles.hamburgerIcon, textStyle]}>☰</Text>
        </TouchableOpacity>
      </View>
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

            <Pressable 
              style={[styles.featureCard, { backgroundColor: theme.cardBackground }]}
              onPress={onNavigateToGroceryList}>
              <Text style={styles.featureIcon}>🛒</Text>
              <Text style={[styles.featureTitle, textStyle]}>
                Grocery List
              </Text>
              <Text style={[styles.featureDescription, textStyle]}>
                Collaborative shopping lists that sync in real-time
              </Text>
              <Text style={[styles.tapHint, {color: theme.text}]}>
                Tap to open →
              </Text>
            </Pressable>

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

function PlaceholderScreen({
  screen,
  isDarkMode,
  onOpenSidebar,
}: {
  screen: string;
  isDarkMode: boolean;
  onOpenSidebar: () => void;
}) {
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onOpenSidebar}
          style={styles.hamburgerButton}
          accessibilityLabel="Open navigation menu"
          accessibilityRole="button">
          <Text style={[styles.hamburgerIcon, textStyle]}>☰</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.placeholderContainer,
          {paddingTop: safeAreaInsets.top + 60},
        ]}>
        <Text style={[styles.placeholderTitle, textStyle]}>{screen}</Text>
        <Text style={[styles.placeholderText, textStyle]}>
          This feature is coming soon!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: {
    fontSize: 28,
    fontWeight: '300',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    opacity: 0.7,
  },
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
  tapHint: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    opacity: 0.6,
  },
});

export default App;
