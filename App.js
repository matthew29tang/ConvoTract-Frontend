import React from "react";
import { Dimensions, Image, Text, TouchableHighlight, View } from "react-native";
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from "expo";
import { Enums } from "./util/Enums";
import { Styles } from "./util/Styles";
import { Views } from "./Views";

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

    render() {
        if(!this.state.fontLoaded) {
            return (<View style={ Styles.EmptyContainer } />);
        } else {
            const currentView = this.state.currentView;
            if(currentView === Enums.Views.Main) {
                return (<Views.Main haveRecordingPermissions={this.state.haveRecordingPermissions}></Views.Main>);
            } else if(currentView === Enums.Views.Contract) {
                return (<Views.Contract></Views.Contract>);
            } else if(currentView === Enums.Views.Pin) {
                return (<Views.Pin></Views.Pin>);
            }
        }
    }
}

export default App;