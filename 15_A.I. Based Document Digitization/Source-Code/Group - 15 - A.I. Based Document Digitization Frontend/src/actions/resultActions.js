import axios from "axios";
import { clearErrors } from "../utils/dispatcher";
import { GET_ERRORS, GET_RESULTS, GET_RESULT, RESULT_LOADING } from "./types";

export const getResults = () => (dispatch) => {
  dispatch(setResultLoading());
  axios
    .get("https://backend.examli.com/api/v1/student/results")
    .then((res) => {
      dispatch({
        type: GET_RESULTS,
        payload: res.data.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response
          ? err.response.data
          : "An error occured please try again",
      })
    );
};

export const getResult = (id) => (dispatch) => {
  dispatch(setResultLoading());
  axios
    .get(`https://backend.examli.com/api/v1/student/result/${id}`)
    .then((res) => {
      dispatch({
        type: GET_RESULT,
        payload: res.data.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response
          ? err.response.data
          : "An error occured please try again",
      });
    });
};

export const setResultLoading = () => {
  return {
    type: RESULT_LOADING,
  };
};
