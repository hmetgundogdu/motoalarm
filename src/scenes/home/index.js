import React, { Component, useState, useEffect } from 'react';
import { ImageBackground, View, Alert, PermissionsAndroid, NativeEventEmitter, NativeModules } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { BleManager, ScanMode, BleManagerOptions } from 'react-native-ble-plx';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Buffer } from 'buffer'

import { setDevice } from '../../actions'
import { Provider, connect } from 'react-redux'

import store from '../../store'

import BackgroundService from 'react-native-background-actions';
import { PUT_DEVICE_SIGNAL } from '../../actionTypes';


const activeAlarm = (active) => {
  const soundObject = store.getState().alarm.soundObject;
  if (active)
    soundObject.play((success) => {
      if (!success) {
        console.log('Sound did not play')
      }
    })
  else
    soundObject.stop();
}

const veryIntensiveTask = async (taskDataArguments) => {

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const { delay, homeCompenent, dispatch } = taskDataArguments;

  let bleManager = new BleManager({
    restoreStateIdentifier: 'motoalarm',
    restoreStateFunction: (bleRestoredState) => {
      console.log('restoreStateFunction called');
    },
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

class Home extends Component {

  constructor() {
    super();
    this.state = {
      devicePaired: false,
      pairingWithDevice: false,
      bleManager: new BleManager(),
      device: null,
      listeningDevice: false,
      counter: 0
    }

  }

  componentDidMount() {
    //TODO:Get device permissions for android and ios
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    // this._onPressPairDeviceButton() // auto pair
    globalThis._onPressListenDevice = this._onPressListenDevice.bind(this);
  }

  componentWillUnmount() {

  }

  _onPressStopAlarmButton = () => {
    activeAlarm(false);
  }

  _onPressPairDeviceButton = () => {
    let s = this;
    s.setState({ pairingWithDevice: true });

    // unpair device
    if (s.state.devicePaired) {

      // reset related state properties
      s.setState({
        pairingWithDevice: false,
        devicePaired: false,
        device: null
      });

      s.props.dispatch({ type: 'RESET_DEVICE' });
      s.state.bleManager.stopDeviceScan();
      BackgroundService.stop();

      return;
    } else
      // timeout for searching device 
      setTimeout(() => {
        // we dont need any more timeout.
        if (!s.state.pairingWithDevice)
          return;
        s.state.bleManager.stopDeviceScan();
        if (s.state.device == null) {
          Alert.alert("Info", "Device didn't found! \nTry pair more close to the device.");
        }
        s.setState({ pairingWithDevice: false });
      }, 5000)

    // start scan device for pair
    if (true)
      s.state.bleManager.startDeviceScan(null, { scanMode: 2 }, (err, dev) => {

        console.log(dev);
        // if we got err stop scan and put a alert
        if (err) {
          Alert.alert("Opps", err[Object.keys(err)[0]]);
          s.state.bleManager.stopDeviceScan();
          s.setState({ pairingWithDevice: false });
        }

        // find our device
        if (dev != null && dev.name == "AlarmDev") {
          // stop scan device.
          s.state.bleManager.stopDeviceScan();
          // save device for listen
          s.setState({ device: dev });
          s.props.dispatch({ type: 'SET_DEVICE', device: dev });
          //device setss
          //Alert.alert("Info", "Device found! \nYou can active listen alarm device.");
          s.setState({ pairingWithDevice: false, devicePaired: true });
        } else {
          return;
        }

        if (dev == null)
          return;
        let alarmPayload = dev.serviceData[Object.keys(dev.serviceData)[0]];
        //console.log(JSON.stringify(new Uint8Array(alarmPayload)), alarmPayload);
        console.log(Buffer.from(alarmPayload, 'base64'));

      });



  }

  _onPressListenDevice = (e) => {
    let s = this;
    if (s.state.listeningDevice) {

      BackgroundService.stop();
      s.setState({ listeningDevice: false });

      return;
    }

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
      parameters: {
        delay: 10000,
        homeCompenent: s,
        dispatch: this.props.dispatch
      },
    };

    BackgroundService.start(veryIntensiveTask, options);

    s.setState({ listeningDevice: true });
  }

  render() {

    const stopAndListenButtonSize = wp(30);
    const stopAndListenButtonLeftPosition = 1;

    const pairButtonSize = hp(16) + wp(16) / 2;

    return (
      <ImageBackground source={require('../../assets/images/bgConnection.jpg')} style={{ width: '100%', height: '100%' }} blurRadius={3}>
        <Text>{this.state.counter}</Text>
          <Button
            onPress={this._onPressStopAlarmButton}
            buttonStyle={{
              width: stopAndListenButtonSize,
              backgroundColor: "#665e52",
              left: stopAndListenButtonLeftPosition
            }}
            title="Stop alarm"
            titleStyle={{
              color: "white",
            }}
          />
          <Button
            onPress={this._onPressPairDeviceButton}
            buttonStyle={{
              height: pairButtonSize,
              width: pairButtonSize,
              backgroundColor: "#665e52",
            }}
            loading={this.state.pairingWithDevice}
            disabled={this.state.pairingWithDevice}
            loadingProps={{ size: 'large', color: 'white' }}
            icon={{
              name: this.state.devicePaired ? "perm-device-info" : "device-unknown",
              size: hp('8.5'),
              color: this.state.devicePaired ? "green" : "yellow",
            }}
            iconRight
            title={this.state.devicePaired ? "Unpair" : "Pair"}
            titleStyle={{
              color: "white",
              fontSize: 25,
            }}
          />
          <Button
            onPress={this._onPressListenDevice}
            buttonStyle={{
              width: stopAndListenButtonSize,
              backgroundColor: "#665e52",
              left: stopAndListenButtonLeftPosition
            }}
            disabled={!this.state.devicePaired}
            loadingProps={{ size: 'large', color: 'white' }}
            icon={{
              name: this.state.listeningDevice ? "play-disabled" : "play-arrow",
              
              color: this.state.listeningDevice ? "red" : "yellow",
            }}
            titleStyle={{
              color: "white",
              fontSize: 25
            }}
          />
      </ImageBackground>
    );
  }
};

export default connect()(Home);