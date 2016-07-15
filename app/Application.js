import {Navigation} from 'react-native-navigation';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as reducers from './reducers';
import * as ApplicationActions from './reducers/application/actions';
import {registerScreens} from './screens';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
registerScreens(store, Provider);

export default class Application {
  constructor() {
    this._populateIcons().then(() => {
      store.subscribe(this.onStoreUpdate.bind(this));
      store.dispatch(ApplicationActions.authorize());
    }).catch((error) => {
      console.error(error);
    });
  }

  onStoreUpdate() {
    const {root} = store.getState().application;

    if (this.currentRoot !== root) {
      this.currentRoot = root;
      this.startApplication(root);
    }
  }

  startApplication(root) {
    if (root === 'login') {
      this.showLogin();
    } else if (root === 'reader') {
      this.showReader();
    }
  }

  showLogin() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'Login',
        title: 'Ladder',
        navigatorStyle: {
          navBarTextColor: '#ffffff',
          navBarBackgroundColor: '#ef6e67',
          navBarButtonColor: '#ffffff',
          navBarNoBorder: true
        }
      },
      passProps: {}
    });
  }

  showReader() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'Feeds',
        title: 'Ladder',
        navigatorStyle: {
          navBarTextColor: '#ffffff',
          navBarBackgroundColor: '#ef6e67',
          navBarButtonColor: '#ffffff',
          navBarHideOnScroll: true,
          navBarNoBorder: true,
          statusBarHideWithNavBar: true
        },
        navigatorButtons: {
          rightButtons: [{
            id: 'settings',
            icon: this.moreIcon
          }],
          leftButtons: [{
            id: 'subscribes',
            icon: this.menuIcon
          }]
        }
      },
      drawer: {
        right: {
          screen: 'Settings'
        },
        left: {
          screen: 'Subscribes'
        },
        type: 'MMDrawer',
        animationType: 'parallax',
        style: {
          rightDrawerWidth: '60',
          leftDrawerWidth: '90',
          contentOverlayColor: '#162d3d55'
        }
      },
      animationType: 'fade',
      passProps: {}
    });
  }

  _populateIcons = function () {
    return new Promise((resolve, reject) => {
      Promise.all(
        [
          Ionicons.getImageSource('ios-menu-outline', 30),
          Ionicons.getImageSource('ios-more-outline', 30)
        ]
      ).then((values) => {
        this.menuIcon = values[0];
        this.moreIcon = values[1];
        resolve(true);
      }).catch((error) => {
        console.log(error);
        reject(error);
      }).done();
    });
  };
}