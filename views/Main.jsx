import React from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import { Styles } from "../util/Styles";
import { Controls } from "../util/Controls";

class Main extends React.Component {
    constructor(props) {
        super(props);
    } 
    
    _updateScreenForSoundStatus = status => {
        if (status.isLoaded) {
            this.setState({
                soundDuration: status.durationMillis,
                soundPosition: status.positionMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                rate: status.rate,
                muted: status.isMuted,
                volume: status.volume,
                shouldCorrectPitch: status.shouldCorrectPitch,
                isPlaybackAllowed: true,
            });
        } else {
            this.setState({
                soundDuration: null,
                soundPosition: null,
                isPlaybackAllowed: false,
            });
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    };
    
    _updateScreenForRecordingStatus = status => {
        if (status.canRecord) {
            this.setState({
                isRecording: status.isRecording,
                recordingDuration: status.durationMillis,
            });
        } else if (status.isDoneRecording) {
            this.setState({
                isRecording: false,
                recordingDuration: status.durationMillis,
            });
            if (!this.state.isLoading) {
                this._stopRecordingAndEnablePlayback();
            }
        }
    };
    
    async _stopPlaybackAndBeginRecording() {
        this.setState({
            isLoading: true,
        });
        if (this.sound !== null) {
            await this.sound.unloadAsync();
            this.sound.setOnPlaybackStatusUpdate(null);
            this.sound = null;
        }
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
        if (this.recording !== null) {
            this.recording.setOnRecordingStatusUpdate(null);
            this.recording = null;
        }

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(this.recordingSettings);
        recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

        this.recording = recording;
        await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
        this.setState({
            isLoading: false,
        });
    }
    
    async _stopRecordingAndEnablePlayback() {
        this.setState({
            isLoading: true,
        });
        try {
            await this.recording.stopAndUnloadAsync();
        } catch (error) {
            // Do nothing -- we are already unloaded.
        }
        const info = await FileSystem.getInfoAsync(this.recording.getURI());
        console.log(this.recording.getURI());
        console.log(`FILE INFO: ${JSON.stringify(info)}`);

        {/* Send URI to processRecording
        let this.state.contract = await Audio.getContract()
        */}

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            playsInSilentLockedModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
        const { sound, status } = await this.recording.createNewLoadedSound({
            isLooping: true,
            isMuted: this.state.muted,
            volume: this.state.volume,
            rate: this.state.rate,
            shouldCorrectPitch: this.state.shouldCorrectPitch,
        }, this._updateScreenForSoundStatus);

        this.sound = sound;
        this.setState({
            isLoading: false,
        });
    }
    
    async _getContract() {
        try {
            let response = await fetch(address + "/processRecording", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstParam: this.recording.getURI()
                }),
            });
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    
    _onRecordPressed = () => {
        if (this.state.isRecording) {
            this._stopRecordingAndEnablePlayback();
        } else {
            this._stopPlaybackAndBeginRecording();
        }
    };
    
    _onPlayPausePressed = () => {
        if (this.sound != null) {
            if (this.state.isPlaying) {
                this.sound.pauseAsync();
            } else {
                this.sound.playAsync();
            }
        }
    };
    
    _displayPin = () => {
        this.setState({
            display: 'pin',
        });
    }

    _onStopPressed = () => {
        if (this.sound != null) {
            this.sound.stopAsync();
        }
    };
    
    _getMMSSFromMillis(millis) {
        const totalSeconds = millis / 1000;
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);

        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return '0' + string;
            }
            return string;
        };
        return padWithZero(minutes) + ':' + padWithZero(seconds);
    }
    
    _getRecordingTimestamp() {
        if (this.state.recordingDuration != null) {
            return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
        }
        return `${this._getMMSSFromMillis(0)}`;
    }

    render() {
        if(!this.props.haveRecordingPermissions) {
            return (
                <View style={Styles.Container}>
                    <View />
                    <Text style={[Styles.NoPermissionsText, { fontFamily: "cutive-mono-regular" }]}>
                        You must enable audio recording permissions in order to use this app.
                    </Text>
                    <View />
                </View>
            )
        } else {
            return (
                <View style={ Styles.Banner }>
                    <Toolbar leftElement="" centerElement="ConvoTract" />
                    <View style={ [Styles.HalfScreenContainer, { opacity: this.state.isLoading ? Controls.DISABLED_OPACITY : 1.0 }] }>
                        <View />
                    
                        <View style={ Styles.RecordingContainer }>
                            <View />
                            
                            <TouchableHighlight underlayColor={ Controls.BACKGROUND_COLOR } style={ Styles.Wrapper } onPress={ this._onRecordPressed } disabled={ this.state.isLoading }>
                                <Image style={Styles.Image} source={ Controls.ICON_RECORD_BUTTON.module } />
                            </TouchableHighlight>
                
                            <TouchableHighlight underlayColor={ Controls.BACKGROUND_COLOR } style={ Styles.Wrapper } onPress={ this._onPlayPausePressed } disabled={ !this.state.isPlaybackAllowed || this.state.isLoading }>
                                <Image style={ Styles.Image } source={ this.state.isPlaying ? Controls.ICON_PAUSE_BUTTON.module : Controls.ICON_PLAY_BUTTON.module } />
                            </TouchableHighlight>
                
                            <View style={ Styles.RecordingDataContainer }>
                                <View />
                                <Text style={ [Styles.LiveText, { fontFamily: "cutive-mono-regular" }] }>
                                    { this.state.isRecording ? "LIVE" : "" }
                                </Text>
                                <View style={ Styles.RecordingDataRowContainer }>
                                    <Image style={ [Styles.Image, { opacity: this.state.isRecording ? 1.0 : 0.0 }] } />
                                    <Text style={ [Styles.RecordingTimestamp, { fontFamily: "cutive-mono-regular" }] }>
                                        { this._getRecordingTimestamp() }
                                    </Text>
                                </View>
                                <View />
                            </View>

                            <View />
                        </View>

                        <View />
                    </View>
                    <Button raised primary text="Enter Pin" onPress={() => this._displayPin()}/>
                </View>
            )
        }
    }
}