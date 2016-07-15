import Immutable from 'seamless-immutable';

import * as types from './actionTypes';

const initialState = Immutable({
  items: []
});

export default function subscribe(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET:
      return state.merge({
        items: action.items
      });
    default:
      return state;
  }
}