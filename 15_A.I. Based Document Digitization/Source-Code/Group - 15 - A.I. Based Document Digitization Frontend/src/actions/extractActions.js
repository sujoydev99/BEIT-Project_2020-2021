import axios from "axios";
import { GET_ERRORS, GET_TEXT_EXTRACT,GET_LABELS,RETRAIN_REQUEST, LOADING} from "./types";


export const getTextExtract = (data) => (dispatch) => {
  dispatch(setLoading(true));
  const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
   axios
     .post(`http://localhost:5000/get-text-extract`, data,config )
     .then((res) => {
       console.log(res.data);
       dispatch({
         type: GET_TEXT_EXTRACT,
         payload: res.data,
       });
     })
     .catch((err) =>{
       console.log(err);
       dispatch({
         type: GET_ERRORS,
         payload: err.response.message,
       }
       )
      }
     );
     dispatch(setLoading(false));
  };
  
export const setLoading = (payload) => {
  return {
    type: LOADING,
    payload: payload
  };
};


export const getLabels = () => (dispatch) => {
  dispatch(setLoading(true));
 axios
   .get(`http://localhost:5000/get-labels`)
   .then((res) => {
     dispatch({
       type: GET_LABELS,
       payload: res.data.labels,
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

export const sendAnnotation = (body, id) => (dispatch) => {
  dispatch(setLoading(true));
 axios
   .post(`http://localhost:5000/submit-retrain-request/${id}`,body)
   .then((res) => {
     dispatch({
       type: RETRAIN_REQUEST,
       payload: res.data.message,
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


