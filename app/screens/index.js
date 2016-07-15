import {Navigation} from 'react-native-navigation';

import Login from './Login';
import Feeds from './Feeds';
import Subscribes from './Subscribes';
import Settings from './Settings';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('Login', () => Login, store, Provider);
  Navigation.registerComponent('Feeds', () => Feeds, store, Provider);
  Navigation.registerComponent('Subscribes', () => Subscribes, store, Provider);
  Navigation.registerComponent('Settings', () => Settings, store, Provider);
}