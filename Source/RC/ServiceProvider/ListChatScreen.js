import React from 'react';
import { Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { GetImageResidentbyUserID, GetInfoUserbyUserId, GetAllGroupProviderByUserID, GetNewestMessageByGroupID } from '../../../APIs/APIclass';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import Swipeout from 'react-native-swipeout'

import MenuButton from '../../Component/MenuButton'

class FlatListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            activeRowKey: null,
            mess: "",
            datetime: "",
            guestName: "",
            avatar: "",
        });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    componentDidMount() {
        this._isMounted = true;
        const { navigation } = this.props;
        const Token = navigation.getParam('Token');

        let id = new String(this.props.item.id);
        let guestID = new String(this.props.item.guestID);

        GetInfoUserbyUserId(guestID, Token)
            .then(response => {
                if (response.toString() !== "false") {
                    let user = JSON.parse(response);
                    let guestName = new String(user.nameInfo);
                    let userid = new String(user.id);

                    GetImageResidentbyUserID(userid).then(response => {
                        if (response.toString() !== "false") {
                            let avatar = new String(response);

                            this.setState({
                                guestName: guestName,
                                avatar: avatar,
                            });
                        }
                    });
                }
            });

        // GetNewestMessageByGroupID(id).then(res => {
        //     if (res.toString() !== "false") {
        //         let obj = JSON.parse(res);
        //         let message = new String(obj.content);

        //         let mess;
        //         if(message.length > 23) {
        //             mess = message.substring(0,22) + "...";
        //         }else{
        //             mess = message;
        //         }
        //         let dt = new Date(obj.datetime);
        //         let datetime = dt.getHours() + ':' + dt.getMinutes() + "  " + dt.getDate() + "-" + dt.getMonth() + "-" + dt.getFullYear();
        //         this.setState({
        //             mess: mess,
        //             datetime: datetime
        //         });
        //     } else {
        //         //this.setState({ mess: "" });
        //     }
        // })
        //     .catch((error) => {
        //         //this.setState({ mess: "" });
        //     });
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
                        this.props.navigation.navigate('ChatScreenSP', {
                            Token: Token,
                            UserID: UserID,
                            NameInfo: NameInfo,
                            GroupChatID: this.props.item.id,
                            GroupChatName: this.props.item.chatGrName,
                            GuestName: this.state.guestName,
                        })
                    }>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'                
                        backgroundColor: 'white'
                    }}>
                        <Image
                            source={{ uri: "data:image/png;base64, " + this.state.avatar }}
                            style={{ width: 80, height: 80, margin: 5 }}>
                        </Image>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            height: 80
                        }}>
                            <Text style={styles.title}>{this.state.guestName}</Text>
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

        this.setState({ refreshing: true });
        GetAllGroupProviderByUserID(UserID).then(res => {
            let groups = JSON.parse(res);
            this.setState({ data: groups });
            this.setState({ refreshing: false });

            this.arrayholder = groups;
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
            const itemData = `${item.chatGrName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
    }
    render() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');
        //const Image = navigation.getParam('Image');

        return (
            <View style={{ flex: 1, paddingBottom: 98, }}>
                <MenuButton navigation={this.props.navigation} />
                <View style={styles.up}>

                    <Text style={styles.screenname}>Phòng Chat</Text>

                    {/* <TouchableOpacity style={styles.btnCreate}
                        onPress={() => this.props.navigation.navigate('CreateGroupChatScreen', {
                            Token: UserID,
                            UserID: Token,
                            BuildingID: BuildingID,
                        })}>
                        <Ionicons style={styles.btnText} name="ios-add-circle" size={35}/>
                    </TouchableOpacity> */}
                    <View style={{
                        //position: 'absolute',
                        marginTop: 49,
                        height: 1,
                        backgroundColor: 'pink'
                    }} />
                </View>
                <View style={styles.down}>
                    <SearchBar
                        placeholder="Tìm kiếm..."
                        lightTheme
                        round
                        onChangeText={text => this.searchFilterFunction(text)}
                        autoCorrect={false}
                        value={this.state.value}
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
        //position: 'absolute',
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
    up: {
        //flex: 0.7,
        height: 50,
    },
    down: {
        //flex: 9.3,
    },
});