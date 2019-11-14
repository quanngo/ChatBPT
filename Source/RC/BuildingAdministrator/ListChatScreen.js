import React from 'react';
import { Dimensions, Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { ListAllGroupChatPublicinBuilding, GetInfoUserbyUserId, GetAllGroupResidentByUserID, GetNewestMessageByGroupID } from '../../../APIs/APIclass';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import Swipeout from 'react-native-swipeout'

import MenuButton from '../../Component/MenuButton'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class FlatListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            activeRowKey: null,
            mess: "",
            datetime: "",
            nameinfo: '',
            avatar: '',
        });
    }

    render() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Token = navigation.getParam('Token');
        const NameInfo = navigation.getParam('NameInfo');

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate('ChatScreenResident', {
                            Token: Token,
                            UserID: UserID,
                            NameInfo: NameInfo,
                            GroupChatID: this.props.item.id,
                            GroupChatName: this.props.item.chatGrName
                        })
                    }>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'                
                        backgroundColor: 'white'
                    }}>
                        <Image
                            source={{ uri: "data:image/png;base64, " + this.props.item.groupImage }}
                            style={{ width: 80, height: 80, margin: 5 }}>
                        </Image>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            height: 80
                        }}>
                            <Text style={styles.title}>{this.props.item.chatGrName}</Text>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={styles.mess}>{this.state.mess}</Text>
                                <Text style={styles.datetime}>{this.state.datetime}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        height: 2,
                        backgroundColor: 'black'
                    }}>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class ListChat extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = ({
            refreshing: false,
            data: [],
            search: '',
            modalVisible: false,
        });
        this.arrayholder = [];
    }

    componentDidMount() {
        this._isMounted = true;
        const { navigation } = this.props;

        this.focusListener = navigation.addListener('didFocus', () => {
            if (this._isMounted) {
                this.refreshDataFromServer();
            }
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

        ListAllGroupChatPublicinBuilding(BuildingID)
            .then(res => {
                let groups = JSON.parse(res);
                this.setState({ data: groups });
                //this.setState({ refreshing: false });

                this.arrayholder = groups;

                GetAllGroupResidentByUserID(UserID)
                .then(response => {
                    let groupss = JSON.parse(response);
                    this.setState({
                        data: this.state.data.concat(groupss)
                    });
                    this.setState({ refreshing: false });
    
                    this.arrayholder.concat(groupss);
                })
                .catch((error) => {
                    //this.setState({ data: [] });
                    this.setState({ refreshing: false });
                });
    
            })
            .catch((error) => {
                //this.setState({ data: [] });
                //this.setState({ refreshing: false });
            });

        // ListAllGroupChatPublicinBuilding(BuildingID)
        //     .then(res => {
        //         let groups = JSON.parse(res);
        //         this.setState({ data: groups });
        //         this.setState({ refreshing: false });

        //         this.arrayholder = groups;
        //     })
        //     .catch((error) => {
        //         //this.setState({ data: [] });
        //         this.setState({ refreshing: false });
        //     });
    }
    onRefresh = () => {
        this.refreshDataFromServer();
    }
    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.chatGrName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    navPub() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');

        this.props.navigation.navigate('CreatePublicGroupChatScreenBA', {
            Token: Token,
            UserID: UserID,
            BuildingID: BuildingID,
        })
        this.setModalVisible(!this.state.modalVisible);
    }
    navPri() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');
        
        this.props.navigation.navigate('CreatePrivateGroupChatScreenBA', {
            Token: Token,
            UserID: UserID,
            BuildingID: BuildingID,
        })
        this.setModalVisible(!this.state.modalVisible);
    }
    render() {

        return (
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
                    <TouchableOpacity style={styles.btnSignin}
                        onPress={() => this.navPub()}>
                        <TextInput
                            style={styles.signinText} editable={false}>
                            Tạo phòng chat công khai
                                    </TextInput>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnSignin}
                    onPress={() =>
                        this.props.navigation.navigate('CreatePrivateGroupChatScreenBA', {
                            Token: Token,
                            UserID: UserID,
                            BuildingID: BuildingID,
                        })
                    }
                    >
                        <TextInput
                            style={styles.signinText} editable={false}>
                            Tạo phòng chat kín
                                    </TextInput>
                    </TouchableOpacity>
                </Modal>

                <View style={styles.up}>
                    {/* <Image style={styles.img}
                        source={{ uri: "data:image/png;base64, " + Image }} /> */}

                    <MenuButton navigation={this.props.navigation} />
                    <Text style={styles.screenname}>Phòng Chat</Text>
                    <TouchableOpacity style={{ left: WIDTH * 0.9, top: HEIGHT * 0.01 }}
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}>
                        <Ionicons style={styles.btnText} name="ios-add-circle" size={35} />
                    </TouchableOpacity>
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
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    img: {
        position: 'absolute',
        marginTop: 7,
        marginLeft: 5,
        width: 25,
        height: 25
    },
    screenname: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: WIDTH * 0.2,
        fontSize: 20,
    },
    title: {
        color: '#325aa8',
        marginTop: 5,
        padding: 2,
        fontSize: 20,
        textAlign: 'center',
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
    up: {
        //flex: 0.7,
        height: 50,
    },
    down: {
        //flex: 9.3,
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
        fontSize: 18,
        color: 'white'
    }
});