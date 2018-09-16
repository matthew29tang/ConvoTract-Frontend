import React from "react";
import { Text, View } from "react-native";
import { Styles } from "../util/Styles";
import { Biometric } from "./Biometric";

class Contract extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <View style={ Styles.Banner }>
                    <Toolbar leftElement="" centerElement="ConvoTract" />
                </View>
                <View style = { Styles.Contract }>
                    <Text>
                        { this.props.contract }
                    </Text>
                </View>
                <Biometric />
            </View>
        )
    }
}

export { Contract }