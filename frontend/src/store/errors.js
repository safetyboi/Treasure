import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { eventErrorsReducer } from './events';

export default combineReducers({
  session: sessionErrorsReducer,
  events: eventErrorsReducer
});