import axios from "axios";
import { GET_ERRORS, LOADING, GET_OVERVIEW} from "./types";

  
export const setLoading = (payload) => {
  return {
    type: LOADING,
    payload: payload
  };
};

export const getOverview = () => (dispatch) => {
  dispatch(setLoading(true));
 axios
   .get(`http://localhost:5000/get-overview`)
   .then((res) => {
     dispatch({
       type: GET_OVERVIEW,
       payload: res.data,
     });
   })
   .catch((err) =>{
     console.log(err);
     dispatch({
       type: GET_ERRORS,
       payload: err.response.message,
     })}
   );
   dispatch(setLoading(false));
};




