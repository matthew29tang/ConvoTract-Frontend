import React from "react";
import CodePin from "react-native-pin-code";

class Pin extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <CodePin
                code="2018" // code.length is used if you not pass number prop
                success={ () => console.log("hurray!") } // If user fill "2018", success is called
                text="A simple Pin code component" // My title
                error="You fail" // If user fail (fill "2017" for instance)
                autoFocusFirst={ false } // disabling auto-focus
                keyboardType="numeric"
            />
        )
    }
}