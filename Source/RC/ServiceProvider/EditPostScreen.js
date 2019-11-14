import React from 'react';
import { StyleSheet, Image, Button, Text, View, Vibration, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { UpdateProviderPost } from '../../../APIs/APIclass';

export default class EditPost extends React.Component {
  // static navigationOptions = {
  //   header: null,
  // }

  constructor() {
    super();
    this.state = {
      filePath: {},
      Title: '',
      Description: '',
      Status: '',
      Price: '',
      Image: ''
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
          Image: this.state.filePath.data
        });
      }
    });
  };

  componentDidMount() {
    const { navigation } = this.props;
    const Title = navigation.getParam('Title');
    const Description = navigation.getParam('Description');
    const Status = navigation.getParam('Status');
    const Price = navigation.getParam('Price');
    const Image = navigation.getParam('Image');

    this.setState({ 
      Title: Title, 
      Description: Description, 
      Status: Status, 
      Price: Price,
      Image: Image, 
    });
  }

  submit() {
    if (this.state.Title.trim() == '' || this.state.Description.trim() == '') {
      alert('Vui lòng điền đầy đủ thông tin :)');
    } else {
      const { navigation } = this.props;
      const UserID = navigation.getParam('UserID');
      const BuildingID = navigation.getParam('BuildingID');
      const Token = navigation.getParam('Token');
      const PostID = navigation.getParam('PostID');

      if( this.state.filePath = {} ) {
        UpdateProviderPost(PostID, this.state.Title, this.state.Description, this.state.Image, this.state.Status, UserID, this.state.Price, BuildingID, Token)
        .then(res => {
          if (res.toString() !== "false") {
            alert("Cập nhật thành công!");
            this.props.navigation.goBack();
          }else{
            alert("Đã xảy ra lỗi xin nhập lại!")
          }
        })
        .catch((error) => {
          //this.setState({ data: [] });
          alert("Đã xảy ra lỗi mạng!")
        });
      }else{
        UpdateProviderPost(PostID, this.state.Title, this.state.Description, this.state.filePath.data, 1, UserID, this.state.Price, BuildingID, Token)
        .then(res => {
          if (res.toString() !== "false") {
            alert("Cập nhật thành công!");
            this.props.navigation.goBack();
          }else{
            alert("Đã xảy ra lỗi xin nhập lại!")
          }
        })
        .catch((error) => {
          //this.setState({ data: [] });
          alert("Đã xảy ra lỗi mạng!")
        });
      }
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          {/* <Image 
          source={{ uri: this.state.filePath.path}}
          style={{width: 100, height: 100}} />
          <Image
            source={{ uri: this.state.filePath.uri }}
            style={{ width: 250, height: 250 }}
          /> */}

          <Text>
            Tiêu đề:
          </Text>
          <View style={styles.textInputContainer}>
            <TextInput style={styles.textInput}
              placeholder="Nhập tên bài đăng..."
              onChangeText={(text) => this.updateValue(text, 'Title')}
              value={this.state.Title}>
            </TextInput>
          </View>
          <Text>
            Miêu tả:
                </Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập nội dung..."
              onChangeText={(text) => this.updateValue(text, 'Description')}
              value={this.state.Description}>
            </TextInput>
          </View>
          <Text>
            Giá:
                </Text>
          <View style={styles.textInputContainer}>
            <TextInput style={styles.textInput}
              placeholder="Nhập giá..."
              onChangeText={(text) => this.updateValue(text, 'Price')}
              value={this.state.Price}>
            </TextInput>
          </View>

          <Image
            source={{
              uri: 'data:image/jpeg;base64,' + this.state.Image,
            }}
            style={{ width: 250, height: 250 }}
          />
          <Button title="Chọn hình" onPress={this.chooseFile.bind(this)} />

          <TouchableOpacity style={styles.btnUpdate}
            onPress={() => this.submit()}>
            <TextInput
              style={styles.updateText} editable={false}>
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
    width: 400,
    height: 45
  },
  btnUpdate: {
    marginTop: 25,
    width: 260,
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'black'
  },
  updateText: {
    fontSize: 18,
    color: 'white'
  }
});
