import jwt_decode from "jwt-decode";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { CLEAR_ERRORS, GET_ERRORS, SET_CURRENT_USER } from "./types";

export const loginUser = (userData, history) => (dispatch) => {
  axios
    .post("http://localhost:5000/login", userData)
    .then((res) => {
      const { data } = res.data;
      localStorage.setItem("jwtToken", data);
      setAuthToken(data);
      const decoded = jwt_decode(data);
      dispatch(setCurrentUser(decoded));
      dispatch({
        type: CLEAR_ERRORS,
      });
      history.push("/dashboard");
    })
    .catch((err) =>{
    console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response,
      })}
    );
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  console.log("calling");
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  window.location.href = "/";
};


export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("http://localhost:5000/register", userData)
    .then((res) => {
      dispatch({
        type: CLEAR_ERRORS,
      });
      history.push("/");
    })
    .catch((err) =>{
    console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response,
      })}
    );
};