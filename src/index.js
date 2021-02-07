import React, { Component, useEffect } from 'react';
import { Provider } from 'react-redux'
import { AppState, PermissionsAndroid } from 'react-native'
import AsyncStorage from "@react-native-community/async-storage";

import Navigator from './navigations';
import Sound from 'react-native-sound';

import store from './store'
import { SET_ALARM_OBJECT, SET_ALARM_SOUND_OBJECT, SET_SETTINGS } from './actionTypes'

import RNDisableBatteryOptimizationsAndroid from 'react-native-disable-battery-optimizations-android';


export default class App extends Component {

    constructor(props) {
        super();
        this.state = {
            appState: AppState.currentState,
            sound: null,
        }
    }

    async componentDidMount() {
        let s = this;
        AppState.addEventListener('change', this._handleAppStateChange);
        const motoAlarmSettings = await AsyncStorage.getItem("@alarm_settings");
        
        if (motoAlarmSettings != null) {
            console.log(motoAlarmSettings);
            store.dispatch({ type: SET_SETTINGS, settings: JSON.parse(motoAlarmSettings) });
        }

        s.state.sound = await new Sound(require('./assets/alarms/BurglarAlarm.mp3'), (error) => {
            console.log(error)
            if (error) {
            }
            //this._playalarm();
        })

        store.dispatch({ type: SET_ALARM_SOUND_OBJECT, sound: s.state.sound });

        setTimeout(() => console.log(store.getState().alarm, s.state.sound), 1500);

        // todo fix this block by reciving per req sortly.
        if (Platform.OS === "android") {

            await RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then((isEnabled) => {
                if (isEnabled) {
                    RNDisableBatteryOptimizationsAndroid.openBatteryModal();
                }
            });

            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
            ]);

            console.log(result);
        }
        //const permFineLocaltion = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        //const permBackgroundLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);

        //console.log("ACCESS_FINE_LOCATION")
        //await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, (status) => console.log("ACCESS_FINE_LOCATION"));
        //console.log("ACCESS_BACKGROUND_LOCATION")
        //await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, (status) => console.log("ACCESS_BACKGROUND_LOCATION"));

    }

    _playalarm() {
        this.state.sound.play((success) => {
            if (!success) {
                console.log('Sound did not play')
            }
        })
    }

    _handleAppStateChange = (stateString) => {
        let interval = null;
        if (stateString.match(/inactive|background/)) {

        } else if (stateString == "active") {

        }
        console.log(stateString);
    }

    render() {
        return (
            <Provider store={store}>
                <Navigator />
            </Provider>
        );
    }
};

