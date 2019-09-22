import React from 'react';
import { StyleSheet, Text, View, Vibration, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { COLOR_PINK, COLOR_PINK_LIGHT, COLOR_PINK_HEAVY } from './myColor'
import { RegisterToken, GetUsersByUserName, GetSingleProviderService } from '../APIs/APIclass'

export default class SignIn extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      role: []
    }
  }
  updateValue(text, field) {
    this.setState({ [field]: text, });
  }
  componentDidMount = async () => {
    try {
      const username = await AsyncStorage.getItem('Username');
      const password = await AsyncStorage.getItem('Password');
      if (username !== null || password !== null) {
        this.SignIn(username, password)
      }
    } catch (e) {
      // error reading value
    }
  }

  SignIn(username, password) {
    RegisterToken(username, password)
      .then(res => {
        if (res.toString() !== "false") {
          let obj = JSON.parse(res);
          let rol = new String(obj.role);
          let token = new String(obj.token)

          let count = 0;
          let Role = rol.split(",");
          for (let item of Role) {
            if (item === "Resident") {
              this.state.role.push(item)
            }
            else if (item === "ServiceProvider") {
              this.state.role.push(item)
            } else {
              count += 1;
            }
          }
  
          // Nếu chỉ có 1 role
          if (Role.length == 1) {
            let sRole = new String(Role);
            if (sRole == "Resident") {
              this.Navigate(username, password, token, sRole, sRole + 'Building', rol);
            }
            if (sRole == "ServiceProvider") {
              this.Navigate(username, password, token, sRole, sRole + 'Building', rol);
            }
          }

          else if (count === Role.length) {
            alert('Bạn không có quyền đăng nhập!');
          }
          else {
            this.Navigate(username, password, token, this.state.role, 'RoleScreen', rol);
          }
        } else {
          //alert('Đăng nhập thất bại :(. Xin vui lòng thử lại!');
        }
      });
  }

  Navigate(username, password, token, role, screen, rol) {
    GetUsersByUserName(username, token)
      .then(response => {
        if (response.toString() !== "false") {
          let user = JSON.parse(response);
          userID = new String(user.id);
          nameInfo = new String(user.nameInfo);

          // GetSingleProviderService(userID)
          //   .then(res => {
          //     if (res.toString() !== "false") {
          //       let sp = JSON.parse(res);
          //       spName = new String(sp.serviceName);
          //       spDescription = new String(sp.description);
          //       spImage = new String(sp.image);

          //       this._storeData(username, password, token, rol, spName, spDescription, spImage);

          //       this.props.navigation.navigate(screen, {
          //         Username: username,
          //         Password: password,
          //         Token: token,
          //         UserID: userID,
          //         NameInfo: nameInfo,
          //         Role: role,
          //         NameService: spName,
          //         Description: spDescription,
          //         Avatar: spImage,
          //       });
          //     }
          //   });
          //this._storeData(username, password, token, rol, spName, spDescription, spImage);
          this._storeData(username, password, token, rol);
                this.props.navigation.navigate(screen, {
                  Username: username,
                  Password: password,
                  Token: token,
                  UserID: userID,
                  NameInfo: nameInfo,
                  Role: role,
                });
        }
        this.setState({ role: [] });
      });
  }

  _storeData = async (username, password, token, role, nameservice, description, avatar) => {

    try {
      await AsyncStorage.setItem('Username', username)
      await AsyncStorage.setItem('Password', password)

    } catch (error) {
      // Error saving data
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.up}>
            <Text style={styles.title}>
              BigProTech
                        </Text>
          </View>
          <View style={styles.down}>
            {/* <View style={styles.textInputContainer}>
              <TextInput style={styles.textInput}
                placeholder="Tên đăng nhập của bạn..."
                onChangeText={(text) => this.updateValue(text, 'username')}>
              </TextInput>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Mật khẩu tài khoản..."
                onChangeText={(text) => this.updateValue(text, 'password')}
                secureTextEntry={true}>
              </TextInput>
            </View>
            <TouchableOpacity style={styles.btnSignin}
              onPress={() => this.submit()}>
              <TextInput
                style={styles.signinText} editable={false}>
                ĐĂNG NHẬP
              </TextInput>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
