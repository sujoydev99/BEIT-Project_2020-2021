import { GET_TEXT_EXTRACT,GET_LABELS, RETRAIN_REQUEST } from "../actions/types";
const initialState = {
  content: {},
  labels: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TEXT_EXTRACT:
      return {
        ...state,
        content: action.payload,
      };
    case GET_LABELS: 
      return {
        ...state,
        labels: action.payload,
      };
    case RETRAIN_REQUEST:
      return{
        ...state, 
        message: action.payload
      }
    default:
      return state;
  }
}
