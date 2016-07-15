import {AsyncStorage} from 'react-native';

import * as types from './actionTypes';
import * as url from '../../libraries/url';

export function get() {
  return async function(dispatch, getState){
    AsyncStorage.getItem('unread', (error, result) => {
      const unread = !result ? '1' : result;

      fetch('http://reader.livedoor.com/api/subs', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: url.encode({
          unread: unread
        })
      })
      .then(response => response.json())
      .then(json => {
        AsyncStorage.getItem('order', (error, result) => {
          const order = !result ? '0' : result;

          dispatch({
            type: types.GET,
            items: json.sort((a, b) => {
              switch (order) {
                case '0':
                  return b.modified_on - a.modified_on;
                case '1':
                  return a.modified_on - b.modified_on;
                case '2':
                  return b.unread_count - a.unread_count;
                case '3':
                  return a.unread_count - b.unread_count;
                case '4':
                  return a.title - b.title;
                case '5':
                  return b.rate - a.rate;
                case '6':
                  return b.subscribers_count - a.subscribers_count;
                case '7':
                  return a.subscribers_count - b.subscribers_count;
              }
            })
          });
        });
      })
      .catch(error => {
        dispatch({
          type: types.FAIL,
          items: []
        });
      });
    });
  };
}