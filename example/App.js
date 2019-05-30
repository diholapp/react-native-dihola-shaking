/**
 * DiHola Shaking API Example
 * https://github.com/diholapp/react-native-dihola-shaking
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View, Vibration } from 'react-native';

import { ShakingAPI } from 'react-native-dihola-shaking';

export default class App extends Component {

  state = {
    myID: Math.random().toString(36).substring(7),
    result: [],
    error: 0,
    shaken: 0,
    loading: 0
  }

  componentDidMount(){

    ShakingAPI.configure({

      API_KEY: "Get one at www.diholapp.com",
      user: this.state.myID,

      sensibility: 50,
      timingFilter: 2000,
      keepSearching: true,

      onShaking: () => this.setState({ shaken: 1, loading: 1 }),

      onSuccess: (result) => this.setState({ result, error: 0, loading: 0 }),

      onError: (error) => this.setState({ error, loading: 0 })

    }).start();

  }

  componentWillUnmount(){
    ShakingAPI.stop();
  }

  render() {
    const { myID, shaken } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to DiHola Shaking API!</Text>
        <Text style={styles.instructions}>Shake your device</Text>
        <Text style={styles.instructions}>My ID: {myID}</Text>

        { shaken === 1 && this.renderResult() }
        
      </View>
    );
  }

  renderResult(){
    const { result, error, loading } = this.state;

    var text = "No users found...";

    if(loading){
      text = "LOADING...";
    }
    else if (error) {
      text = "Something went wrong: " +  error;
    }
    else if (result.length){
      text = "Last user(s) found: " + result;
    }

    return(
      <Text style={[styles.instructions, error && styles.error]}>{text}</Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  error: {
    color: 'red'
  }
});
