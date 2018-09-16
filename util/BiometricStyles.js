import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#FFFFFF",
    },
    Button: {
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 60,
        backgroundColor: "transparent",
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: "#fff",
    },
    ButtonText: {
        fontSize: 30,
        color: "#fff",
        textShadowColor: "rgba(0,0,0,0.30)",
        textShadowOffset: { 
            width: 0, 
            height: 1 
        },
        textShadowRadius: 2,
    },
    Logo: {
        height: 128,
        width: 128,
    },
    Bottombutton: {
        paddingTop: 330,
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
    },
    Box: {
        width: 250
    }
});

export { Styles }