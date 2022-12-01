import jwtFetch from "./jwt";

const RECEIVE_NEW_PIN = "RECEIVE_NEW_PIN"
const RECEIVE_EVENT_PINS = "RECEIVE_EVENT_PINS"
const REMOVE_EVENT_PINS = "REMOVE_EVENT_PINS"
const REMOVE_PIN = "REMOVE_PIN"
//errors?


const receiveNewPin = pin => ({
    type: RECEIVE_NEW_PIN,
    pin
  });

const receiveEventPins = pins => ({
  type: RECEIVE_EVENT_PINS,
  pins
});

// const removeEventPins = eventId => ({
//   type: REMOVE_EVENT_PINS,
//   events
// });

const removePin = id => ({
  type: REMOVE_PIN,
  id
});

export const getEventPins = (eventId) => (state) => {
  if (state.pins) return Object.values(state.pins).filter(pin => {
    return pin.event === eventId
  });
  return [];
}

export const fetchEventPins = eventId => async dispatch => {
  try {
      const res = await jwtFetch(`/api/pins/${eventId}`);
      const eventPins = await res.json();
    dispatch(receiveEventPins(eventPins));
    return eventPins;
  } catch (err) {
    const resBody = await err.json();
    // if (resBody.statusCode === 400) {
    //   dispatch(receiveErrors(resBody.errors));
    // }
  }

}

export const createPin = data => async dispatch => {
  const res = await jwtFetch(`/api/pins/${data.event}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const pin = await res.json();
    dispatch(receiveNewPin(pin));
    //no error-handling yet
}

export const deletePin = id => async dispatch => {
  try {
  const res = await jwtFetch(`/api/pins/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(removePin(id))
  }
  } catch(err) {
    const resBody = await err.json();
      if (resBody.statusCode === 400) {
      // return dispatch(receiveErrors(resBody.errors));
      return null;
    }
  }
}

const pinsReducer = (state = {}, action) => {
  switch(action.type) {
      case RECEIVE_NEW_PIN:
          return {...state, [action.pin._id]: action.pin};
      case RECEIVE_EVENT_PINS:
          return action.pins;
      case REMOVE_PIN:
          let nextState = {...state};
          delete nextState[action.id];
          return nextState;
      default:
          return state;
  }
}

export default pinsReducer; //note: has not been added to rootReducer