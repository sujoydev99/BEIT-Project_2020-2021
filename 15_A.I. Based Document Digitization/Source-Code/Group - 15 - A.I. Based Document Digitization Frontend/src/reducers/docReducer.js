import { GET_DOCS, GET_DOC, GET_EXTRACTED } from "../actions/types";
const initialState = {
  docs: [],
  doc: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DOCS:
      let docs = [];
      for (let i = 0; i < action.payload.length; i++) {
        docs.push({
          key:i+1,
          _id: action.payload[i]._id["$oid"],
          fileName: action.payload[i].fileName,
          metaData: action.payload[i].metaData,
          timestamp: new Date(action.payload[i].timestamp["$date"]).toUTCString() ,
          amt:action.payload[i].metaData["Total bill amount"],
        });
      }
      return {
        ...state,
        docs: docs,
      };
    case GET_DOC: 
    let doc = {
        _id: action.payload._id["$oid"],
          fileName: action.payload.fileName,
          metaData: action.payload.metaData,
          timestamp: new Date(action.payload.timestamp["$date"]).toUTCString() ,
          amt:action.payload.metaData["Total bill amount"],
      }
      return {
        ...state,
        doc: doc,
      };
    case GET_EXTRACTED: 
            return {
        ...state,
        doc: action.payload,
      };
    default:
      return state;
  }
}
