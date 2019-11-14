import React from 'react';
import { Alert, ScrollView, Modal, StyleSheet, Image, Button, Text, View, Vibration, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ChangePassword, GetUserbyUserId, GetSingleResidentbyId } from '../../../APIs/APIclass';
import MenuButton from '../../Component/MenuButton'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

export default class information extends React.Component {
  // static navigationOptions = {
  //   header: null,
  // }

  constructor() {
    super();
    this.state = {
      nameInfo: '',
      apartmentCode: '',
      phone: '',
      email: '',
      modalVisible: false,
      activeRowKey: null,
      pw: '',
      changepw: '',
      confirmchangepw: '',
      avatar: ''
    }
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  updateValue(text, field) {
    this.setState({ [field]: text, });
  }
  componentDidMount() {
		const { navigation } = this.props;

		this.focusListener = navigation.addListener('didFocus', () => {
			this.refreshDataFromServer();
		  });
  }
  refreshDataFromServer = () => {
    const { navigation } = this.props;
    const UserID = navigation.getParam('UserID');
    const Token = navigation.getParam('Token');

    GetUserbyUserId(UserID, Token)
      .then(response => {
        if (response.toString() !== "false") {
          let user = JSON.parse(response);
          email = new String(user.email);
          phone = new String(user.phoneNumber);
          nameInfo = new String(user.nameInfo);

          GetSingleResidentbyId(UserID)
            .then(res => {
              if (res.toString() !== "false") {
                let sp = JSON.parse(res);
                avatar = new String(sp.image);
                apartmentCode = new String(sp.apartmentCode);

                this.setState({
                  nameInfo: nameInfo,
                  avatar: avatar,
                  email: email,
                  phone: phone,
                  apartmentCode: apartmentCode,
                });
              }
            });
        }
      });
	}
  changepassword() {
    const { navigation } = this.props;
    const Username = navigation.getParam('Username');
    const Password = navigation.getParam('Password');
    const Token = navigation.getParam('Token');

    if (Password == this.state.pw) {
      if (this.state.changepw.trim() !== '' || this.state.confirmchangepw.trim() !== '') {
        if (this.state.changepw == this.state.confirmchangepw) {
          Alert.alert(
            'Đổi mật khẩu',
            'Bạn có muốn đổi mật khẩu tài khoản?',
            [
              { text: 'Hủy', onPress: () => { return null } },
              {
                text: 'Xác nhận', onPress: () => {
                  ChangePassword(Username, Password, this.state.changepw, Token)
                    .then(response => {
                      if (response.toString() == "true") {
                        AsyncStorage.clear();

                        this._storeData(Username, this.state.changepw);
                        this.setModalVisible(!this.state.modalVisible);
                      }
                    });
                  this.setState({
                    changepw: '',
                    confirmchangepw: '',
                    pw: this.state.changepw,
                  });
                }
              },
            ],
            { cancelable: false }
          )
        } else {
          alert("Mật khẩu nhập lại không trùng khớp")
        }
      } else {
        alert("Vui lòng nhập đầy đủ")
      }
    } else {
      alert("Nhập sai mật khẩu cũ!")
    }
  }
  _storeData = async (username, password) => {
    try {
      await AsyncStorage.setItem('Username', username)
      await AsyncStorage.setItem('Password', password)
    } catch (error) {
      // Error saving data
    }
  }
  nav() {
    const { navigation } = this.props;
    const UserID = navigation.getParam('UserID');
    const Token = navigation.getParam('Token');

    this.props.navigation.navigate('EditInfoScreenResident', {
      Token: Token,
      UserID: UserID,
      NameInfo: this.state.nameInfo,
      PhoneNumber: this.state.phone,
      Avatar: this.state.avatar,
      Email: this.state.email,
      ApartmentCode: this.state.apartmentCode,
    })
  }
  changeRole() {
    const { navigation } = this.props;
    const UserID = navigation.getParam('UserID');
    const Username = navigation.getParam('Username');
    const Password = navigation.getParam('Password');
    const Token = navigation.getParam('Token');
    const NameInfo = navigation.getParam('NameInfo');
    const NameService = navigation.getParam('NameService');
    const Description = navigation.getParam('Description');
    const IsRoles = navigation.getParam('IsRoles');

    this.props.navigation.navigate('RoleScreen', {
      Username: Username,
      Password: Password,
      Token: Token,
      UserID: UserID,
      NameService: NameService,
      NameInfo: NameInfo,
      Description: Description,
      IsRoles: IsRoles,
    })
  }
  render() {
    const { navigation } = this.props;
    const IsRoles = navigation.getParam('IsRoles');

    if( IsRoles == 0){
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <MenuButton navigation={this.props.navigation} />
            <View style={styles.up}>
              <Text style={styles.screenname}>Thông tin tài khoản</Text>
            </View>
            <View style={{
              height: 1,
              backgroundColor: 'pink'
            }} />
            <View style={styles.containerimg}>
              <TouchableOpacity style={styles.btnEdit}
                onPress={() => this.nav()}>
                <Text style={{ textAlign: 'center' }}>Chỉnh sửa</Text>
              </TouchableOpacity>
              <View style={styles.imgView}>
                <Image style={styles.img} source={{
                  uri: 'data:image/jpeg;base64,' + avatar,
                }} />
              </View>
              <View style={styles.profileText}>
                <Text style={styles.name}>{this.state.nameInfo}</Text>
              </View>
            </View>
  
            <View style={styles.infoText}>
              <View style={{ flexDirection: 'row', }}>
                <Ionicons name="ios-mail" size={38} color="gray" />
                <Text style={styles.info}>{this.state.email}</Text>
              </View>
            </View>
            <View style={styles.infoText}>
              <View style={{ flexDirection: 'row', top: 15, left: 3 }}>
                <Ionicons name="ios-tablet-portrait" size={38} color="gray" />
                <Text style={styles.infoPhone}>{this.state.phone}</Text>
              </View>
            </View>
  
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <View style={{ marginTop: 22 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text>Quay lại</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: 'white',
                top: 100,
              }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ top: 11, textAlign: 'right', }}>Nhập mật khẩu mới:</Text>
                    <Text style={{ top: 28, textAlign: 'right', }}>Nhập lại mật khẩu mới:</Text>
                    <Text style={{ top: 42, textAlign: 'right', }}>Mật khẩu cũ:</Text>
                  </View>
  
                  <View style={{ flexDirection: 'column' }}>
                    <TextInput
                      style={styles.textInputContainer}
                      //placeholder="Mật khẩu tài khoản..."
                      onChangeText={(text) => this.updateValue(text, 'changepw')}
                      secureTextEntry={true}>
                    </TextInput>
                    <TextInput
                      style={styles.textInputContainer}
                      //placeholder="Mật khẩu tài khoản..."
                      onChangeText={(text) => this.updateValue(text, 'confirmchangepw')}
                      secureTextEntry={true}>
                    </TextInput>
                    <TextInput
                      style={styles.textInputContainer}
                      //placeholder="Mật khẩu tài khoản..."
                      onChangeText={(text) => this.updateValue(text, 'pw')}
                      secureTextEntry={true}>
                    </TextInput>
                  </View>
                </View>
  
                <TouchableOpacity style={styles.btnChange}
                  onPress={() => this.changepassword()} >
                  <TextInput style={{ color: 'white' }} editable={false}>
                    Xác nhận
                </TextInput>
                </TouchableOpacity>
              </View>
              <View style={{
                height: 2,
                backgroundColor: 'white'
              }}>
              </View>
            </Modal>
  
            <TouchableOpacity style={styles.btnPW} onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
              <TextInput style={{ color: 'white' }} editable={false}>
                Đổi mật khẩu
                </TextInput>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      );
    }else{
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <MenuButton navigation={this.props.navigation} />
            <View style={styles.up}>
              <Text style={styles.screenname}>Thông tin tài khoản</Text>
            </View>
            <View style={{
              height: 1,
              backgroundColor: 'pink'
            }} />
            <View style={styles.containerimg}>
              <TouchableOpacity style={styles.btnEdit}
                onPress={() => this.nav()}>
                <Text style={{ textAlign: 'center' }}>Chỉnh sửa</Text>
              </TouchableOpacity>
              <View style={styles.imgView}>
                <Image style={styles.img} source={{
                  uri: 'data:image/jpeg;base64,' + avatar,
                }} />
              </View>
              <View style={styles.profileText}>
                <Text style={styles.name}>{this.state.nameInfo}</Text>
              </View>
            </View>
  
            <View style={styles.infoText}>
              <View style={{ flexDirection: 'row', }}>
                <Ionicons name="ios-mail" size={38} color="gray" />
                <Text style={styles.info}>{this.state.email}</Text>
              </View>
            </View>
            <View style={styles.infoText}>
              <View style={{ flexDirection: 'row', top: 15, left: 3 }}>
                <Ionicons name="ios-tablet-portrait" size={38} color="gray" />
                <Text style={styles.infoPhone}>{this.state.phone}</Text>
              </View>
            </View>
  
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <View style={{ marginTop: 22 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text>Quay lại</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: 'white',
                top: 100,
              }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ top: 11, textAlign: 'right', }}>Nhập mật khẩu mới:</Text>
                    <Text style={{ top: 28, textAlign: 'right', }}>Nhập lại mật khẩu mới:</Text>
                    <Text style={{ top: 42, textAlign: 'right', }}>Mật khẩu cũ:</Text>
                  </View>
  
