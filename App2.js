import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Font, AppLoading } from 'expo';
import { Button } from 'react-native-material-ui';

export default class App extends React.Component {
  state = {
    fontsAreLoaded: false,
  };
  
  async componentWillMount() {
    await Font.loadAsync({
        
        'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
        'roboto-black': require('./assets/fonts/Roboto-Regular.ttf'),
        'roboto-blackitalic': require('./assets/fonts/Roboto-BlackItalic.ttf'),
        'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'roboto-bolditalic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
        'roboto-italic': require('./assets/fonts/Roboto-Italic.ttf'),
        'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
        'roboto-lightitalic': require('./assets/fonts/Roboto-LightItalic.ttf'),
        'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'roboto-mediumitalic': require('./assets/fonts/Roboto-MediumItalic.ttf'),
        'roboto': require('./assets/fonts/Roboto-Regular.ttf'),
        'roboto-thin': require('./assets/fonts/Roboto-Thin.ttf'),
        'roboto-thinitalic': require('./assets/fonts/Roboto-ThinItalic.ttf')
      
    });
    this.setState({ fontsAreLoaded: true });
  }
  
  render() {
    if (!this.state.fontsAreLoaded) {
      return <AppLoading />;
    }
    return (
        <View style={styles.container}>
          <Text>ConvoTract</Text>
          
          
        
      <Button raised primary text="Primary"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
