import { GET_CONTRIBUTIONS, GET_CONTRIBUTION } from "../actions/types";
const initialState = {
  contributions: [],
  contribution: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CONTRIBUTIONS:
      let contributions = [];
      for (let i = 0; i < action.payload.length; i++) {
        contributions.push({
          key:i+1,
          _id: action.payload[i]._id["$oid"],
          fileName: action.payload[i].fileName,
          // metaData: action.payload[i].metaData,
          timestamp: new Date(action.payload[i].timestamp["$date"]).toUTCString() ,
          // amt:action.payload[i].metaData["Total bill amount"],
        });
      }
      return {
        ...state,
        contributions: contributions,
      };
    case GET_CONTRIBUTION: 
    let contribution = {
        _id: action.payload._id["$oid"],
          fileName: action.payload.fileName,
          annotation: action.payload.retrainObject.annotation,
          content:action.payload.retrainObject.content
      }
      return {
        ...state,
        contribution: contribution,
      };
    default:
      return state;
  }
}
