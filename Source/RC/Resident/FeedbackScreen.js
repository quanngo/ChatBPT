import React from 'react';
import { Dimensions, Alert, TouchableWithoutFeedback, Keyboard, Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { ListAllMainFeedbackbySenderID, AddFeedback, GetSingleSuperviorbyBuildingID, ListAllFeedbackbySenderId } from '../../../APIs/APIclass';
import { SearchBar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MenuButton from '../../Component/MenuButton'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class FlatListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            activeRowKey: null
        });
    }
    render() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const BuildingID = navigation.getParam('BuildingID');
        const NameInfo = navigation.getParam('NameInfo');
        const Token = navigation.getParam('Token');

        if (this.props.item.statusHanding == 1) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate('FeedbackReplyScreenResident', {
                            NameInfo: NameInfo,
                            UserID: UserID,
                            BuildingID: BuildingID,
                            MainFeedbackID: this.props.item.id,
                            Title: this.props.item.title,
                            Content: this.props.item.context,
                            FeedbackStatus: this.props.item.statusHanding,
                            Room: this.props.item.room,
                            Token: Token,
                        })
                    }>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#f7f7f7'
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                height: 100
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <Text style={styles.room}> Căn hộ {this.props.item.room}</Text>
                                    <Text style={styles.name}>({NameInfo})</Text>
                                    <Text style={styles.title}>{this.props.item.title}</Text>
                                </View>
    
                                <Text style={styles.flatListItem}>Trạng thái: Chờ phản hồi</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        height: 2,
                        backgroundColor: 'white'
                    }}>
                    </View>
                </View>
            )
        }else if (this.props.item.statusHanding == 2) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate('FeedbackReplyScreenResident', {
                            NameInfo: NameInfo,
                            UserID: UserID,
                            BuildingID: BuildingID,
                            MainFeedbackID: this.props.item.id,
                            Title: this.props.item.title,
                            Content: this.props.item.context,
                            FeedbackStatus: this.props.item.statusHanding,
                            Room: this.props.item.room,  
                            Token: Token,
                        })
                    }>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#3bffb7'
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                height: 100
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <Text style={styles.room}> Căn hộ {this.props.item.room}</Text>
                                    <Text style={styles.name}>({NameInfo})</Text>
                                    <Text style={styles.title}>{this.props.item.title}</Text>
                                </View>
    
                                <Text style={styles.flatListItem}>Trạng thái: Đang xử lí</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        height: 2,
                        backgroundColor: 'white'
                    }}>
                    </View>
                </View>
            )
        }else if (this.props.item.statusHanding == 3) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate('FeedbackReplyScreenResident', {
                            NameInfo: NameInfo,
                            UserID: UserID,
                            BuildingID: BuildingID,
                            MainFeedbackID: this.props.item.id,
                            Title: this.props.item.title,
                            Content: this.props.item.context,
                            FeedbackStatus: this.props.item.statusHanding,
                            Room: this.props.item.room,
                            Token: Token,
                        })
                    }>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#ffc73b'
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                height: 100
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <Text style={styles.room}> Căn hộ {this.props.item.room}</Text>
                                    <Text style={styles.name}>({NameInfo})</Text>
                                    <Text style={styles.title}>{this.props.item.title}</Text>
                                </View>
    
                                <Text style={styles.flatListItem}>Trạng thái: Đã xử lí</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
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

