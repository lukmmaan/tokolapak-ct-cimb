import { combineReducers } from "redux";
import userReducer from "./user";
import searchValue from "./search"
export default combineReducers({
  user: userReducer,
  search:searchValue,
});
