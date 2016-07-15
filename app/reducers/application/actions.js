import {AsyncStorage} from 'react-native';
import * as CookieManager from 'react-native-cookies';

import * as types from './actionTypes';
import * as url from '../../libraries/url';

export function changeApplicationRoot(root) {
  return {
    type: types.ROOT_CHANGED,
    root: root
  };
}

export function authorize() {
  return async function(dispatch, getState){
    CookieManager.load(() => {
      CookieManager.getAll((error, response) => {
        if (response.hasOwnProperty('member_sid')
         && response.hasOwnProperty('reader_sid')) {
          dispatch(changeApplicationRoot('reader'));
          return;
        }

        dispatch(changeApplicationRoot('login'));
      });
    });
  };
}

export function login(username: string, password: string) {
  return async function(dispatch, getState){
    fetch('https://member.livedoor.com/login/index', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: url.encode({
        livedoor_id: username,
        password: password,
        auto_login: 1,
        '.next': 'http://reader.livedoor.com:80/reader/',
        '.sv': 'reader'
      })
    })
    .then(response => {
      CookieManager.getAll((error, response) => {
        if (response.hasOwnProperty('member_sid')
         && response.hasOwnProperty('reader_sid')) {
          CookieManager.save(() => {
            dispatch(changeApplicationRoot('reader'));
          });
        } else {
          dispatch(changeApplicationRoot('login'));
        }
      });
    })
    .catch(error => {
      console.error(error);
    });
  };
}

export function logout() {
  return async function(dispatch, getState){
    CookieManager.clearAll((error, response) => {
      AsyncStorage.clear(() => {
        dispatch(changeApplicationRoot('login'));
      });
    });
  };
}