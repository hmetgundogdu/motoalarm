const initialState = {
    deviceId: null,
    deviceName: null,
    deviceBleObject: null
};
import { SET_DEVICE, RESET_DEVICE } from '../actionTypes'
// returns new state
// parms: current state, new state
const setDevice = (state, device) => {
    let copyOfState = Object.assign({}, state);

    copyOfState["deviceId"] = device.id;
    copyOfState["deviceName"] = device.name;
    copyOfState["deviceBleObject"] = device;

    return copyOfState;
}

const device = (state = initialState, action) => {
    switch (action.type) {
        case SET_DEVICE: 
            return setDevice(state, action.device);
        case RESET_DEVICE:
            return setDevice(state,
                {
                    deviceId: null,
                    deviceName: null,
                    deviceBleObject: null
                }
            );
        default:
            return state;
    }
}

export default device;