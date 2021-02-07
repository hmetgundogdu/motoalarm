import AsyncStorage from "@react-native-community/async-storage";
import { SET_SETTINGS } from '../actionTypes'

const initialState = {
    senstive: 0.7,
    autoListen: false,
    connectionLostAlarm: false,
    connectionLostAlarmTimeout: 20,
    deviceScanFrequency: 2,
    autoSoundUpWhenAlarmOn: false
}


const signals = (state = initialState, action) => {
    switch (action.type) {
        case SET_SETTINGS: {

            let sv = Object.assign({}, action.settings);

            const valueOfTimeout = parseInt(sv.connectionLostAlarmTimeout);
            const valueOfScanFrequency = parseInt(sv.deviceScanFrequency);

            if (isNaN(valueOfTimeout))
                sv.connectionLostAlarmTimeout = 20;
            else
                sv.connectionLostAlarmTimeout = valueOfTimeout;

            if (isNaN(valueOfTimeout))
                sv.deviceScanFrequency = 2; // default
            else
                sv.deviceScanFrequency = valueOfScanFrequency;

            
            // update localstorage async
            const x = AsyncStorage.setItem("@alarm_settings", JSON.stringify(sv));

            console.log("save storage", sv, x);
            return sv;
        }
        default:
            return state
    }
}

export default signals;