                  <View style={{ flexDirection: 'column' }}>
                    <TextInput
                      style={styles.textInputContainer}
                      //placeholder="Mật khẩu tài khoản..."
                      onChangeText={(text) => this.updateValue(text, 'changepw')}
                      secureTextEntry={true}>
                    </TextInput>
                    <TextInput
                      style={styles.textInputContainer}
                      //placeholder="Mật khẩu tài khoản..."
                      onChangeText={(text) => this.updateValue(text, 'confirmchangepw')}
                      secureTextEntry={true}>
                    </TextInput>
                    <TextInput
                      style={styles.textInputContainer}
                      //placeholder="Mật khẩu tài khoản..."
                      onChangeText={(text) => this.updateValue(text, 'pw')}
                      secureTextEntry={true}>
                    </TextInput>
                  </View>
                </View>
  
                <TouchableOpacity style={styles.btnChange}
                  onPress={() => this.changepassword()} >
                  <TextInput style={{ color: 'white' }} editable={false}>
                    Xác nhận
                </TextInput>
                </TouchableOpacity>
              </View>
              <View style={{
                height: 2,
                backgroundColor: 'white'
              }}>
              </View>
            </Modal>
  
            <TouchableOpacity style={styles.btnRole} onPress={() => this.changeRole()}>
              <TextInput style={{ color: 'white' }} editable={false}>
                Đổi vai trò
                </TextInput>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.btnPW} onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
              <TextInput style={{ color: 'white' }} editable={false}>
                Đổi mật khẩu
                </TextInput>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    
  }
}
const styles = StyleSheet.create({
  containerimg: {
    height: 300,
    backgroundColor: '#abfbff',
  },
  imgView: {
    top: 20,
    alignItems: 'center',
  },
  profileText: {
    top: 20,
    alignItems: 'center',
  },
  infoText: {
    left: 35,
    top: 30,
  },
  info: {
    top: 6,
    left: 15,
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
  },
  infoPhone: {
    top: 6,
    left: 20,
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
  },
  name: {
    fontSize: 38,
    fontWeight: "900",
    color: 'black',
    textAlign: 'left',
  },
  img: {
    height: 220,
    width: 220,
    borderRadius: 50,
  },
  screenname: {
    marginTop: 10,
    fontSize: 20,
  },
  up: {
    alignItems: 'center',
    height: 50,
  },
  down: {

  },
  btnEdit: {
    position: 'absolute',
    width: 100,
    height: 35,
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 6,
    right: 2,
    top: 2,
  },
  btnRole: {
    top: 120,
    left: 25,
    width: 100,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'blue'
  },
  btnPW: {
    top: 200,
    left: 25,
    width: 100,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'green'
  },
  btnChange: {
    top: 200,
    left: -50,
    width: 100,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'green'
  },
  textInputContainer: {
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    height: 35,
    width: 200,
    backgroundColor: 'white'
  },
});
