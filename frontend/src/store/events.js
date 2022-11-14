import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const RECEIVE_EVENTS = "events/RECEIVE_EVENTS";
const RECEIVE_USER_EVENTS = "events/RECEIVE_USER_EVENTS";
const RECEIVE_NEW_EVENT = "events/RECEIVE_NEW_EVENT";
const RECEIVE_EVENT_ERRORS = "events/RECEIVE_EVENT_ERRORS";
const CLEAR_EVENT_ERRORS = "events/CLEAR_EVENT_ERRORS";

const receiveEvents = events => ({
  type: RECEIVE_EVENTS,
  events
});

const receiveUserEvents = events => ({
  type: RECEIVE_USER_EVENTS,
    events
});

const receiveNewEvent = event => ({
  type: RECEIVE_NEW_EVENT,
  event
});

const receiveErrors = errors => ({
  type: RECEIVE_EVENT_ERRORS,
  errors
});

export const clearEventErrors = errors => ({
    type: CLEAR_EVENT_ERRORS,
    errors
});