import { SET_SLOT_MACHINE_CONTRACT } from "./types";

export const loadSlotMachineContract = (web3) => dispatch => {
  return new Promise((resolve, reject) => {
    fetch('/contracts/Casino.json')
      .then(res => res.json())
      .then(contractJSON => {

        dispatch({
          type: SET_SLOT_MACHINE_CONTRACT,
          contractJSON: contractJSON,
        });

        resolve(contractJSON);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

