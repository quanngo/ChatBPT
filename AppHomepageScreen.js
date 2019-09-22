import React from 'react';
import { StyleSheet, Text, View, Vibration, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { COLOR_PINK, COLOR_PINK_LIGHT, COLOR_PINK_HEAVY } from './Source/myColor'

export default class AppHomepageScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.up}>
            <Text style={styles.title}>
              Residential Communication Chat
            </Text>
          </View>
          <View style={styles.down}>
            <TouchableOpacity style={styles.btnSignin}
              onPress={() => this.props.navigation.navigate('SignInResident')}>
              <TextInput
                style={styles.signinText} editable={false}>
                Resident
              </TextInput>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSignin}
              onPress={() => this.props.navigation.navigate('SignInProvider')}>
              <TextInput
                style={styles.signinText} editable={false}>
                Service Provider
              </TextInput>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: COLOR_PINK
  },
  up: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  down: {
    flex: 7,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    color: 'orange',
    textAlign: 'center',
    width: 400,
    fontSize: 23
  },
  textInputContainer: {
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 20,
    backgroundColor: COLOR_PINK_LIGHT
  },
  textInput: {
    width: 280,
    height: 45
  },
  btnSignin: {
    marginTop: 25,
    width: 260,
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: COLOR_PINK_HEAVY
  },
  signinText: {
    fontSize: 18,
    color: 'white'
  }
});
