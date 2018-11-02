import { SET_SLOT_MACHINE_CONTRACT } from '../actions/types';

const initialState = {
  contractJSON: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SLOT_MACHINE_CONTRACT:
      return {
        ...state,
        contractJSON: action.contractJSON
      };
    default:
      return state;
  }
}