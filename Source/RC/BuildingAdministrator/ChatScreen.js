import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Text, View, TouchableOpacity, Image, Alert, TextInput, FlatList, Button, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as signalR from '@aspnet/signalr';

const hubUrl = 'http://bigprotech.vn:5004/chatHub';
const hub = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .configureLogging(signalR.LogLevel.Information)
    .build();
hub.start();

class FlatListItem extends React.Component {

    render() {
        const { navigation } = this.props;
        const NameInfo = navigation.getParam('NameInfo');
        if (this.props.item.Name === "you" || this.props.item.Name === NameInfo.toString()) {
            return (
                <View style={[styles.item, styles.itemOut]}>
                    {/* {!inMessage && this.renderDate(item.date)} */}
                    <View style={[styles.balloon]}>
                        <Text>{this.props.item.Message}</Text>
                    </View>
                    {/* {inMessage && this.renderDate(item.date)} */}
                </View>
            )
        } else {
            return (
                <View style={[styles.item, styles.itemIn]}>
                    {/* {!inMessage && this.renderDate(item.date)} */}
                    <View style={[styles.balloon]}>
                        <Text style={[styles.Name]}>{this.props.item.Name}</Text>
                        <Text>{this.props.item.Message}</Text>
                    </View>
                    {/* {inMessage && this.renderDate(item.date)} */}
                </View>
            )
        }
    }
}

export default class ChatScreen extends Component {
    _isMounted = false;

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            sendMessage: "",
            messages: [],
            data: [],
            count: 1,
            scrollmesss: 1,
            status: '',
        };
    }
    updateValue(text, field) {
        this.setState({ [field]: text, });
    }

    componentDidMount() {
        this._isMounted = true;

        const { navigation } = this.props;
        const GroupChatID = navigation.getParam('GroupChatID');

        if (hub.connectionState == 1) {
            hub.invoke("JoinRoom", GroupChatID)
            .catch((error) => { alert(error) });
            
            this.refreshDataFromServer();
        } else if (hub.connectionState == 0) {
            hub.start()
                .then(
                    hub.invoke("JoinRoom", GroupChatID),
                    this.refreshDataFromServer);
        }
        //this.refreshDataFromServer();

        hub.on("message", (id, name, msg, img, uId) => {
            if (this._isMounted) {
                //let mess = '{"Name":"' + name + '","Message":"' + msg + '","Image":"' + img + '"}';
                let mess = '{"Id":"' + id + '","Name":"' + name + '","Message":"' + msg + '"}';

                var obj = JSON.parse(mess.toString());

                this.setState({
                    data: this.state.data.concat(obj)
                })
                // this.setState({ scrollmesss: this.state.count + 0.1 });
                // this.flatListRef.scrollToOffset({ offset: this.state.scrollmesss, animated: true });
            }
        });
    }
    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Token = navigation.getParam('Token');
        const GroupChatID = navigation.getParam('GroupChatID');

        hub.on("GetHistoryMobi", (id, name, msg, img, uId) => {
            if (this._isMounted) {
                if (id !== null) {
                    //let mess = '{"Name":"' + name + '","Message":"' + msg + '","Image":"' + img + '"}';
                    let mess = '{"Id":"' + id + '","Name":"' + name + '","Message":"' + msg + '"}';
                    let data = JSON.stringify(this.state.data, ['Id']);
                    if (data.match(id)) { } else {
                        this.state.messages.push(mess);
                    }
                    let string = '[' + this.state.messages.toString() + ']';
                    var obj = JSON.parse(string);

                    this.setState({ data: obj });
                    this.setState({ refreshing: false });
                } else {
                    this.setState({ data: obj });
                    this.setState({ refreshing: false });
                }
            }
        });
        hub.invoke("GetHistoryMobi", GroupChatID, UserID, Token, this.state.count)
        .catch((error) => { alert(error) });
        

        hub.on("Loading", () => { });
        hub.on("doneLoad", () => { });

        this.setState({ count: this.state.count + 1 });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    onRefresh = () => {
        this.setState({ messages: [], data: [] });

        this.refreshDataFromServer();
    }
    sendMessage = () => {
        this._isMounted = true;

        if (this._isMounted) {
            if (this.state.sendMessage.trim() !== '') {
                const { navigation } = this.props;
                const UserID = navigation.getParam('UserID');
                const Token = navigation.getParam('Token');
                const GroupChatID = navigation.getParam('GroupChatID');

                hub.invoke('SendMessageToGroup', UserID, GroupChatID, this.state.sendMessage.trim(), Token)
                    .catch((error) => { });

                this.textInput.clear()
                this.setState({ sendMessage: "" });
            }
        }
    }

    render() {
        const { navigation } = this.props;
        const GroupChatName = navigation.getParam('GroupChatName');

        return (
            <View style={styles.container}>
                <View style={styles.up}>
                    {/* <Image style={styles.img}
                        source={{ uri: "data:image/png;base64, " + Image }} /> */}

                    <Ionicons name={"ios-arrow-round-back"}
                        size={50}
                        style={{ position: 'absolute', left: 10}} 
                        onPress={() => this.props.navigation.goBack()}/>

                    <Text style={styles.screenname}>{GroupChatName}</Text>
                    <View style={{
                        //position: 'absolute',
                        marginTop: 49,
                        height: 1,
                        backgroundColor: 'pink'
                    }} />
                </View>
                <FlatList
                    data={this.state.data}
                    removeClippedSubviews={false}
                    extraData={this.state.data}
                    ref={(ref) => { this.flatListRef = ref; }}
                    onContentSizeChange={() => this.flatListRef.scrollToEnd()}
                    renderItem={({ item, index }) => {
                        return (
                            <FlatListItem item={item} index={index} navigation={this.props.navigation}>

                            </FlatListItem>);
                    }}
                    keyExtractor={(item, index) => String(index)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                />
                <View style={styles.footer}>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                            multiline={false}
                            ref={input => { this.textInput = input }}
                            placeholder="Viết tin nhắn..."
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.updateValue(text, 'sendMessage')}>
                        </TextInput>
                    </View>

                    <TouchableOpacity style={styles.btnSend}
                        onPress={this.sendMessage}>
                        <Image source={require('../../Images/Chat-Icons/send-button.png')} style={styles.iconSend} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        paddingHorizontal: 17,
    },
    footer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 10,
        padding: 5,
    },
    btnSend: {
        backgroundColor: "#00BFFF",
        width: 40,
        height: 40,
        borderRadius: 360,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSend: {
        width: 30,
        height: 30,
        alignSelf: 'center',
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
    inputs: {
        height: 40,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    balloon: {
        maxWidth: 250,
        padding: 15,
        borderRadius: 20,
    },
    itemIn: {
        backgroundColor: '#b0e0e6',
        alignSelf: 'flex-start'
    },
    itemOut: {
        alignSelf: 'flex-end'
    },
    Name: {
        color: 'red'
    },
    time: {
        alignSelf: 'flex-end',
        margin: 15,
        fontSize: 12,
        color: "#808080",
    },
    item: {
        marginVertical: 14,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#eeeeee",
        borderRadius: 300,
        padding: 5,
    },
    up: {
        //flex: 0.7,
        height: 50,
    },
    screenname: {
        position: 'absolute',
        marginTop: 7,
        marginLeft: 100,
        fontSize: 20,
    },
});