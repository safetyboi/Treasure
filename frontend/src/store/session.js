// src/store/session.js

import jwtFetch from './jwt';

const RECEIVE_CURRENT_USER = "session/RECEIVE_CURRENT_USER";
const REMOVE_CURRENT_USER = "session/REMOVE_CURRENT_USER";
const RECEIVE_SESSION_ERRORS = "session/RECEIVE_SESSION_ERRORS";
const CLEAR_SESSION_ERRORS = "session/CLEAR_SESSION_ERRORS";
export const RECEIVE_USER_LOGOUT = "session/RECEIVE_USER_LOGOUT";

// Dispatch receiveCurrentUser when a user logs in.
const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});

const removeCurrentUser = userId => ({
  type: REMOVE_CURRENT_USER,
  userId
});
  
// Dispatch receiveErrors to show authentication errors on the frontend.
const receiveErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

// Dispatch logoutUser to clear the session user when a user logs out.
const logoutUser = () => ({
  type: RECEIVE_USER_LOGOUT
});

// Dispatch clearSessionErrors to clear any session errors.
export const clearSessionErrors = () => ({
  type: CLEAR_SESSION_ERRORS
});


export const signup = user => startSession(user, 'api/users/register');
export const login = user => startSession(user, 'api/users/login');

const startSession = (userInfo, route) => async dispatch => {
  try {
    const res = await jwtFetch(route, {
      method: "POST",
      body: JSON.stringify(userInfo)
    })
    const { user, token } = await res.json();
    localStorage.setItem('jwtToken', `Bearer ${token}`);
    return dispatch(receiveCurrentUser(user));
  } catch (err) {
    const message = await err.json();
    return dispatch(receiveErrors(message.errors));
  }
};

//----------------update Image-------------------

export const updateUserImage = (userId, formData) => async dispatch => {
  const res = await jwtFetch(`/api/users/${userId}`, {
    method: "PATCH",
    body: formData,
  })
}

export const fetchUser = () => async dispatch => {
  const res = await jwtFetch(`/api/users/current`)
  const user = await res.json();
  return dispatch(receiveCurrentUser(user));
}

//----------------logout---------------------


export const logout = () => dispatch => {
  localStorage.removeItem('jwtToken');
  dispatch(logoutUser());
};

export const getCurrentUser = () => async dispatch => {
  const res = await jwtFetch('/api/users/current');
  const user = await res.json();
  return dispatch(receiveCurrentUser(user));
};

export const deleteUser = userId => async dispatch => {
  const res = await jwtFetch('/api/users/current', {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(removeCurrentUser(userId));
  }
}

const initialState = {
  user: undefined
};

const nullErrors = null;

export const sessionErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_SESSION_ERRORS:
      return action.errors;
    case RECEIVE_CURRENT_USER:
    case CLEAR_SESSION_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};
  
  const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
      case RECEIVE_CURRENT_USER:
        return {...state, user: action.currentUser };
      case REMOVE_CURRENT_USER:
        let nextState = {...state};
        delete nextState[action.userId];
        return nextState;
      case RECEIVE_USER_LOGOUT:
        return initialState;
      default:
        return state;
    }
  };
  
  export default sessionReducer;