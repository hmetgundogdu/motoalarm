import store from '../store'
import BackgroundService from 'react-native-background-actions';

const state = store.getState()

const settings = state.settings;
const alarm = state.alarm;

const _data = {
    active: false,
    settings,
    alarm
};

let AlarmForeground = {
    isActive: () => _data.active
}

AlarmForeground.start = (parameters) => {
    let s = _data;
    s.active = true;
    // start foreground service

    const options = {
        taskName: 'AFGmotoalarm',
        taskTitle: 'Motocycle Alarm',
        taskDesc: 'Alarm is running...',
        color: '#ff00ff',
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
        },
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters 
      };
  
    BackgroundService.start(foregroundTask, options);
}

AlarmForeground.stop = () => {
    s.active = false;
    BackgroundService.stop();
}

const activeAlarm = (active) => {
    let s = _data;
    const soundObject = s.alarm.soundObject;

    if (active)
        soundObject.play((success) => {
            if (!success) {
                console.log('Sound did not play')
            }
        })
    else
        soundObject.stop();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const foregroundTask = async (taskDataArguments) => {


    const { delay, homeCompenent, dispatch } = taskDataArguments;

    let bleManager = new BleManager({
        restoreStateIdentifier: 'motoalarm',
        restoreStateFunction: (bleRestoredState) => console.log('restoreStateFunction called')
    });


    await new Promise(async (resolve) => {
        let i = 0;

        let lastStateOfChange = 1;
        let currentStateOfChange = 1;

        bleManager.startDeviceScan(["00000918-0000-1000-8000-00805f9b34fb"], { scanMode: 2 }, (err, dev) => {
            // if we got err stop scan and put a alert
            if (err || !BackgroundService.isRunning()) {
                //Alert.alert("Opps", err[Object.keys(err)[0]]);
                bleManager.stopDeviceScan();
                return;
            }

            if (dev == null || dev.id !== store.getState().device.deviceId)
                return;

            const alarmPayload = dev.serviceData[Object.keys(dev.serviceData)[0]];
            //console.log(JSON.stringify(new Uint8Array(alarmPayload)), alarmPayload);
            const rawBuffer = Buffer.from(alarmPayload, 'base64');
            const signal = {
                stateChanges: rawBuffer[0],
                signaldBm: dev.rssi,
            };

            BackgroundService.updateNotification({
                taskDesc: 'Running...' +
                    '\nState changes: ' + rawBuffer[0] +
                    ' dBm:' + dev.rssi +
                    ' Cycle of service: ' + i
            });

            console.log(signal, rawBuffer);

            currentStateOfChange = signal.stateChanges;

            dispatch({ type: PUT_DEVICE_SIGNAL, signal });
        });

        for (; BackgroundService.isRunning(); i++) {
            homeCompenent.setState({ counter: i });


            // check alarm status play alarm
            if (lastStateOfChange != currentStateOfChange) {
                activeAlarm(true);
                lastStateOfChange = currentStateOfChange;
            }

            await sleep(1500);
        }
        bleManager.stopDeviceScan();
    });
};

Object.freeze(AlarmForeground);
export default AlarmForeground;
