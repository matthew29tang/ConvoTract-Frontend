import React from "react";
import CodePin from "react-native-pin-code";

import { API } from '../util/API';

class Pin extends React.Component {
    constructor(props) {
        super(props);
        this.error = false;
    }

    _displayPin = () => {
        console.log(this.props);
        this.props.viewChange(Enums.Views.Pin);
    }
    
    render() {
        return (
            <CodePin
                code={4} // code.length is used if you not pass number prop
                checkPinCode={async (code, callback) => {
                    let result = await API.enterPin(code);
                    if (result.key != null){
                        setTimeout(() => {
                            this.setState({
                                pin: code,
                                key: result.key,
                                contract: result.contract
                            })
                        }, 50)
                        this.error = false;
                        return result.valid;
                    }
                    else{
                        this.ref.clean();
                    } 
                    if (!this.error)
                        <Text> Invalid Code </Text>
                }}
                success={ () => this.props.success(this.state.pin, this.state.key, this.state.contract, 2) } // If user fill "2018", success is called
                text="Unique PIN Code" // My title
                error="Invalid PIN" // If user fail (fill "2017" for instance)
                autoFocusFirst={ true } // disabling auto-focus
                keyboardType="numeric"
            />
        )
    }
}

export { Pin }