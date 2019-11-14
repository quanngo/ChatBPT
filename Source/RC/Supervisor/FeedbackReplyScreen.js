import React from 'react';
import { Dimensions, Keyboard, TouchableWithoutFeedback, Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { GetSingleFeedbackbyFeedbackId, GetUserbyUserId, AddSubFeedback, ListAllSubFeedbackbyMainFeedbackID, GetSingleSuperviorbyBuildingID, UpdateStatusFeedback } from '../../../APIs/APIclass';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class FlatListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            activeRowKey: null,
            nameInfo: '',
        });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    componentDidMount() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Token = navigation.getParam('Token');

        if (this.props.item.receiver.toString() == UserID) {
            GetUserbyUserId(UserID, Token)
                .then(response => {
                    if (response.toString() !== "false") {
                        let user = JSON.parse(response);
                        //email = new String(user.email);
                        //phone = new String(user.phoneNumber);
                        nameInfo = new String(user.nameInfo);

                        this.setState({
                            nameInfo: nameInfo,
                            //email: email,
                            //phone: phone,
                        });
                    }
                });
        } else {
            GetUserbyUserId(this.props.item.sender, Token)
                .then(response => {
                    if (response.toString() !== "false") {
                        let user = JSON.parse(response);
                        //email = new String(user.email);
                        //phone = new String(user.phoneNumber);
                        nameInfo = new String(user.nameInfo);

                        this.setState({
                            nameInfo: nameInfo,
                            //email: email,
                            //phone: phone,
                        });
                    }
                });
        }

    }

    render() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');

        if (this.props.item.receiver.toString() == UserID) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#87edff'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            //height: 100
                        }}>
                            <Text style={styles.title2}>{this.state.nameInfo}</Text>
                            <Text style={styles.content2}>{this.props.item.context}</Text>
                        </View>
                    </View>
                    <View style={{
                        height: 2,
                        backgroundColor: 'white'
                    }}>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#f4e0ff'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            //height: 100
                        }}>
                            <Text style={styles.title}>{this.state.nameInfo}</Text>
                            <Text style={styles.content}>{this.props.item.context}</Text>
                        </View>
                    </View>
                    <View style={{
                        height: 2,
                        backgroundColor: 'white'
                    }}>
                    </View>
                </View>
            )
        }
    }
}

