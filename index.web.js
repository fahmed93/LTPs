import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register the app component
AppRegistry.registerComponent(appName, () => App);

// Wait for DOM to be ready before running
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AppRegistry.runApplication(appName, {
      rootTag: document.getElementById('root'),
    });
  });
} else {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
}
