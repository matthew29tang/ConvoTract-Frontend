import React from 'react';

export default class Biometric extends Component {
    state = {
        fontsAreLoaded: false,
        fontLoaded: false
      };
    
      componentWillMount() {
        (async () => {
          await Font.loadAsync({
            'cutive-mono-regular': require('./assets/fonts/CutiveMono-Regular.ttf'),
            'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
            'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
          });
          this.setState({ fontLoaded: true });
          console.log("Done loading fonts");
        })();
        this._askForPermissions();
      }
    
      _askForPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({
          haveRecordingPermissions: response.status === 'granted',
        });
      };
    
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
        const { sound, status } = await this.recording.createNewLoadedSound(
          {
            isLooping: true,
            isMuted: this.state.muted,
            volume: this.state.volume,
            rate: this.state.rate,
            shouldCorrectPitch: this.state.shouldCorrectPitch,
          },
          this._updateScreenForSoundStatus
        );
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
}