import React from 'react';
import { Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { AddPrivateChatGroupSPtoResident, GetSinglePrivateChatGroupbyGuestID, AddResidentFollow, CheckedFollow, ListAllProviderPostbyProviderIdInBuilding, DeleteResidentFollow } from '../../../APIs/APIclass';

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

        if (this.props.item.status == 1) {
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
                        <View style={{ marginTop: 22 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Text>Quay lại</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'                
                            backgroundColor: '#e3e3e3'
                        }}>
                            <Image
                                source={{ uri: "data:image/png;base64, " + this.props.item.image }}
                                style={{
                                    width: 250, height: 250, margin: 5, borderWidth: 1,
                                    borderRadius: 2, borderColor: 'black',
                                }}>
                            </Image>

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
                        <View style={{
                            height: 2,
                            backgroundColor: 'white'
                        }}>
                        </View>
                    </Modal>

                    <TouchableOpacity onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'                
                            backgroundColor: '#e3e3e3'
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

export default class DetailService extends React.Component {
    static navigationOptions = {
        title: "Các dịch vụ"
    }

    constructor(props) {
        super(props);
        this.state = ({
            data: [],
            check: ''
        });
    }

    componentDidMount() {
        this.refreshDataFromServer();
    }
    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const ProviderID = navigation.getParam('ProviderID');
        const Token = navigation.getParam('Token');
        const BuildingID = navigation.getParam('BuildingID');

        ListAllProviderPostbyProviderIdInBuilding(ProviderID, BuildingID)
            .then(res => {
                let services = JSON.parse(res);
                if (services == "") {
                    alert("Hiện tại không có dịch vụ nào :(");
                }
                this.setState({ data: services });
            })
            .catch((error) => {
                alert("Hiện tại không có dịch vụ nào :(");
                this.setState({ data: [] });
            });
    }
    render() {
        const { navigation } = this.props;
        const ServiceName = navigation.getParam('ServiceName');

        return (
            <View style={{ flex: 1, marginTop: 22 }}>
                <Text style={styles.serviceName}>{ServiceName}</Text>

                <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) => {
                        return (
                            <FlatListItem item={item} index={index} navigation={this.props.navigation}>

                            </FlatListItem>);
                    }}
                    keyExtractor={(item, index) => item.id.toString()}
                />
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
    serviceName: {
        //position: 'absolute',
        fontSize: 20,
        textAlign: 'center',
    },
    screenname: {
        position: 'absolute',
        marginTop: 7,
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