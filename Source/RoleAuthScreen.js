import React from 'react';
import { StyleSheet, RefreshControl, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { COLOR_PINK, COLOR_PINK_LIGHT, COLOR_PINK_HEAVY } from './myColor'

import AsyncStorage from '@react-native-community/async-storage';

class FlatListItem extends React.Component {
    render() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Username = navigation.getParam('Username');
        const Password = navigation.getParam('Password');
        const Token = navigation.getParam('Token');
        const NameInfo = navigation.getParam('NameInfo');
        const NameService = navigation.getParam('NameService');
        const Description = navigation.getParam('Description');
        return (
            <View>
                <TouchableOpacity style={styles.btnSignin}
                    onPress={() =>
                        this.props.navigation.navigate(this.props.item.toString() + 'Building', {
                            Username: Username,
                            Password: Password,
                            Token: Token,
                            UserID: UserID,
                            NameService: NameService,
                            NameInfo: NameInfo,
                            Description: Description,
                            Role: this.props.item.toString(),
                        })
                    }>
                    <TextInput
                        style={styles.signinText} editable={false}>
                        {this.props.item}
                    </TextInput>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class Role extends React.Component {
    _isMounted = false;

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = ({
            data: [],
            username: '',
            password: '',
            role: [],
            Token: '',
            UserID: '',
            NameInfo: '',
            Role: '',
            NameService: '',
            Description: '',
        });
    }
    componentDidMount = async () => {
        this._isMounted = true;

        try {
            let username = await AsyncStorage.getItem('Username');
            let password = await AsyncStorage.getItem('Password');
            if (username !== null || password !== null) {
                this.SignIn(username, password)
            }
        } catch (e) {
            // error reading value
        }

        if (this._isMounted) {
            this.refreshDataFromServer();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    refreshDataFromServer = () => {
        this.setState({ data: Role });
    }
    SignIn(username, password) {
        LoginTokenGetInfo(username, password)
            .then(res => {
                if (res.toString() !== "false") {
                    let obj = JSON.parse(res);
                    let rol = new String(obj.role);
                    let token = new String(obj.token);
                    let userid = new String(obj.info.id);
                    let usernameInfo = new String(obj.info.nameInfo);

                    let count = 0;
                    let Role = rol.split(",");
                    for (let item of Role) {
                        if (item === "Resident") {
                            this.state.role.push(item)
                        }
                        else if (item === "ServiceProvider") {
                            this.state.role.push(item)
                        } else {
                            count += 1;
                        }
                    }

                    // Nếu chỉ có 1 role
                    if (Role.length == 1) {
                        let sRole = new String(Role);
                        if (sRole == "Resident") {
                            this.NavigateResident(username, password, userid, usernameInfo, token, sRole, sRole + 'Building');
                        }
                        if (sRole == "ServiceProvider") {
                            this.NavigateSP(username, password, userid, usernameInfo, token, sRole, sRole + 'Building');
                        }
                    }

                    else if (count === Role.length) {
                        alert('Bạn không có quyền đăng nhập!');
                    }
                    else {
                        GetSingleProviderService(userID)
                            .then(res => {
                                if (res.toString() !== "false") {
                                    let sp = JSON.parse(res);
                                    spName = new String(sp.serviceName);
                                    spDescription = new String(sp.description);

                                    this._storeData(username, password);

                                    this.setState({
                                        data: Role,
                                        username: username,
                                        password: password,
                                        Token: token,
                                        UserID: userID,
                                        NameInfo: usernameInfo,
                                        Role: role,
                                        NameService: spName,
                                        Description: spDescription,
                                    });
                                }
                            });
                        this.setState({ role: [] });
                    }
                } else {
                    AsyncStorage.clear();
                    alert('Đăng nhập thất bại :(. Xin vui lòng thử lại!');
                    this.props.navigation.navigate('SignInScreen');
                }
            });
    }
    NavigateResident(username, password, userID, usernameInfo, token, role, screen) {
        GetSingleResidentbyId(userID)
            .then(response => {
                if (response.toString() !== "false") {
                    //let re = JSON.parse(response);
                    //reImage = new String(re.image);

                    this._storeData(username, password);

                    this.props.navigation.navigate(screen, {
                        Username: username,
                        Password: password,
                        Token: token,
                        UserID: userID,
                        NameInfo: usernameInfo,
                        Role: role,
                    });
                }
            });
        this.setState({ role: [] });
    }
    NavigateSP(username, password, userID, usernameInfo, token, role, screen) {
        GetSingleProviderService(userID)
            .then(res => {
                if (res.toString() !== "false") {
                    let sp = JSON.parse(res);
                    spName = new String(sp.serviceName);
                    spDescription = new String(sp.description);

                    this._storeData(username, password);

                    this.props.navigation.navigate(screen, {
                        Username: username,
                        Password: password,
                        Token: token,
                        UserID: userID,
                        NameInfo: usernameInfo,
                        Role: role,
                        NameService: spName,
                        Description: spDescription,
                    });
                }
            });
        this.setState({ role: [] });
    }

    _storeData = async (username, password) => {
        try {
            await AsyncStorage.setItem('Username', username)
            await AsyncStorage.setItem('Password', password)

        } catch (error) {
            // Error saving data
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.up}>
                    <Text style={styles.title}>
                        Residential Communication Chat
                    </Text>
                </View>
                <View style={styles.down}>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item, index }) => {
                            return (
                                <FlatListItem item={item} index={index} navigation={this.props.navigation} parentFlatList={this}>

                                </FlatListItem>);
                        }}
                        keyExtractor={(item, index) => String(index)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: COLOR_PINK
    },
    up: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    down: {
        flex: 7,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        color: 'orange',
        textAlign: 'center',
        width: 400,
        fontSize: 23
    },
    textInputContainer: {
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 20,
        backgroundColor: COLOR_PINK_LIGHT
    },
    textInput: {
        width: 280,
        height: 45
    },
    btnSignin: {
        marginTop: 25,
        width: 260,
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: COLOR_PINK_HEAVY
    },
    signinText: {
        fontSize: 18,
        color: 'white'
    }
});
