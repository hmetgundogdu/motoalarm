import { combineReducers } from 'redux'

import device from './device' 
import signals from './signals'
import settings from './settings'
import alarm from './alarm'

export default combineReducers({
    device,
    signals,
    settings,
    alarm
})