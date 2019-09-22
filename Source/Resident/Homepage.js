import React from 'react';
import { Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { ListAllProviderInfobyBuildingID } from '../../APIs/APIclass';
import { SearchBar } from 'react-native-elements';
import Swipeout from 'react-native-swipeout'

import MenuButton from '../Component/MenuButton'

class FlatListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            activeRowKey: null
        });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Username = navigation.getParam('Username');
        const Password = navigation.getParam('Password');
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');
        const BuildingName = navigation.getParam('BuildingName');
        const NameInfo = navigation.getParam('NameInfo');

        if (UserID.toString() !== this.props.item.id) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate('DetailServiceScreen', {
                                Username: Username,
                                Password: Password,
                                Token: Token,
                                NameInfo: NameInfo,
                                UserID: UserID,
                                Role: "Resident",
                                BuildingID: BuildingID,
                                BuildingName: BuildingName,
                                ProviderID: this.props.item.id,
                                ServiceName: this.props.item.serviceName,
                                ServiceImage: this.props.item.image
                            })
                        }>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'                
                            backgroundColor: 'mediumseagreen'
                        }}>
                            <Image
                                source={{ uri: "data:image/png;base64, " + this.props.item.image }}
                                style={{ width: 100, height: 100, margin: 5 }}>
                            </Image>

                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                height: 100
                            }}>
                                <Text style={styles.flatListItem}>{this.props.item.serviceName}</Text>
                                <Text style={styles.flatListItem}>{this.props.item.description}</Text>
                            </View>
                        </View>
                        <View style={{
                            height: 2,
                            backgroundColor: 'white'
                        }}>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (<View></View>)
        }
    }
}

export default class HomepageR extends React.Component {
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
        const BuildingID = navigation.getParam('BuildingID');

        this.setState({ refreshing: true });
        ListAllProviderInfobyBuildingID(BuildingID).then(res => {
            let services = JSON.parse(res);
            this.setState({ data: services });
            this.setState({ refreshing: false });

            this.arrayholder = services;
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
            const itemData = `${item.serviceName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
    }
    render() {
        return (
            <View style={{ flex: 1}}>
                <MenuButton navigation={this.props.navigation} />
                <View style={styles.up}>
                    {/* <Image style={styles.img}
                        source={{ uri: "data:image/png;base64, " + Image }} /> */}

                    <Text style={styles.screenname}>Danh sách dịch vụ</Text>

                    <View style={{
                        marginTop: 49,
                        height: 1,
                        backgroundColor: 'pink'
                    }} />
                </View>
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
                    keyExtractor={(item, index) => item.id}
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
const styles = StyleSheet.create({
    img:{
        position: 'absolute',
        marginTop: 7,
        marginLeft: 5,
        width: 25,
        height: 25
    },
    screenname:{
        position: 'absolute',
        marginTop: 10,
        marginLeft: 100,
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