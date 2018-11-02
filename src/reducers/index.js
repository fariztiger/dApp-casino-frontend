import {combineReducers} from "redux";

import slotMachineReducer from "./slotMachineReducer";

export default combineReducers({
    slotMachine: slotMachineReducer
});