export default class Feedback extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            refreshing: false,
            data: [],
            title: '',
            content: '',
            room: '',
            search: '',
            superviorID: '',
        });
        this.arrayholder = [];
    }
    updateValue(text, field) {
        this.setState({ [field]: text, });
    }
    componentDidMount() {
        this._isMounted = true;
        const { navigation } = this.props;
        const BuildingID = navigation.getParam('BuildingID');

        this.focusListener = navigation.addListener('didFocus', () => {
            if (this._isMounted) {
                this.refreshDataFromServer();
            }
        });
        
        GetSingleSuperviorbyBuildingID(BuildingID)
            .then(res => {
                let user = JSON.parse(res);
                Receiver = new String(user.superviorID);

                this.setState({
                    supervisorID: Receiver,
                });
            })
            .catch((error) => {
            });

    }
    componentWillUnmount() {
        this._isMounted = false;
        this.focusListener.remove();
    }

    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const BuildingID = navigation.getParam('BuildingID');

        this.setState({ refreshing: true });
        ListAllMainFeedbackbySenderID(BuildingID, UserID).then(res => {
            let feedback = JSON.parse(res);
            this.setState({ data: feedback });

            this.arrayholder = feedback;

            this.setState({ refreshing: false });
        })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    onRefresh = () => {
        this.refreshDataFromServer();
    }
    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.title.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
    }
    submit() {
        if (this.state.title.trim() == '' || this.state.content.trim() == '' || this.state.room.trim() == '') {
            alert('Vui lòng điền đẩy đủ thông tin');
        } else {
            const { navigation } = this.props;
            const UserID = navigation.getParam('UserID');
            const BuildingID = navigation.getParam('BuildingID');
            const NameInfo = navigation.getParam('NameInfo');

            Status = 1;

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var DatePost = date + ' ' + time;

            AddFeedback(this.state.title, this.state.content, UserID, this.state.supervisorID, DatePost, Status, BuildingID, this.state.room)
                .then(response => {
                    if (response.toString() == "true") {
                        this.refreshDataFromServer();
                        this.setModalVisible(!this.state.modalVisible);
                    } else {
                        alert('Gửi phản hồi gặp lỗi, vui lòng thử lại!')
                    }
                })
                .catch((error) => {
                    alert('Gửi phản hồi gặp lỗi, vui lòng thử lại!')
                });

        }
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, paddingBottom: 98, }}>
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
                        <View style={styles.textInputContainer}>
                            <TextInput style={styles.textInput}
                                placeholder="Vui lòng nhập tiêu đề..."
                                onChangeText={(text) => this.updateValue(text, 'title')}>
                            </TextInput>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Vui lòng nhập nội dung..."
                                onChangeText={(text) => this.updateValue(text, 'content')}>
                            </TextInput>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Vui lòng nhập căn hộ..."
                                onChangeText={(text) => this.updateValue(text, 'room')}>
                            </TextInput>
                        </View>
                        <TouchableOpacity style={styles.btnSend}
                            onPress={() => this.submit()}>
                            <TextInput
                                style={styles.signinText} editable={false}>
                                Gửi
                            </TextInput>
                        </TouchableOpacity>
                    </Modal>

                    <MenuButton navigation={this.props.navigation} />
                    <View style={styles.up}>
                        <Text style={styles.screenname}>Phản hồi</Text>
                        <TouchableOpacity style={{left: WIDTH * 0.9, top: HEIGHT * 0.01}}
                            onPress={() => {
                                this.setModalVisible(true);
                            }}>
                            <Ionicons style={styles.btnText} name="ios-add-circle" size={35} />
                        </TouchableOpacity>
                        {/* <View style={{
                            //position: 'absolute',
                            marginTop: 49,
                            height: 1,
                            backgroundColor: 'pink'
                        }} /> */}
                    </View>
                    <View style={styles.down}>
                        <SearchBar
                            placeholder="Tìm kiếm..."
                            lightTheme
                            round
                            onChangeText={text => this.searchFilterFunction(text)}
                            autoCorrect={false}
                            value={this.state.value}
                            containerStyle={{
                                //left: WIDTH * 0.1,
                                height: 45,
                                //width: WIDTH * 0.9,
                                backgroundColor: 'white',
                            }}
                            inputContainerStyle={{
                                height: 30,
                            }}
                        />
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return (
                                    <FlatListItem item={item} index={index} navigation={this.props.navigation} parentFlatList={this}>

                                    </FlatListItem>);
                            }}
                            keyExtractor={(item, index) => String(index)}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                        />
                    </View>
                </View>

                {/* <Text>Đang trong quá trình nâng cấp</Text> */}
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
    title: {
        color: '#ffa6a6',
        padding: 5,
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'left',
    },
    room: {
        color: 'blue',
        padding: 5,
        paddingLeft: 5,
        //fontStyle: "italic",
        fontSize: 16,
        textAlign: 'left',
    },
    name: {
        color: 'black',
        top: 5,
        //paddingLeft: 5,
        //fontStyle: "italic",
        fontSize: 16,
        textAlign: 'left',
    },
    flatListItem: {
        color: 'black',
        marginTop: 16,
        padding: 2,
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'left',
    },
    textInputContainer: {
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 16,
        backgroundColor: 'white'
    },
    textInput: {
        width: 280,
        height: 45,
        borderRadius: 2,
        borderWidth: 1,
    },
    btnSend: {
        marginTop: 5,
        left: WIDTH * 0.25,
        width: WIDTH * 0.5,
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: 'pink'
    },
    screenname: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: WIDTH * 0.2,
        fontSize: 20,
    },
    mess: {
        color: 'black',
        marginTop: 15,
        padding: 2,
        fontSize: 16,
        textAlign: 'left',
    },
    datetime: {
        color: '#96a0b0',
        marginTop: 15,
        padding: 2,
        fontSize: 12,
        textAlign: 'right',
    },
    textInputContainer: {
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 20,
        backgroundColor: 'white'
    },
    textInput: {
        width: 280,
        height: 45
    },
    btnCreate: {
        position: 'absolute',
        marginTop: 7,
        marginLeft: 350,
        width: 35,
        height: 50,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    btnEdit: {
        color: 'blue',
        marginTop: 2,
        marginLeft: 120,
        width: 100,
        height: 35,
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: 'white',
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 6,

        //paddingHorizontal: 10,
    },
    btnDelete: {
        color: 'red',
        marginTop: 2,
        marginLeft: 10,
        width: 100,
        height: 35,
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: 'white',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 6,

        //paddingHorizontal: 10,
    },
    up: {
        //flex: 0.7,
        height: 50,
    },
    down: {
        //flex: 9.3,
    },
});