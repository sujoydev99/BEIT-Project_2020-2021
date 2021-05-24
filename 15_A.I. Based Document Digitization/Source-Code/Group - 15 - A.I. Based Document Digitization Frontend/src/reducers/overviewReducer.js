import { GET_OVERVIEW } from "../actions/types";
const initialState = {
  overview: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_OVERVIEW: 
      return {
        ...state,
        overview: action.payload,
      };
    default:
      return state;
  }
}
