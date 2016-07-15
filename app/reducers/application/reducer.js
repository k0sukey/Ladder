import Immutable from 'seamless-immutable';

import * as types from './actionTypes';

const initialState = Immutable({
  root: undefined,
  current: 'center'
});

export default function application(state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return state.merge({
        root: action.root
      });
    case types.NAVIGATION:
      return state.merge({
        current: action.current
      });
    default:
      return state;
  }
}