export default class FeedbackReply extends React.Component {
    _isMounted = false;

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = ({
            refreshing: false,
            data: [],
            check: '',
            title: '',
            content: '',
            adminBuildingID: '',
            status: '',
            modalVisible: false,
        });
    }
    updateValue(text, field) {
        this.setState({ [field]: text, });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    componentDidMount() {
        this._isMounted = true;
        const { navigation } = this.props;
        const BuildingID = navigation.getParam('BuildingID');
        const MainFeedbackID = navigation.getParam('MainFeedbackID');

        this.refreshDataFromServer();
        
        GetSingleSuperviorbyBuildingID(2024)
            .then(res => {
                let user = JSON.parse(res);
                Receiver = new String(user.adminBuildingID);

                this.setState({ 
                    supervisorID: Receiver,
                 });
            })
            .catch((error) => {
            });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const MainFeedbackID = navigation.getParam('MainFeedbackID');
        const FeedbackStatus = navigation.getParam('FeedbackStatus');
        this.setState({ status: FeedbackStatus });

        this.setState({ refreshing: true });   

        GetSingleFeedbackbyFeedbackId(MainFeedbackID)
            .then(response => {
                let fb = JSON.parse(response);
                fbStt = new String(fb.statusHanding);

                this.setState({ status: fbStt });
            })
            .catch((error) => {
            });

        ListAllSubFeedbackbyMainFeedbackID(MainFeedbackID)
            .then(res => {
                let feedback = JSON.parse(res);
                this.setState({ data: feedback });

                this.setState({ refreshing: false });
            })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });

    }
    onRefresh = () => {
        this.refreshDataFromServer();
    }
    chooseFile = () => {
        var options = {
          title: 'Select Image',
          base64: true,
          quality: 0.5,
        //   customButtons: [
        //     { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        //   ],
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
          }
        });
      };
    submit() {
        if (this.state.content.trim() == '') {
            alert('Vui lòng điền nội dung');
        } else {
            const { navigation } = this.props;
            const UserID = navigation.getParam('UserID');
            const BuildingID = navigation.getParam('BuildingID');
            const NameInfo = navigation.getParam('NameInfo');
            const MainFeedbackID = navigation.getParam('MainFeedbackID');
            const Room = navigation.getParam('MainFeedbackID');

            Status = 1;
            StatusHanding = 1;

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var DatePost = date + ' ' + time;

            AddSubFeedback(this.state.content, DatePost, UserID, 'rcmq', Status, 2024, MainFeedbackID, StatusHanding)
                .then(response => {
                    if (response.toString() == "true") {
                        this.textInput.clear();
                        this.refreshDataFromServer();

                        this.setState({ content: '' });
                    } else {
                        alert('Gửi phản hồi gặp lỗi, vui lòng thử lại!')
                    }
                })
                .catch((error) => {
                    alert('Gửi phản hồi gặp lỗi, vui lòng thử lại!')
                });

        }
    }
    updateStatus(status) {
        this.setState({ status: status });

        const { navigation } = this.props;
        const MainFeedbackID = navigation.getParam('MainFeedbackID');

        UpdateStatusFeedback(MainFeedbackID, status)
            .then(response => {
                if (response.toString() == "true") {
                    this.refreshDataFromServer();
                    this.setModalVisible(!this.state.modalVisible);
                } else {
                    //alert('Có lỗi xảy ra, vui lòng thử lại!')
                    alert(response)
                }
            })
            .catch((error) => {
                alert('Có lỗi xảy ra, vui lòng thử lại!')
            });
        
    }
    render() {
        const { navigation } = this.props;
        const Title = navigation.getParam('Title');
        const Content = navigation.getParam('Content');
        const FeedbackStatus = navigation.getParam('FeedbackStatus');

        if (this.state.status == 3) {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
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
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(1)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Chờ phản hồi
                                    </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(2)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Đang xử lí
                                    </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(3)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Đã xử lí xong
                                    </TextInput>
                            </TouchableOpacity>
                        </Modal>

                        <View style={styles.up}>
                            {/* <Image style={styles.img}
                            source={{ uri: "data:image/png;base64, " + Image }} /> */}

                            <Ionicons name={"ios-arrow-round-back"}
                                size={48}
                                style={{ position: 'absolute', left: 10 }}
                                onPress={() => this.props.navigation.goBack()} />

                            {/* <Text style={styles.screenname}>{Title}</Text> */}
                            <TouchableOpacity style={{ left: WIDTH * 0.9, top: HEIGHT * 0.01 }}
                                onPress={() => {
                                    this.setModalVisible(true);
                                }}>
                                <Ionicons style={styles.btnText} name="ios-more" size={35} />
                            </TouchableOpacity>
                            <View style={{
                                //position: 'absolute',
                                marginTop: 10,
                                height: 1,
                                backgroundColor: 'pink'
                            }} />
                        </View>
                        <View style={{ backgroundColor: '#ffc73b' }}>
                            <Text style={styles.firstTitle}>{Title}</Text>
                            <Text style={styles.first}>{Content}</Text>
                        </View>
                        <View style={{
                            height: 2,
                            backgroundColor: 'white'
                        }}>
                        </View>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return (
                                    <FlatListItem item={item} index={index} navigation={this.props.navigation}>

                                    </FlatListItem>);
                            }}
                            keyExtractor={(item, index) => item.id.toString()}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                        />
                        <View style={{
                            height: 2,
                            backgroundColor: 'white'
                        }}></View>
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.btnImage}
                                onPress={this.chooseFile.bind(this)}>
                                <Image source={require('../../Images/Chat-Icons/icon-image.png')} style={styles.iconSend} />
                            </TouchableOpacity>

                            <View style={styles.inputContainer}>
                                <TextInput style={styles.inputs}
                                    multiline={false}
                                    ref={input => { this.textInput = input }}
                                    placeholder="Nhập phản hồi..."
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.updateValue(text, 'content')}>
                                </TextInput>
                            </View>

                            <TouchableOpacity style={styles.btnSend}
                                onPress={this.submit.bind(this)}>
                                <Image source={require('../../Images/Chat-Icons/send-button.png')} style={styles.iconSend} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        } else if (this.state.status == 2) {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
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
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(1)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Chờ phản hồi
                                    </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(2)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Đang xử lí
                                    </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(3)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Đã xử lí xong
                                    </TextInput>
                            </TouchableOpacity>
                        </Modal>

                        <View style={styles.up}>
                            {/* <Image style={styles.img}
                            source={{ uri: "data:image/png;base64, " + Image }} /> */}

                            <Ionicons name={"ios-arrow-round-back"}
                                size={48}
                                style={{ position: 'absolute', left: 10 }}
                                onPress={() => this.props.navigation.goBack()} />

                            {/* <Text style={styles.screenname}>{Title}</Text> */}
                            <TouchableOpacity style={{ left: WIDTH * 0.9, top: HEIGHT * 0.01 }}
                                onPress={() => {
                                    this.setModalVisible(true);
                                }}>
                                <Ionicons style={styles.btnText} name="ios-more" size={35} />
                            </TouchableOpacity>
                            <View style={{
                                //position: 'absolute',
                                marginTop: 10,
                                height: 1,
                                backgroundColor: 'pink'
                            }} />
                        </View>
                        <View style={{ backgroundColor: '#3bffb7' }}>
                            <Text style={styles.firstTitle}>{Title}</Text>
                            <Text style={styles.first}>{Content}</Text>
                        </View>
                        <View style={{
                            height: 2,
                            backgroundColor: 'white'
                        }}>
                        </View>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return (
                                    <FlatListItem item={item} index={index} navigation={this.props.navigation}>

                                    </FlatListItem>);
                            }}
                            keyExtractor={(item, index) => item.id.toString()}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                        />
                        <View style={{
                            height: 2,
                            backgroundColor: 'white'
                        }}></View>
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.btnImage}
                                onPress={this.chooseFile.bind(this)}>
                                <Image source={require('../../Images/Chat-Icons/icon-image.png')} style={styles.iconSend} />
                            </TouchableOpacity>

                            <View style={styles.inputContainer}>
                                <TextInput style={styles.inputs}
                                    multiline={false}
                                    ref={input => { this.textInput = input }}
                                    placeholder="Nhập phản hồi..."
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.updateValue(text, 'content')}>
                                </TextInput>
                            </View>

                            <TouchableOpacity style={styles.btnSend}
                                onPress={this.submit.bind(this)}>
                                <Image source={require('../../Images/Chat-Icons/send-button.png')} style={styles.iconSend} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        } else {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
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
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(1)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Chờ phản hồi
                                    </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(2)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Đang xử lí
                                    </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSignin}
                                onPress={() =>
                                    this.updateStatus(3)
                                }
                            >
                                <TextInput
                                    style={styles.signinText} editable={false}>
                                    Đã xử lí xong
                                    </TextInput>
                            </TouchableOpacity>
                        </Modal>

                        <View style={styles.up}>
                            {/* <Image style={styles.img}
                            source={{ uri: "data:image/png;base64, " + Image }} /> */}

                            <Ionicons name={"ios-arrow-round-back"}
                                size={48}
                                style={{ position: 'absolute', left: 10 }}
                                onPress={() => this.props.navigation.goBack()} />

                            {/* <Text style={styles.screenname}>{Title}</Text> */}
                            <TouchableOpacity style={{ left: WIDTH * 0.9, top: HEIGHT * 0.01 }}
                                onPress={() => {
                                    this.setModalVisible(true);
                                }}>
                                <Ionicons style={styles.btnText} name="ios-more" size={35} />
                            </TouchableOpacity>
                            <View style={{
                                //position: 'absolute',
                                marginTop: 10,
                                height: 1,
                                backgroundColor: 'pink'
                            }} />
                        </View>
                        <View style={{ backgroundColor: 'white' }}>
                            <Text style={styles.firstTitle}>{Title}</Text>
                            <Text style={styles.first}>{Content}</Text>
                        </View>
                        <View style={{
                            height: 2,
                            backgroundColor: 'white'
                        }}>
                        </View>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return (
                                    <FlatListItem item={item} index={index} navigation={this.props.navigation}>

                                    </FlatListItem>);
                            }}
                            keyExtractor={(item, index) => item.id.toString()}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                        />
                        <View style={{
                            height: 2,
                            backgroundColor: 'white'
                        }}></View>
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.btnImage}
                                onPress={this.chooseFile.bind(this)}>
                                <Image source={require('../../Images/Chat-Icons/icon-image.png')} style={styles.iconSend} />
                            </TouchableOpacity>

                            <View style={styles.inputContainer}>
                                <TextInput style={styles.inputs}
                                    multiline={false}
                                    ref={input => { this.textInput = input }}
                                    placeholder="Nhập phản hồi..."
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.updateValue(text, 'content')}>
                                </TextInput>
                            </View>

                            <TouchableOpacity style={styles.btnSend}
                                onPress={this.submit.bind(this)}>
                                <Image source={require('../../Images/Chat-Icons/send-button.png')} style={styles.iconSend} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    }
}
const styles = StyleSheet.create({
    firstTitle: {
        color: 'red',
        padding: 5,
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'left',
    },
    footer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 10,
        padding: 5,
    },
    first: {
        color: 'black',
        paddingLeft: 5,
    },
    title: {
        color: '#cf7500',
        padding: 5,
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'left',
    },
    content: {
        color: 'black',
        paddingLeft: 5,
    },
    title2: {
        color: 'blue',
        padding: 5,
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'right',
    },
    content2: {
        color: 'black',
        paddingLeft: 5,
        textAlign: 'right',
    },
    img: {
        position: 'absolute',
        marginTop: 7,
        marginLeft: 5,
        width: 25,
        height: 25
    },
    screenname: {
        position: 'absolute',
        marginTop: 7,
        marginLeft: 100,
        fontSize: 20,
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    textInput: {
        width: 280,
        height: 45
    },
    btnSubmit: {
        //marginTop: 25,
        width: 260,
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    btnSend: {
        backgroundColor: "black",
        width: 40,
        height: 40,
        borderRadius: 360,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnImage: {
        backgroundColor: "white",
        width: 40,
        height: 40,
        borderRadius: 360,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    up: {
        //flex: 0.7,
        height: 50,
    },
    down: {
        //flex: 9.3,
    },
    submitText: {
        fontSize: 18,
        color: 'blue'
    },
    btnSignin: {
        marginTop: 25,
        width: 260,
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: 'brown'
    },
    signinText: {
        color: 'white',
    },
    inputs: {
        height: 40,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    iconSend: {
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
});