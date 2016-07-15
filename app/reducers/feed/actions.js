import * as types from './actionTypes';
import * as url from '../../libraries/url';

function touch(item) {
  fetch('http://reader.livedoor.com/api/touch_all', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: url.encode({
      subscribe_id: item.subscribe_id
    })
  })
  .catch(error => {
    console.error(error);
  });
}

export function get(item) {
  return async function(dispatch, getState){
    const isUnread = item.unread_count > 0;
    const base = 'http://reader.livedoor.com/api/';
    const api = isUnread ? `${base}unread` : `${base}all`;
    const body = isUnread ? {} : {offset: 0, limit: 1};

    fetch(api, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: url.encode(Object.assign(body, {
        subscribe_id: item.subscribe_id
      }))
    })
    .then(response => response.json())
    .then(json => {
      dispatch({
        type: types.GET,
        channel: json.channel,
        items: json.items
      });

      touch(item);
    })
    .catch(error => {
      dispatch({
        type: types.FAIL,
        channel: {},
        items: []
      });
    });
  };
}