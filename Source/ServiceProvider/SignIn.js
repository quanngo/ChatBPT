import React from 'react';
import { StyleSheet, Text, View, Vibration, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { COLOR_PINK, COLOR_PINK_LIGHT, COLOR_PINK_HEAVY } from '../myColor'
import { RegisterToken, GetUsersByUserName, GetSingleProviderService } from '../../APIs/APIclass'

export default class Provider extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }
  updateValue(text, field) {
    this.setState({ [field]: text, });
  }
  submit() {
    if (this.state.username == '' || this.state.password == '') {
      alert('Xin hãy nhập đầy đủ :D');
    } else {
      RegisterToken(this.state.username, this.state.password)
        .then(res => {
          if (res.toString() !== "false") {
            let obj = JSON.parse(res);
            let rol = new String(obj.role);
            let token = new String(obj.token)

            let count = 0;
            let Role = rol.split(",");
            for (let item of Role) {
              if (item === "ServiceProvider") {

                // Hàm lấy UserID
                GetUsersByUserName(this.state.username, token)
                  .then(response => {
                    if (response.toString() !== "false") {
                      let user = JSON.parse(response);
                      userID = new String(user.id);
                      nameInfo = new String(user.nameInfo);
                      this.props.navigation.navigate('BuildingProvider', {
                        Username: this.state.username,
                        Password: this.state.password,
                        Token: token,
                        UserID: userID,
                        NameInfo: nameInfo,
                        Role: "ServiceProvider",
                      });
                    }
                  });
              } else {
                count += 1;
              }
            }
            if (count === Role.length) {
              alert('You are NOT a Service Provider');
            }
          } else {
            alert('Sign in Fail!!! Please try again');
          }
        });
    }

    //
    // Không đồng cấp nên dữ liệu không thấy!!!
    //
    // GetUsersByUserName(this.state.username, token)
    //   .then(res => {
    //     if (res.toString() !== "false") {
    //       let obj = JSON.parse(res);
    //       userID = new String(obj.id);
    //     }
    //   });

  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.up}>
            <Text style={styles.title}>
              Service Provider
            </Text>
          </View>
          <View style={styles.down}>
            <View style={styles.textInputContainer}>
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
            </TouchableOpacity>
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
