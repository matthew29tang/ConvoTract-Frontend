import { Asset } from "expo";
import { Dimensions } from 'react-native';

class Icon {
    constructor(module, width, height) {
        this.module = module;
        this.width = width;
        this.height = height;
        Asset.fromModule(this.module).downloadAsync();
    }
}

const Controls = {
    ICON_RECORD_BUTTON: new Icon(require("../assets/images/record_button.png"), 70, 119),
    ICON_RECORDING: new Icon(require("../assets/images/record_icon.png"), 20, 14),
    ICON_PLAY_BUTTON: new Icon(require("../assets/images/play_button.png"), 34, 51),
    ICON_PAUSE_BUTTON: new Icon(require("../assets/images/pause_button.png"), 34, 51),
    DEVICE_WIDTH: Dimensions.get("window").width, 
    DEVICE_HEIGHT: Dimensions.get("window").height,
    BACKGROUND_COLOR: "#FFF8ED",
    LIVE_COLOR: "#FF0000",
    DISABLED_OPACITY: 0.5
}

export { Controls }