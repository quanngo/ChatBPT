import React from 'react';
import { Alert, RefreshControl, Modal, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { UpdateProviderPost, DeleteProviderPost, ListAllProviderPostbyProviderIdInBuilding } from '../../APIs/APIclass';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MenuButton from '../Component/MenuButton'

class FlatListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            activeRowKey: null,
            Status: ""
        });
    }
    componentDidMount() {
        if (this.props.item.status == 1) {
            this.setState({ Status: "Hiện" })
        } else if (this.props.item.status == 2) {
            this.setState({ Status: "Ẩn" })
        }
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
        this.props.parentFlatList.onRefresh();
    }
    nav() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Username = navigation.getParam('Username');
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');

        this.props.navigation.navigate('EditPostScreen', {
            Token: Token,
            UserID: UserID,
            BuildingID: BuildingID,
            PostID: this.props.item.id,
            Title: this.props.item.title,
            Description: this.props.item.description,
            Price: this.props.item.price,
            Status: this.props.item.status,
            Image: this.props.item.image,
        });
        this.setModalVisible(!this.state.modalVisible);
    }

    del() {
        Alert.alert(
            'THÔNG BÁO',
            'Bạn có muốn xóa bài đăng!',
            [
                //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {
                    text: 'Hủy',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Có', onPress: () => DeleteProviderPost(this.props.item.id)
                        .then(res => {
                            alert('Xóa thành công');
                            this.setModalVisible(!this.state.modalVisible);
                        })
                        .catch((error) => {
                            alert('Đường truyền có vấn đề, xin vui lòng thực hiện lại :(')
                        })
                },
            ],
            { cancelable: false },
        );
    }

    update() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');

        if (this.props.item.status == 1) {
            UpdateProviderPost(this.props.item.id, this.props.item.title, this.props.item.description, this.props.item.image, 2, UserID, this.props.item.price, BuildingID, Token)
                .then(res => {
                    if (res.toString() !== "false") {
                        this.props.parentFlatList.onRefresh();

                        this.setState({ Status: "Ẩn" })
                    } else {
                        alert("Đã xảy ra lỗi xin nhập lại!")
                    }
                })
                .catch((error) => {
                    //this.setState({ data: [] });
                    alert("Đã xảy ra lỗi mạng!")
                });
        } else if (this.props.item.status == 2) {
            UpdateProviderPost(this.props.item.id, this.props.item.title, this.props.item.description, this.props.item.image, 1, UserID, this.props.item.price, BuildingID, Token)
                .then(res => {
                    if (res.toString() !== "false") {
                        this.props.parentFlatList.onRefresh();

                        this.setState({ Status: "Hiện" })
                    } else {
                        alert("Đã xảy ra lỗi xin nhập lại!")
                    }
                })
                .catch((error) => {
                    //this.setState({ data: [] });
                    alert("Đã xảy ra lỗi mạng!")
                });
        }
    }
    render() {

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>

                    <View style={{
                        marginTop: 25,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text>Quay lại</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnEdit}
                            onPress={() => this.nav()}>
                            <Text>Chỉnh sửa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnDelete}
                            onPress={() => this.del()}>
                            <Text>Xóa</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: this.props.item.status == 1 ? 'white' : 'tomato'
                        //backgroundColor: 'mediumseagreen'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>
                            <Image
                                source={{ uri: "data:image/png;base64, " + this.props.item.image }}
                                style={{
                                    width: 250, height: 250, margin: 5, borderWidth: 1,
                                    borderRadius: 2, borderColor: 'black',
                                }}>
                            </Image>
                            <TouchableOpacity style={{
                                //marginTop: 2,
                                //marginLeft: 100,
                                width: 100,
                                height: 35,
                                alignItems: 'center',
                                borderRadius: 6,
                                backgroundColor: 'white',
                                borderColor: 'red',
                                borderWidth: 1,
                                borderRadius: 6,
                                //paddingHorizontal: 10,
                            }}
                                onPress={() => this.update()}>
                                <Text>Trạng thái: {this.state.Status}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}>
                            <Text>Tiêu đề:</Text>
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <Text style={styles.flatListItem}>{this.props.item.title}</Text>
                            </View>
                            <Text>Miêu tả:</Text>
                            <Text style={styles.flatListItem}>{this.props.item.description}</Text>
                            <Text>Giá:</Text>
                            <Text style={styles.flatListItem}>{this.props.item.price}</Text>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: this.props.item.status == 1 ? 'white' : 'tomato'
                        //: 'mediumseagreen'
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
                            <Text style={styles.flatListItem}>{this.props.item.title}</Text>
                            <Text style={styles.flatListItem}>{this.props.item.description}</Text>
                            <Text style={styles.flatListItem}>Giá: {this.props.item.price}</Text>
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

export default class HomepageSP extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = ({
            refreshing: false,
            data: []
        });
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
        ListAllProviderPostbyProviderIdInBuilding(UserID, BuildingID)
            .then(res => {
                if (res.toString() !== "false") {
                    let services = JSON.parse(res);

                    this.setState({ data: services });
                    this.setState({ refreshing: false });
                }
            })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });
    }
    onRefresh = () => {
        this.refreshDataFromServer();
    }

    render() {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const Username = navigation.getParam('Username');
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');

        return (
            <View style={{ flex: 1 }}>
                <MenuButton navigation={this.props.navigation} />
                <View style={styles.up}>
                    <Text style={styles.screenname}>Danh sách dịch vụ</Text>
                    <TouchableOpacity style={styles.btnCreate}
                        onPress={() => this.props.navigation.navigate('CreatePostScreen', {
                            Token: Token,
                            UserID: UserID,
                            BuildingID: BuildingID,
                        })}>
                        <Ionicons style={styles.btnText} name="ios-add-circle" size={35} />
                    </TouchableOpacity>
                    <View style={{
                        //position: 'absolute',
                        marginTop: 49,
                        height: 1,
                        backgroundColor: 'pink'
                    }} />
                </View>
                <View style={styles.down}>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item, index }) => {
                            return (
                                <FlatListItem item={item} index={index} navigation={this.props.navigation} parentFlatList={this}>

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
    flatListItem: {
        color: 'black',
        marginTop: 20,
        padding: 2,
        fontSize: 16,
        textAlign: 'center',
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