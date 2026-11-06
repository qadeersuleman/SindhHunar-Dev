/**
 * @format
 */

// MUST be first — fixes Supabase "Cannot assign to property 'protocol'" on Hermes
import 'react-native-url-polyfill/auto';
import "./global.css";

// MUST be second — required by react-native-gesture-handler / React Navigation
import 'react-native-gesture-handler';
import './src/i18n';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
