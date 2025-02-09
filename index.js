import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PlaybackService } from './player/service'
import TrackPlayer from 'react-native-track-player';
import Client from './api/client';

console.debug("Launching...");

Client.instance;
console.debug("Created Jellify client");

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent('RNCarPlayScene', () => App)
// TrackPlayer.registerPlaybackService(() => PlaybackService);