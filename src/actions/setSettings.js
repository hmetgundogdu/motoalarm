import { SET_SETTINGS } from '../actionTypes'
// ble device object
export default (settings) => {
    // save to local storage
    return {
        type: SET_SETTINGS,
        settings
    }
}