import { SET_ALARM_SOUND_OBJECT, SET_ALARM_STATUS } from '../actionTypes'

const initialState = {
    soundObject: null,
    alarmStatus: false,
};

const signals = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALARM_SOUND_OBJECT: {
            let cloneOfState = Object.assign({}, state);

            cloneOfState["soundObject"] = action.sound;

            return cloneOfState;
        }
        case SET_ALARM_STATUS: {
            let newState = Object.assign({}, state);

            newState["alarmStatus"] = action.status;

            return newState;
        }
        default:
            return state
    }
}

export default signals;