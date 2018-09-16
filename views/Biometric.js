import React from "react";
import { View, Platform, Alert } from "react-native";
import Expo from "expo";
import DropdownAlert from "react-native-dropdownalert";
import { Button } from "react-native-material-ui";
import { Styles } from "../util/BiometricStyles";
import { API } from '../util/API';

class Biometric extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            compatible: true
        }
    }

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
            "error",
            "Incompatible Device",
            "Current device does not have the necessary hardware to use this API."
        );
    };

    checkForBiometrics = async () => {
        let biometricRecords = await Expo.Fingerprint.isEnrolledAsync();
        if (!biometricRecords) {
            this.dropdown.alertWithType(
                "warn",
                "No Biometrics Found",
                "Please ensure you have set up biometrics in your OS settings."
            );
        } else {
            this.handleLoginPress();
        }
    };
  
    handleLoginPress = () => {
        if (Platform.OS === "android") {
            this.showAndroidAlert();
        } else {
            this.scanBiometrics();
        }
    };

    showAndroidAlert = () => {
        Alert.alert("Fingerprint Scan", "Place your finger over the touch sensor.");
        this.scanBiometrics();
    };

    scanBiometrics = async () => {
        let result = await Expo.Fingerprint.authenticateAsync("Biometric Scan.");
        if (result.success) {
            await API.consent(this.props.key, this.props.user);
            this.dropdown.alertWithType(
                "success",
                "Bio-Authentication succeeded",
                "You have signed the paper."
            );

        } else {
            this.dropdown.alertWithType(
                "error",
                "Uh oh!",
                "Bio-Authentication failed or canceled."
            );
        }
    };

    render() {
        return (
            <View>
                <View style={ Styles.Container }>
                    <View style = { Styles.BottomButton }>
                        <Button raised primary text="Sign paper" onPress={ this.state.compatible ? this.checkForBiometrics : this.showIncompatibleAlert } />
                    </View>
                    <DropdownAlert ref={ ref => (this.dropdown = ref) } closeInterval={ 5000 } />
                </View>
            </View>
        );
    }
}

export { Biometric }