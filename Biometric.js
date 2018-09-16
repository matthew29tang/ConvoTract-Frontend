import React, { Component } from 'react';
import {
  Text,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Expo, { Asset, Audio, FileSystem, Font, Permissions, AppLoading, Constants } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';
import { Button, Toolbar } from 'react-native-material-ui';
import { TextField } from 'react-native-material-textfield'

export default class Biometric extends Component {
  state = {
    compatible: true,
  };

  componentDidMount() {
    this.checkDeviceForHardware();
  }

  checkDeviceForHardware = async () => {
    let compatible = await Expo.Fingerprint.hasHardwareAsync();
    this.setState({ compatible });
    if (!compatible) {
      this.showIncompatibleAlert();
    }
  };

  showIncompatibleAlert = () => {
    this.dropdown.alertWithType(
      'error',
      'Incompatible Device',
      'Current device does not have the necessary hardware to use this API.'
    );
  };

  checkForBiometrics = async () => {
    let biometricRecords = await Expo.Fingerprint.isEnrolledAsync();
    if (!biometricRecords) {
      this.dropdown.alertWithType(
        'warn',
        'No Biometrics Found',
        'Please ensure you have set up biometrics in your OS settings.'
      );
    } else {
      this.handleLoginPress();
    }
  };
  
  handleLoginPress = () => {
    if (Platform.OS === 'android') {
      this.showAndroidAlert();
    } else {
      this.scanBiometrics();
    }
  };

  showAndroidAlert = () => {
    Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.');
    this.scanBiometrics();
  };

  scanBiometrics = async () => {
    let result = await Expo.Fingerprint.authenticateAsync('Biometric Scan.');
    if (result.success) {
      this.dropdown.alertWithType(
        'success',
        'Bio-Authentication succeeded',
        'You have signed the paper.'
      );
    } else {
      this.dropdown.alertWithType(
        'error',
        'Uh oh!',
        'Bio-Authentication failed or canceled.'
      );
    }
  };

  state = {
    phone: '',
  };

  render() {
    let { phone } = this.state;
    return (
    <View>{/*
        <TextField
          label='Name'
          value={phone}
          onChangeText={ (phone) => this.setState({ phone }) }
        /> */}
        <View style={styles.container}>
            <View style = {styles.bottombutton}>
              <Button raised primary text="Sign paper" onPress={
              this.state.compatible ? this.checkForBiometrics : this.showIncompatibleAlert
            }/>
            </View>

          <DropdownAlert
            ref={ref => (this.dropdown = ref)}
            closeInterval={5000}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#FFFFFF',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 60,
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.30)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  logo: {
    height: 128,
    width: 128,
  },
  bottombutton: {
    paddingTop: 330,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  box: {
    width: 250
  }
});
