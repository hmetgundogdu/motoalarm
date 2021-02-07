import { PUT_DEVICE_SIGNAL } from '../actionTypes'

const signals = (state = [], action) => {
    switch (action.type) {
      case PUT_DEVICE_SIGNAL: // 1 IN 1 OUT
        return [
          {
            stateChanges: action.signal.stateChanges,
            signaldBm: action.signal.signaldBm,
            recivedDate: new Date()
          },
          ...(state.length > 9 ? (state.splice(1, state.length)) : state)
        ]
      default:
        return state
    }
  }
   
  export default signals;