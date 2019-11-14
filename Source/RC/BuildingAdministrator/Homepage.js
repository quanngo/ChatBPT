import React from 'react';
import { Dimensions, Alert, TouchableWithoutFeedback, Keyboard, ScrollView, RefreshControl, Button, StyleSheet, Modal, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { GetInfoResident, ListAllProviderRegisterMember, ListAllResidentBuildingRegister, GetSingleAdminbyBuildingID, ListAllProviderInfobyBuildingID } from '../../../APIs/APIclass';
import { SearchBar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MenuButton from '../../Component/MenuButton'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class Feedback extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            refreshing: false,
            data: [],
            countSP: 0,
            countR: 0,
            countRegSP: 0,
            countRegR: 0,
        });
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

        GetSingleAdminbyBuildingID(BuildingID)
            .then(res => {
                let user = JSON.parse(res);
                Receiver = new String(user.adminBuildingID);

                this.setState({ adminBuildingID: Receiver });
            })
            .catch((error) => {
            });

    }
    componentWillUnmount() {
        this._isMounted = false;
        this.focusListener.remove();
    }

    // can optImizE
    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const BuildingID = navigation.getParam('BuildingID');
        const Token = navigation.getParam('Token');

        this.setState({ refreshing: true });
        ListAllProviderInfobyBuildingID(BuildingID)
            .then(res => {
                let sps = JSON.parse(res);
                this.setState({
                    countSP: sps.length
                });

                this.setState({ refreshing: false });
            })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });
        GetInfoResident(BuildingID, Token)
            .then(res => {
                let rs = JSON.parse(res);
                this.setState({
                    countR: rs.length
                });

                this.setState({ refreshing: false });
            })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });
        ListAllResidentBuildingRegister(BuildingID)
            .then(res => {
                let rrs = JSON.parse(res);
                this.setState({
                    countRegR: rrs.length
                });

                this.setState({ refreshing: false });
            })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });
        ListAllProviderRegisterMember(BuildingID)
            .then(res => {
                let rsps = JSON.parse(res);
                this.setState({
                    countRegSP: rsps.length
                });

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

    render() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const BuildingID = navigation.getParam('BuildingID');
        const Token = navigation.getParam('Token');

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <MenuButton navigation={this.props.navigation} />
                    <View style={styles.up}>
                        <Text style={styles.screenname}>Quản lí</Text>
                    </View>

                    <View style={{
                        height: 1,
                        backgroundColor: '#e6e6e6'
                    }}></View>
                    <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}>
                            <TouchableOpacity
                            onPress={() =>
                            this.props.navigation.navigate('ListResidentRegisterScreen', {
                                Token: Token,
                                UserID: UserID,
                                BuildingID: BuildingID,
                            })}
                            >
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#f7f7f7'
                                }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        height: 80
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={styles.room}> Số cư dân đang chờ duyệt </Text>
                                        </View>

                                        <Text style={styles.flatListItem}>{this.state.countRegR}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <View style={{
                                height: 2,
                                backgroundColor: 'white'
                            }}>
                            </View>
                        </View>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}>
                            <TouchableOpacity
                            onPress={() =>
                            this.props.navigation.navigate('ListSPRegisterScreen', {
                                Token: Token,
                                UserID: UserID,
                                BuildingID: BuildingID,
                            })}
                            >
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#f7f7f7'
                                }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        height: 80
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={styles.room2}> Số nhà cung cấp đang chờ duyệt</Text>
                                        </View>

                                        <Text style={styles.flatListItem}>{this.state.countRegSP}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <View style={{
                                height: 30,
                                backgroundColor: 'white'
                            }}>
                            </View>
                        </View>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate('ListResidentScreenBA', {
                                        Token: Token,
                                        UserID: UserID,
                                        BuildingID: BuildingID,
                                    })}
                            >
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#f7f7f7'
                                }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        height: 80
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={styles.room}> Số cư dân trong tòa nhà </Text>
                                        </View>

                                        <Text style={styles.flatListItem}>{this.state.countR}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <View style={{
                                height: 2,
                                backgroundColor: 'white'
                            }}>
                            </View>
                        </View>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate('ListSPScreenBA', {
                                        Token: Token,
                                        UserID: UserID,
                                        BuildingID: BuildingID,
                                    })}
                            >
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#f7f7f7'
                                }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        height: 80
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={styles.room2}> Số nhà cung cấp trong tòa nhà </Text>
                                        </View>

                                        <Text style={styles.flatListItem}>{this.state.countSP}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <View style={{
                                height: 2,
                                backgroundColor: 'white'
                            }}>
                            </View>
                        </View>
                    </ScrollView>
                </View>
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
    room2: {
        color: 'red',
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
        marginTop: 12,
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