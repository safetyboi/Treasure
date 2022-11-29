import jwtFetch from './jwt';

const RECEIVE_EVENTS = "events/RECEIVE_EVENTS";
const RECEIVE_EVENT = "events/RECEIVE_EVENT";
const RECEIVE_USER_EVENTS = "events/RECEIVE_USER_EVENTS";
const RECEIVE_EVENT_ERRORS = "events/RECEIVE_EVENT_ERRORS";
const CLEAR_EVENT_ERRORS = "events/CLEAR_EVENT_ERRORS";

const receiveEvents = events => ({
  type: RECEIVE_EVENTS,
  events
});

const receiveEvent = event => ({
    type: RECEIVE_EVENT,
    event

})

const receiveUserEvents = events => ({
  type: RECEIVE_USER_EVENTS,
    events
});

const receiveErrors = errors => ({
  type: RECEIVE_EVENT_ERRORS,
  errors
});

export const clearEventErrors = errors => ({
    type: CLEAR_EVENT_ERRORS,
    errors
});

export const loadEvents = state => {
  return state.events ? Object.values(state.events) : [];
}

export const loadEvent = eventId => state => {
  return state.events ? Object.values(state.events).filter(event => event._id === eventId)[0] : null
}

export const fetchEvents = () => async dispatch => {
    try {
      const res = await jwtFetch ('/api/events');
      const events = await res.json();
      dispatch(receiveEvents(events));
    } catch (err) {
      const resBody = await err.json();
      if (resBody.statusCode === 400) {
        dispatch(receiveErrors(resBody.errors));
      }
    }
  };

  export const fetchEvent = (eventId) => async dispatch => {
    try {
        const res = await jwtFetch (`/api/events/${eventId}`);
        const event = await res.json();
        dispatch(receiveEvent(event));
      } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
          dispatch(receiveErrors(resBody.errors));
        }
      }
  }
  
  export const fetchUserEvents = id => async dispatch => {
    try {
      const res = await jwtFetch(`/api/events/user/${id}`);
      const events = await res.json();
      dispatch(receiveUserEvents(events));
    } catch(err) {
      const resBody = await err.json();
      if (resBody.statusCode === 400) {
        return dispatch(receiveErrors(resBody.errors));
      }
    }
  };
  
  export const createEvent = data => async dispatch => {
    try {
      const res = await jwtFetch('/api/events/', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const event = await res.json();
      dispatch(receiveEvent(event));
      return event;
    } catch(err) {
      const resBody = await err.json();
      if (resBody.statusCode === 400) {
        // return dispatch(receiveErrors(resBody.errors));
        return null;
      }
    }
  };

  export const updateEvent = data =>  async dispatch => {
    try {
      const res = await jwtFetch(`api/events/${data.id}`,{ //this is fine so long as you shape the data object in the EventUpdate to have an "id" key
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      const updatedEvent = await res.json();
      dispatch(receiveEvent(updatedEvent));
        return updatedEvent;
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
        // return dispatch(receiveErrors(resBody.errors));
        return null;
        }
    }
  }

const nullErrors = null;

export const eventErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_EVENT_ERRORS:
      return action.errors;
    case CLEAR_EVENT_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

const eventsReducer = (state = {}, action) => {
    switch(action.type) {
      case RECEIVE_EVENTS:
        return action.events;
      case RECEIVE_EVENT:
        return {...state, [action.event._id]: action.event} 
      case RECEIVE_USER_EVENTS:
        return action.events;
      default:
        return state;
    }
  };
  
  export default eventsReducer;