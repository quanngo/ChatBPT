import React from 'react';
import { Button, View, Text } from 'react-native';

export default class FeedbackReply extends React.Component {
  render() {
    const { navigation } = this.props;
    const Username = navigation.getParam('Username');
    const Password = navigation.getParam('Password');
    const Role = navigation.getParam('Role');
    const Token = navigation.getParam('Token');
    const UserID = navigation.getParam('UserID');
    const BuildingID = navigation.getParam('BuildingID');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>Username: {JSON.stringify(Username)}</Text>
        <Text>Password: {JSON.stringify(Password)}</Text>
        <Text>Role: {JSON.stringify(Role)}</Text>
        <Text>Token: {JSON.stringify(Token)}</Text>
        <Text>UserID: {JSON.stringify(UserID)}</Text>
        <Text>BuildingID: {JSON.stringify(BuildingID)}</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}