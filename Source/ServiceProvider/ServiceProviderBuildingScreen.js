import React from 'react';
import { Picker, Modal, Alert, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity } from 'react-native';
import { ListAllBuildingbyProviderID, ListAllBuilding } from '../../APIs/APIclass';

class FlatListItem extends React.Component {
  render() {
    const { navigation } = this.props;
    const UserID = navigation.getParam('UserID');
    const Username = navigation.getParam('Username');
    const Password = navigation.getParam('Password');
    const Token = navigation.getParam('Token');
    const NameInfo = navigation.getParam('NameInfo');
    const NameService = navigation.getParam('NameService');
    const Avatar = navigation.getParam('Avatar');
    const Description = navigation.getParam('Description');

    return (
      <View style={{
        flex: 1,
        height: 50,
        backgroundColor: this.props.index % 2 == 0 ? 'green' : 'brown',
        marginTop: 20,
      }}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('HomepageSPdrawer', {
              Username: Username,
              Password: Password,
              Token: Token,
              UserID: UserID,
              NameInfo: NameInfo,
              Role: "ServiceProvider",
              BuildingID: this.props.item.id,
              NameService: NameService,
              NameInfo: NameInfo,
              Avatar: Avatar,
              Description: Description,
            })
          }>
          <Text
            style={styles.flatListItem}>{this.props.item.name}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  flatListItem: {
    color: 'white',
    padding: 10,
    fontSize: 24,
    textAlign: 'center',
  },
  btnAdd: {
    marginTop: 5,
    borderRadius: '4px',
    justifyContent: 'center',
    width: 260,
    height: 45,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  btnText: {
    fontSize: 18,
    color: 'white',
  }
});
export default class BuildingScreen extends React.Component {
  static navigationOptions = {
    title: "Nhà cung cấp dịch vụ - Tòa nhà"
  }

  constructor(props) {
    super(props);
    this.state = ({
      buildings: [],
      refreshing: false,
      modalVisible: false,
      pickers: [],
      selected: ""
    });
  }

  componentDidMount() {
    this.refreshDataFromServer();
  }
  refreshDataFromServer = () => {
    const { navigation } = this.props;
    const UserID = navigation.getParam('UserID');

    this.setState({ refreshing: true });
    ListAllBuildingbyProviderID(UserID).then(res => {
      let build = JSON.parse(res);
      this.setState({ buildings: build });
      this.setState({ refreshing: false });
    })
      .catch((error) => {
        //this.setState({ buildings: [] });
        this.setState({ refreshing: false });
      });

    ListAllBuilding().then(response => {
      let obj = JSON.parse(response);
      this.setState({ pickers: obj });
      this.setState({ refreshing: false });
    })
      .catch((error) => {
        this.setState({ pickers: [] });
      });
  }

  BuildingRegister() {
    const { navigation } = this.props;
    const UserID = navigation.getParam('UserID');
    const Username = navigation.getParam('Username');
    AddProviderRegister(UserID, Username, this.state.selected)
    .then(res => {
      if (res.toString() == "true") {
        alert("Đăng ký vào tòa nhà thành công :)");
        this.setModalVisible(!this.state.modalVisible);
      } else {
        alert("Bạn đã đăng ký vào tòa nhà này!");
      }
    })
    .catch((error) => {
      Alert("Something was wrong with your register :(");
    });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  onRefresh = () => {
    this.refreshDataFromServer();
  }
  render() {
    return (
      <View style={{ flex: 1, marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
            <Text>Hide Modal</Text>
          </TouchableOpacity>
          <Picker
            selectedValue={this.state.selected}
            style={{ height: 50, width: 200 }}
            onValueChange={(itemValue) => this.setState({ selected: itemValue })}>
            {this.state.pickers.map((i, index) => (
              <Picker.Item key={index} label={i.name} value={i.id} />
            ))}
          </Picker>

          <TouchableOpacity style={styles.btnAdd}
            onPress={() => this.BuildingRegister()}>
            <TextInput
              style={styles.btnText} editable={false}>
              Đăng ký
              </TextInput>
          </TouchableOpacity>
        </Modal>

        <TouchableOpacity style={styles.btnAdd}
          onPress={() => this.setModalVisible(true)}>
          <TextInput
            style={styles.btnText} editable={false}>
            Thêm tòa nhà mới
              </TextInput>
        </TouchableOpacity>

        <FlatList
          data={this.state.buildings}
          renderItem={({ item, index }) => {
            return (
              <FlatListItem item={item} index={index} navigation={this.props.navigation}>

              </FlatListItem>);
          }}
          keyExtractor={(item, index) => item.name}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
        />
      </View>
    );
  }
}
