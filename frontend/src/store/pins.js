import jwtFetch from "./jwt";


const RECEIVE_NEW_PIN = "RECEIVE_NEW_PIN"
const RECEIVE_EVENT_PINS = "RECEIVE_EVENT_PINS"
const REMOVE_EVENT_PINS = "REMOVE_EVENT_PINS"
//errors?



const receiveNewPin = pin => ({
    type: RECEIVE_NEW_PIN,
    pin
  });

  // const receiveEventPins = eventId => ({
  //   type: RECEIVE_EVENT_PINS,
  //   events
  // });

  // const removeEventPins = eventId => ({
  //   type: REMOVE_EVENT_PINS,
  //   events
  // });

  export const createPin = data => async dispatch => {
    const res = await jwtFetch('/api/pins/', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const pin = await res.json();
      dispatch(receiveNewPin(pin));
      //no error-handling yet
  }

  const pinsReducer = (state = {}, action) => {
    switch(action.type) {
        case RECEIVE_NEW_PIN:
            return {...state, pins: action.pin};
            //more cases?
        default:
            return state;
    }
  }

  export default pinsReducer; //note: has not been added to rootReducer