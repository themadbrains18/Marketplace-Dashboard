const axios = require("axios");
const {apiurl} = require('../config');
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function receiveLogin() {
  return {
    type: LOGIN_SUCCESS
  };
}

function loginError(payload) {
  return {
    type: LOGIN_FAILURE,
    payload,
  };
}

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

// logs the user out
export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('authenticated');
    dispatch(receiveLogout());
  };
}

export async function loginUser(creds) {
  return await axios.post(apiurl+"login",creds).then(function (response){
    console.log(response);
    if(response.data.status==401){
      return response;
    }
    else if(response.data.status==200){
      localStorage.setItem('authenticated', true)
      localStorage.setItem('access_token', response.data.access_token);
      return response;
    }
  })
}

