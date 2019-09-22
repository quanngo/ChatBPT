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
        const Avatar = navigation.getParam('Avatar');
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
                            Avatar: Avatar,
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
        });
    }
    componentDidMount()  {
        this._isMounted = true;

        if (this._isMounted) {
            this.refreshDataFromServer();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const Role = navigation.getParam('Role');
        this.setState({ data: Role });
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
                                <FlatListItem item={item} index={index} navigation={this.props.navigation}>

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
