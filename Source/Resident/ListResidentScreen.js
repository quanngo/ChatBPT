import React from 'react';
import { Alert, RefreshControl, Modal, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { GetInfoResident, GetSinglePrivateChatGroupRestoRes, AddPrivateChatGroupRestoRes, GetImageResidentbyUserID, ListAllResidentbyBuildingID, GetInfoUserbyUserId } from '../../APIs/APIclass';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';

import MenuButton from '../Component/MenuButton'

class FlatListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            activeRowKey: null,
            Status: "",
            NameInfo: '',
            Avatar: '',
        });
    }
    componentDidMount() {
        this._isMounted = true;

        GetImageResidentbyUserID(this.props.item.id)
            .then(res => {
                if (res.toString() !== "false") {
                    let avatar = new String(res);
                    this.setState({
                        Avatar: avatar,
                    });
                }
            });
    }
    privatechat() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Token = navigation.getParam('Token');
        const NameInfo = navigation.getParam('NameInfo');
        const BuildingID = navigation.getParam('BuildingID');

        GetSinglePrivateChatGroupRestoRes(UserID, this.props.item.id).then(res => {
            if (res.toString() !== 'false') {
                let group = JSON.parse(res);
                groupID = new String(group.id);
                groupName = new String(group.chatGrName);

                this.props.navigation.navigate('ChatScreenResident', {
                    Token: Token,
                    UserID: UserID,
                    GroupChatID: groupID,
                    NameInfo: NameInfo,
                    GroupChatName: this.props.item.nameInfo,
                })
            } else {
                Alert.alert(
                    'Chat riêng',
                    'Bạn có muốn chat với ' + this.props.item.nameInfo,
                    [
                        { text: 'Khi khác', onPress: () => { return null } },
                        {
                            text: 'Có', onPress: () => {
                                AddPrivateChatGroupRestoRes(NameInfo, 2, UserID, "", 2, BuildingID, this.props.item.id, 1).then(response => {
                                    alert("Đang tạo phòng chat");
                                    if (response.toString() !== 'false') {
                                        let gr = JSON.parse(response);
                                        grID = new String(gr.id);
                                        grName = new String(gr.chatGrName);

                                        this.props.navigation.navigate('ChatScreenResident', {
                                            Token: Token,
                                            UserID: UserID,
                                            GroupChatID: grID,
                                            NameInfo: NameInfo,
                                            GroupChatName: this.props.item.nameInfo,
                                        })
                                    } else {
                                        alert("Tạo phòng thất bại, xin hãy thử lại");
                                    }
                                })
                                    .catch((error) => {
                                        //this.setState({ check: 'false' });
                                    });
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
        })
            .catch((error) => {
                //this.setState({ check: 'false' });
            });
    }
    render() {

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>

                <TouchableOpacity onPress={() => this.privatechat()} >
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: 'white'
                    }}>
                        <Image
                            source={{ uri: "data:image/png;base64, " + this.state.Avatar }}
                            style={{
                                width: 60, height: 60, margin: 5, borderWidth: 0.5,
                                borderRadius: 50, borderColor: 'white',
                            }}>
                        </Image>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            height: 80
                        }}>
                            <Text style={{ fontWeight: 'bold', marginLeft: 10, marginTop: 25 }}>
                                {this.props.item.nameInfo}
                            </Text>
                        </View>
                    </View>
                    {/* <View style={{
                        height: 0.5,
                        backgroundColor: 'black'
                    }}>
                    </View> */}
                </TouchableOpacity>
            </View>
        )
    }
}

export default class ListResident extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = ({
            refreshing: false,
            data: [],
            search: '',
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
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');

        this.setState({ refreshing: true });
        GetInfoResident(BuildingID, Token)
            .then(res => {
                //if (res.toString() !== "false") {
                    let resident = JSON.parse(res);
                    this.setState({ data: resident });
                    this.setState({ refreshing: false });

                    this.arrayholder = resident;
                //}
            })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });
    }
    onRefresh = () => {
        this.refreshDataFromServer();
    }
    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.nameInfo.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
    }
    render() {
        const { navigation } = this.props;
        const BuildingName = navigation.getParam('BuildingName');

        return (
            <View style={{ flex: 1 }}>
                <MenuButton navigation={this.props.navigation} />
                <View style={styles.up}>
                    <Text style={styles.screenname}>Cư dân - {BuildingName}</Text>
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
        marginLeft: 70,
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