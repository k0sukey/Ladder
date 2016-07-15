import Immutable from 'seamless-immutable';

import * as types from './actionTypes';

const initialState = Immutable({
  channel: {},
  items: []
});

export default function feed(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET:
      return state.merge({
        channel: action.channel,
        items: action.items
      });
    default:
      return state;
  }
}