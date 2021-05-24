import axios from "axios";
import { GET_ERRORS, GET_DOCS, GET_DOC, LOADING, GET_EXTRACTED } from "./types";

export const getDocs = () => (dispatch) => {
   dispatch(setLoading(true));
  axios
    .get(`http://localhost:5000/get-docs`)
    .then((res) => {
      dispatch({
        type: GET_DOCS,
        payload: res.data.data,
      });
    })
    .catch((err) =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.message,
      })}
    );  
    dispatch(setLoading(false));
};
export const setLoading = (payload) => {
  return {
    type: LOADING,
    payload: payload
  };
};


export const getDoc = (id) => (dispatch) => {
  dispatch(setLoading(true));
 axios
   .get(`http://localhost:5000/get-doc/${id}`)
   .then((res) => {
     dispatch({
       type: GET_DOC,
       payload: res.data.data,
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


export const uploadDoc = (data) => (dispatch) => {
dispatch(setLoading(true));
const config = {
  headers: {
      'content-type': 'multipart/form-data'
  }
}
 axios
   .post(`http://localhost:5000/upload`, data,config )
   .then((res) => {
     console.log(res.data);
     dispatch({
       type: GET_EXTRACTED,
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


export const editDoc = (_id,data) => (dispatch) => {
  dispatch(setLoading(true));
 axios
   .put(`http://localhost:5000/update/${_id}`,data)
   .then((res) => {
     console.log(res.data);
    //  dispatch({
    //    type: GET_DOC,
    //    payload: res.data.data,
    //  });
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