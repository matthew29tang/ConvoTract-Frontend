import React, { Component } from 'react';
import { TextField } from 'react-native-material-textfield';

class Example extends Component {
  state = {
    phone: '',
  };

  render() {
    let { phone } = this.state;

    return (
      <TextField
        label='Phone number'
        value={phone}
        onChangeText={ (phone) => this.setState({ phone }) }
      />
    );
  }
}