import React, { Component } from 'react';
import { TouchableOpacity, Dimensions, Image, Button, ScrollView, View, Text, TextInput, StyleSheet } from 'react-native'
import MultiSelect from 'react-native-multiple-select';
import { AddPrivateChatGroupWithListMember, GetInfoResident, AddChatGroup, GetImageResidentbyUserID, AddGrMember, GetInfoUserbyUserId } from '../../../APIs/APIclass';
import ImagePicker from 'react-native-image-picker';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class CreatChat extends Component {
  static navigationOptions = {
    title: 'Tạo phòng Chat',
  }
  constructor(props) {
    super(props);
    this.state = ({
      filePath: {},
      modalVisible: false,
      refreshing: false,
      selectedItems: [],
      data: [],
      Title: '',
      content: '',
      room: '',
      search: '',
      adminBuildingID: '',
    });
  }
  updateValue(text, field) {
    this.setState({ [field]: text, });
  }
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  }

  componentDidMount() {
    this.refreshDataFromServer();
  }

  refreshDataFromServer = () => {
    const { navigation } = this.props;
    const Token = navigation.getParam('Token');
    const BuildingID = navigation.getParam('BuildingID');
    GetInfoResident(BuildingID, Token)
      .then(res => {
        let resident = JSON.parse(res);
        this.setState({ data: resident });

      })
      .catch((error) => {
        //this.setState({ data: [] });
      });
  }

  chooseFile = () => {
    var options = {
      title: 'Chọn hình',
      base64: true,
      quality: 0.5,
      // customButtons: [
      //   { name: 'C', title: 'Chọn hình ảnh' },
      // ],
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'images',
      // },
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
      }
    });
  };

  submit() {
    if (this.state.Title.trim() == '' || this.state.filePath == {}) {
      alert('Vui lòng điền đầy đủ');
    } else {
      const { navigation } = this.props;
      const UserID = navigation.getParam('UserID');
      const BuildingID = navigation.getParam('BuildingID');
      //alert(this.state.selectedItems.toString())

      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
      var Datetime = date + " " + time;

      let PickCode = new String(Datetime + UserID)
      let membs = UserID + "," + this.state.selectedItems.toString();

      AddPrivateChatGroupWithListMember(this.state.Title, 2, UserID, this.state.filePath.data, 1, BuildingID, "", 1, PickCode, membs)
        .then(res => {
          if (res.toString() !== "false") {
            this.props.navigation.goBack();
          } else {
            alert("Đã xảy ra lỗi, vui lòng nhập lại!")
          }
        })
        .catch((error) => {
          //this.setState({ data: [] });
          alert("Đã xảy ra lỗi mạng!")
        });
    }
  }

  render() {
    const { selectedItems } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        <Text>
          Tên nhóm :
          </Text>
        <View style={styles.textInputContainer}>
          <TextInput style={styles.textInput}
            placeholder="Nhập tên..."
            onChangeText={(text) => this.updateValue(text, 'Title')}>
          </TextInput>
        </View>
        <MultiSelect
          hideTags
          items={this.state.data}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Tìm cư dân..."
          searchInputPlaceholderText="Nhập tên cư dân..."
          onChangeInput={(text) => console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="nameInfo"
          searchInputStyle={{ color: '#CCC' }}
        // submitButtonColor="#48d22b"
        // submitButtonText="Tìm"
        />
        <View style={{ alignItems: 'center', }}>
          <Image
            source={{ uri: this.state.filePath.uri }}
            style={{ width: WIDTH * 0.9, height: WIDTH * 0.9 }}
          />
        </View>

        <View style={{ marginTop: 12, }}>
          <Button
            title="Chọn hình" onPress={this.chooseFile.bind(this)} />
        </View>

        <TouchableOpacity style={styles.btnSubmit}
          onPress={() => this.submit()}>
          <TextInput
            style={styles.submitText} editable={false}>
            Tạo phòng chat
          </TextInput>
        </TouchableOpacity>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  textInputContainer: {
    // paddingHorizontal: 10,
    // borderRadius: 6,
    // marginTop: 20,
    // borderWidth: 1,
    // borderColor: 'black',
    // borderRadius: 6
    //backgroundColor: COLOR_PINK_LIGHT
  },
  textInput: {
    // width: WIDTH,
    // height: 45

  },
  submitText: {
    fontSize: 18,
    color: 'white'
  },
  btnSubmit: {
    marginTop: 25,
    left: WIDTH * 0.25,
    width: WIDTH * 0.5,
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'red'
  },
})