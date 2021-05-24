import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import docReducer from "./docReducer";
import loadingReducer from "./loadingReducer";
import extractReducer from "./extractReducer";
import contributionReducer from "./contributionReducer";
import overviewReducer from "./overviewReducer";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  loading: loadingReducer,
  doc: docReducer,
  content: extractReducer,
  contribution:contributionReducer,
  overview:overviewReducer
});
