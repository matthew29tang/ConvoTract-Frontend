import React from "react";
import { Dimensions, Image, Text, TouchableHighlight, View } from "react-native";
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from "expo";
import { Enums } from "./util/Enums";
import { Styles } from "./util/Styles";
import { Views } from "./Views";
import { API } from "./util/API";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            currentView: Enums.Views.Main,
            fontLoaded: false,
            haveRecordingPermissions: false
        }
    }

    componentWillMount() {
        (async () => {
            await Font.loadAsync({
                'cutive-mono-regular': require('./assets/fonts/CutiveMono-Regular.ttf'),
                'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
                'Roboto': require('./assets/fonts/Roboto-Regular.ttf')
            });
            this.setState({
                fontLoaded: true
            });
        })();
        this._askForPermissions();
    }

    _askForPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({
            haveRecordingPermissions: response.status === 'granted',
        });
    };

    _success = (pin, key, contract, user) => {

        this.setState({
            currentView: Enums.Views.Contract,
            pin: pin,
            key: key,
            user: user,
            contract: contract
        })
    }

    _finishRecording = (key, contract) => {
        this.setState({
            key, contract
        })
    }

    render() {
        if (!this.state.fontLoaded) {
            return (<View style={Styles.EmptyContainer} />);
        } else {
            const currentView = this.state.currentView;
            if (currentView === Enums.Views.Main) {
                return (<Views.Main haveRecordingPermissions={this.state.haveRecordingPermissions} finishRecording={this._finishRecording}></Views.Main>);
            } else if (currentView === Enums.Views.Contract) {
                return (<Views.Contract pin={this.state.pin} key={this.state.key} user={this.state.user ? 2 : 1} contract={this.state.contract}></Views.Contract>);
            } else if (currentView === Enums.Views.Pin) {
                return (<Views.Pin success={this._success}></Views.Pin>);
            }
        }
    }
}

export default App;