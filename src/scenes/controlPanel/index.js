import React from 'react';
import { StyleSheet, View, Switch, Text, ImageBackground, Button } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Icon } from 'react-native-elements';

import store from '../../store'

import { connect } from "react-redux";


class ControlPanel extends React.Component {

  constructor(props) {
    super();
    let s = this;
  }

  _getSignalLevelAsColor() {
    return 'green';
  }

  componentDidMount() {
    console.log(this);
  }

  componentWillUnmount() {

  }

  showstate = () => {
    console.log(this.props);
    console.log(this.props.signals);
  }

  render() {
    return (
      <ImageBackground source={require('../../assets/images/bgControlPanel.jpg')} style={{ width: '100%', height: '100%' }} blurRadius={3}>
        <View style={styles.panel1}>
          <Text style={styles.label1}>Last update time</Text>
          <Text style={styles.label1value}>{this.props.currentDeviceStatus.recivedDate}</Text>
        </View>
        <View style={styles.panel1}>
          <Text style={styles.label1}><Icon name="filter-tilt-shift"></Icon>Total State Changes</Text>
          <Text style={{ ...styles.label1value, fontSize: wp('8'), color: 'blue' }}>
            {this.props.currentDeviceStatus.totalStateChanges}
          </Text>
        </View>
        <View style={styles.panel1}>
          <Text style={styles.label1}>
            <Icon style={{ marginRight: 5 }} name="wifi"></Icon>
            Signal
          </Text>
          <Text style={{ ...styles.label1value, fontSize: wp('9'), color: 'blue', marginRight: 5 }}>
            {this.props.currentDeviceStatus.signaldBm}
          </Text>
          <Text style={{ right: wp(5), position: 'absolute', fontSize: wp('3'), color: 'blue' }}>dBm</Text>
        </View>
        <View style={styles.panel1}>
          <Text style={styles.label1}>Signal Level</Text>
          <Text style={{ ...styles.label1value, fontSize: 35, color: 'green' }}>
            {this.props.currentDeviceStatus.signalLevel}
          </Text>
        </View>
        <View style={styles.panel1}>
          <Text style={styles.label1}>Device Id</Text>
          <Text style={styles.label1value}>{this.props.deviceId || 'None'}</Text>
        </View>
        <View style={styles.panel1}>
          <Text style={styles.label1}>Device Name</Text>
          <Text style={styles.label1value}>{this.props.deviceName || 'None'}</Text>
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

const mapStateToProps = state => {

  let currentDeviceStatus = {
    totalStateChanges: 0,
    signaldBm: 0,
    signalLevel: '0%'
  };

  if (state.signals.length > 0) {
    let c = currentDeviceStatus;
    let lastSignal = state.signals[0];
    // set prop has c by lastSignal
    c.recivedDate = lastSignal.recivedDate.toLocaleString();
    c.totalStateChanges = lastSignal.stateChanges;
    c.signaldBm = lastSignal.signaldBm;
    c.signalLevel = parseInt(((lastSignal.signaldBm / -90 * 100) - 100) * -1) + '%';
  };

  console.log("1");

  return {
    ...state.device,
    signals: [...state.signals],
    currentDeviceStatus
  }
};

export default connect(mapStateToProps)(ControlPanel);
