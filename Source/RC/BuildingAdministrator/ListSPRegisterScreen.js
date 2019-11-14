import React from 'react';
import { Dimensions, Alert, RefreshControl, Modal, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { ListAllProviderRegisterMember, GetImageSPbyUserID, ListAllResidentbyBuildingID, GetInfoUserbyUserId } from '../../../APIs/APIclass';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

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

        GetImageSPbyUserID(this.props.item.id)
            .then(res => {
                if (res.toString() !== "false") {
                    let avatar = new String(res);
                    this.setState({
                        Avatar: avatar,
                    });
                }
            });
    }
    render() {

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>

                <TouchableOpacity>
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

    static navigationOptions = {
        title: "Nhà cung cấp chờ duyệt"
    }

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
        ListAllProviderRegisterMember(BuildingID, Token)
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
            const itemData = `${item.nameInfo.toUpperCase()} ${item.phoneNumber.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
    }
    render() {

        return (
            <View style={{ flex: 1 }}>
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
                        keyExtractor={(item, index) => String(index)}
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