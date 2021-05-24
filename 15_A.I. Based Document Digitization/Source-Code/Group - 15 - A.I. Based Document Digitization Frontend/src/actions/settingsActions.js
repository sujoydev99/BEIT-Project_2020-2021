import axios from "axios";
import { clearErrors } from "../utils/dispatcher";
import { GET_ERRORS, SET_PASSWORD } from "./types";

export const setPassword = (creds) => (dispatch) => {
  axios
    .post("https://backend.examli.com/api/v1/student/changepassword", creds)
    .then((res) => {
      dispatch({
        type: SET_PASSWORD,
      });
      dispatch(clearErrors());
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
          ? err.response.data
          : "An error occured please try again",
      })
    );
};
