import React from 'react';
import { StyleSheet, View, Switch, Text, ImageBackground, Button, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Slider, Icon } from 'react-native-elements';

import store from '../../store'

import { connect } from "react-redux";
import { SET_SETTINGS } from '../../actionTypes';


class ControlPanel extends React.Component {

  constructor(props) {
    super();

    this.state = {
      senstive: 0.5,
      autoListen: false,
      connectionLostAlarm: false,
      connectionLostAlarmTimeout: 20,
      deviceScanFrequency: 2,
      autoSoundUpWhenAlarmOn: false
    }
  }

  _onValueChangeAlarmSensitive = (value) =>
    this.setState({ senstive: value })

  _onValueChangeAutoListenSwitch = (value) =>
    this.setState({ autoListen: value })

  _onValueChangeConnectionLostAlarmSwitch = (value) =>
    this.setState({ connectionLostAlarm: value })

  _onValueChangeConnectionLoseTimeout = (value) =>
    this.setState({ connectionLostAlarmTimeout: value })

  _onValueChangeDeviceScanFrequency = (value) =>
    this.setState({ deviceScanFrequency: value })

  _onValueChangeAutoAlarmSoundUpSwitch = (value) =>
    this.setState({ autoSoundUpWhenAlarmOn: value })


  _onFocunsedThisPage = () => {
    // init state by redux settings state
    const s = this;
    const settingsFromState = store.getState().settings;

    s.setState(Object.assign({}, settingsFromState));
  }

  componentDidUpdate() {
    const s = this;
    // update global state async
    store.dispatch({ type: SET_SETTINGS, settings: s.state });
    console.log("settings updated!", JSON.stringify(s.state, null, 4));
  }

  componentDidMount() {
    const s = this;
    s.props.navigation.addListener('willFocus', s._onFocunsedThisPage);
    console.log("mounted");
  }

  componentWillUnmount() {
    //this.props.navigation.removeListener('willFocus');
  }

  render() {
    return (
      <ImageBackground source={require('../../assets/images/bgSettings.jpg')} style={{ width: '100%', height: '100%' }} blurRadius={3}>
        <View style={styles.panel1}>
          <Text style={styles.label1}>Alarm Sensitive</Text>
          <View style={styles.label1value}>
            <Slider
              value={this.state.senstive}
              onValueChange={this._onValueChangeAlarmSensitive}
              thumbStyle={{ height: 15, width: 15, backgroundColor: 'white' }}
              style={{ width: wp(40), height: 50 }}
            />
            <Text>{parseInt(this.state.senstive * 100) + '%'}</Text>
          </View>
        </View>
        <View style={styles.panel1}>
          <Text style={styles.label1}>Auto start listen</Text>
          <Switch
            style={styles.label1value}
            value={this.state.autoListen}
            onValueChange={this._onValueChangeAutoListenSwitch}></Switch>
        </View>
        <View style={styles.panel1}>
          <Text style={styles.label1}>
            Connection lost alarm
          </Text>
          <Switch
            style={styles.label1value}
            value={this.state.connectionLostAlarm}
            onValueChange={this._onValueChangeConnectionLostAlarmSwitch}>
          </Switch>
        </View>
        <View style={styles.panel1}>
          <Text style={{ ...styles.label1, top: 26, }}>Connection lost timeout ({this.state.connectionLostAlarmTimeout} sec)</Text>
          <View style={{ ...styles.label1, top: 36, left: wp(9) }}>
            <TextInput onChangeText={this._onValueChangeConnectionLoseTimeout} keyboardType="numeric" placeholder="Enter a number second" />
          </View>
        </View>
        <View style={styles.panel1}>
          <Text style={{ ...styles.label1, top: 26, }}>Device scan frequency ({this.state.deviceScanFrequency} second one time)</Text>
          <View style={{ ...styles.label1, top: 36, left: wp(9) }}>
            <TextInput onChangeText={this._onValueChangeDeviceScanFrequency} keyboardType="numeric" placeholder="Enter a number" />
          </View>
        </View>
        <View style={styles.panel1}>
          <Text style={styles.label1}>Auto sound up when alarm is on</Text>
          <Switch
            style={styles.label1value}
            value={this.state.autoSoundUpWhenAlarmOn}
            onValueChange={this._onValueChangeAutoAlarmSoundUpSwitch}></Switch>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  label1: { left: wp(10), position: 'absolute' },
  label1value: { right: wp(10), position: 'absolute' },
  panel1: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'white',
    opacity: 0.8,
    width: wp('90'),
    height: hp('11.7'),
    flexDirection: 'row',
    borderRadius: 30,
    marginTop: hp('2'),
    left: wp('5.5')
  }
});

export default ControlPanel;
