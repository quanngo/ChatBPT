import React from 'react';
import { StyleSheet, Image, Button, Text, View, Vibration, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { UpdateUserInfo, UpdateResident } from '../../../APIs/APIclass';

export default class EditPost extends React.Component {
  static navigationOptions = {
    title: 'Chỉnh sửa thông tin tài khoản',
  }

  constructor() {
    super();
    this.state = {
      filePath: {},
      NameInfo: '',
      PhoneNumber: '',
      Email: '',
      Avatar: '',
    }
  }
  updateValue(text, field) {
    this.setState({ [field]: text, });
  }
  chooseFile = () => {
    var options = {
      title: 'Chọn hình ảnh',
      base64: true,
      quality: 0.4,
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
        });
        this.setState({
          Avatar: this.state.filePath.data
        });
      }
    });
  };

  componentDidMount() {
    const { navigation } = this.props;
    const NameInfo = navigation.getParam('NameInfo');
    const PhoneNumber = navigation.getParam('PhoneNumber');
    //const Avatar = navigation.getParam('Avatar');

    this.setState({
      NameInfo: NameInfo,
      PhoneNumber: PhoneNumber,
      //Avatar: Avatar,
    });
  }

  submit() {
    if (this.state.NameInfo.trim() == '' || this.state.PhoneNumber.trim() == '') {
      alert('Vui lòng điền đầy đủ thông tin :)');
    } else {
      const { navigation } = this.props;
      const UserID = navigation.getParam('UserID');
      const Token = navigation.getParam('Token');
      //const ApartmentCode = navigation.getParam('ApartmentCode');
      const Email = navigation.getParam('Email');

      UpdateUserInfo(UserID, Email, this.state.PhoneNumber, this.state.NameInfo, Token)
        .then(response => {
          if (response.toString() == "true") {
            alert("Cập nhật thành công!");
            this.props.navigation.goBack();
          } else {
            alert("Đã xảy ra lỗi xin nhập lại!")
          }
        })
        .catch((error) => {
          //this.setState({ data: [] });
          alert("Đã xảy ra lỗi mạng!")
        });
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* <View style={{ flexDirection: 'row', }}>
            <Image
              source={{
                uri: 'data:image/jpeg;base64,' + this.state.Avatar,
              }}
              style={{ width: 250, height: 250 }}
            />

            <TouchableOpacity style={styles.btnAvatar}
              onPress={this.chooseFile.bind(this)}>
              <Text style={{ color:'black', textAlign: 'center' }}>Chọn hình</Text>
            </TouchableOpacity>
          </View> */}

          <Text>
            Họ và tên:
          </Text>
          <View style={styles.textInputContainer}>
            <TextInput style={styles.textInput}
              onChangeText={(text) => this.updateValue(text, 'NameInfo')}
              value={this.state.NameInfo.toString()}>
            </TextInput>
          </View>
          <Text>
            Số điện thoại:
                </Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.updateValue(text, 'PhoneNumber')}
              value={this.state.PhoneNumber.toString()}>
            </TextInput>
          </View>

          <TouchableOpacity style={styles.btnUpdate}
            onPress={() => this.submit()}>
            <TextInput
              style={styles.udpateText} editable={false}>
              Cập nhật
              </TextInput>
          </TouchableOpacity>

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
    //alignItems: 'stretch',
    //backgroundColor: COLOR_PINK
  },
  title: {
    color: 'orange',
    textAlign: 'center',
    width: 330,
    fontSize: 23
  },
  textInputContainer: {
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6
    //backgroundColor: COLOR_PINK_LIGHT
  },
  textInput: {
    fontSize: 18,
    width: 400,
    height: 45
  },
  btnUpdate: {
    justifyContent: 'center',

    marginTop: 25,
    width: 260,
    height: 45,
    borderRadius: 6,
    backgroundColor: 'black'
  },
  udpateText: {
    fontSize: 18,
    color: 'white'
  },
  btnAvatar: {
    justifyContent: 'center',
    left: 25,
    marginTop: 100,
    width: 100,
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'cyan'
  },
});
