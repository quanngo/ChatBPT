import React from 'react';
import { StyleSheet, Text, View, Vibration, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { COLOR_BLUE_LIGHT, COLOR_PINK, COLOR_PINK_LIGHT, COLOR_PINK_HEAVY } from './myColor'
import { GetSingleBuildingbySuperviorID, LoginTokenGetInfo, RegisterToken, GetSingleResidentbyId, GetSingleProviderService } from '../APIs/APIclass'

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
    LoginTokenGetInfo(username, password)
      .then(res => {
        if (res.toString() !== "false") {
          let obj = JSON.parse(res);
          let rol = new String(obj.role);
          let token = new String(obj.token);
          let userid = new String(obj.info.id);
          let usernameInfo= new String(obj.info.nameInfo);

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
              this.NavigateResident(username, password, userid, usernameInfo, token, sRole, sRole + 'Building', 0);
            }
            if (sRole == "ServiceProvider") {
              this.NavigateSP(username, password, userid, usernameInfo, token, sRole, sRole + 'Building', 0);
            }
            if (sRole == "BuildingAdministrator") {
              this.NavigateBA(username, password, userid, usernameInfo, token, sRole, sRole + 'Building', 0);
            }
            //if (sRole == "Supervisor") {
            if (sRole == "supervior") {
              this.Navigate_SV(username, password, userid, usernameInfo, token, sRole, 'HomepageSVdrawer', 0);
            }
          }

          else if (count === Role.length) {
            alert('Bạn không có quyền đăng nhập!');
          }
          else {
            this.NavigateSP(username, password, userid, usernameInfo, token, this.state.role, 'RoleScreen', 1);
          }
        } else {
          AsyncStorage.clear();
          alert('Đăng nhập thất bại :(. Xin vui lòng thử lại!');
        }
      });
  }
  NavigateResident(username, password, userID, usernameInfo, token, role, screen, IsRoles) {
    GetSingleResidentbyId(userID)
      .then(response => {
        if (response.toString() !== "false") {
          //let re = JSON.parse(response);
          //reImage = new String(re.image);

          this._storeData(username, password);

          this.props.navigation.navigate(screen, {
            Username: username,
            Password: password,
            Token: token,
            UserID: userID,
            NameInfo: usernameInfo,
            Role: role,
            IsRoles: IsRoles,
          });
        }
      });
    this.setState({ role: [] });
  }
  NavigateSP(username, password, userID, usernameInfo, token, role, screen, IsRoles) {
    GetSingleProviderService(userID)
      .then(res => {
        if (res.toString() !== "false") {
          let sp = JSON.parse(res);
          spName = new String(sp.serviceName);
          spDescription = new String(sp.description);

          this._storeData(username, password);

          this.props.navigation.navigate(screen, {
            Username: username,
            Password: password,
            Token: token,
            UserID: userID,
            NameInfo: usernameInfo,
            Role: role,
            NameService: spName,
            Description: spDescription,
            IsRoles: IsRoles,
          });
        }
      });
    this.setState({ role: [] });
  }
  NavigateBA(username, password, userID, usernameInfo, token, role, screen, IsRoles) {
    this._storeData(username, password);
    
    this.props.navigation.navigate(screen, {
      Username: username,
      Password: password,
      Token: token,
      UserID: userID,
      NameInfo: usernameInfo,
      Role: role,
      IsRoles: IsRoles,
    });
    this.setState({ role: [] });
  }
  Navigate_SV(username, password, userID, usernameInfo, token, role, screen, IsRoles) {
    GetSingleBuildingbySuperviorID(userID)
      .then(res => {
        if (res.toString() !== "false") {
          let sv = JSON.parse(res);
          svBuildingID = new String(sv.superviorBuildingID);

          this._storeData(username, password);

          this.props.navigation.navigate(screen, {
            Username: username,
            Password: password,
            Token: token,
            UserID: userID,
            NameInfo: usernameInfo,
            Role: role,
            IsRoles: IsRoles,
            BuildingID: svBuildingID,
          });
        }
      });
    this.setState({ role: [] });
  }
  _storeData = async (username, password) => {

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
    backgroundColor: COLOR_BLUE_LIGHT
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
