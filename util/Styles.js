import { StyleSheet } from "react-native";
import { Controls } from "./Controls";

const Styles = StyleSheet.create({
    EmptyContainer: {
        alignSelf: "stretch",
        backgroundColor: Controls.BACKGROUND_COLOR,
    },
    Container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        backgroundColor: Controls.BACKGROUND_COLOR,
        minHeight: Controls.DEVICE_HEIGHT,
        maxHeight: Controls.DEVICE_HEIGHT,
    },
    Banner: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        backgroundColor: Controls.BACKGROUND_COLOR,
    },
    NoPermissionsText: {
        textAlign: "center",
    },
    Wrapper: {

    },
    HalfScreenContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        minHeight: Controls.DEVICE_HEIGHT / 2.0,
        maxHeight: Controls.DEVICE_HEIGHT / 2.0,
    },
    RecordingContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        minHeight: Controls.ICON_RECORD_BUTTON.height,
        maxHeight: Controls.ICON_RECORD_BUTTON.height,
    },
    RecordingDataContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: Controls.ICON_RECORD_BUTTON.height,
        maxHeight: Controls.ICON_RECORD_BUTTON.height,
        minWidth: Controls.ICON_RECORD_BUTTON.width * 3.0,
        maxWidth: Controls.ICON_RECORD_BUTTON.width * 3.0,
    },
    RecordingDataRowContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: Controls.ICON_RECORDING.height,
        maxHeight: Controls.ICON_RECORDING.height,
    },
    PlaybackSlider: {
        alignSelf: "stretch",
    },
    LiveText: {
        color: Controls.LIVE_COLOR,
    },
    RecordingTimestamp: {
        paddingLeft: 20,
    },
    PlaybackTimestamp: {
        textAlign: "right",
        alignSelf: "stretch",
        paddingRight: 20,
    },
    Image: {
        backgroundColor: Controls.BACKGROUND_COLOR,
    },
    TextButton: {
        backgroundColor: Controls.BACKGROUND_COLOR,
        padding: 10,
    },
    Contract: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 70,
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        minHeight: Controls.DEVICE_HEIGHT / 2.0,
        maxHeight: Controls.DEVICE_HEIGHT / 2.0
    },
    BottomButton: {
        paddingTop: 270,
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        minHeight: Controls.DEVICE_HEIGHT / 2.0,
        maxHeight: Controls.DEVICE_HEIGHT / 2.0
    }
});

export { Styles }