import React from 'react';
import { Alert, TouchableWithoutFeedback, Keyboard, Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { AddFeedback, GetSingleAdminbyBuildingID, ListAllFeedbackbyReceiverID } from '../../APIs/APIclass';
import Swipeout from 'react-native-swipeout'

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
        //const { navigation } = this.props;
        // const UserID = navigation.getParam('UserID');
        // const Username = navigation.getParam('Username');
        // const Password = navigation.getParam('Password');
        // const Token = navigation.getParam('Token');
        // const Building = navigation.getParam('Building');

        const swipeSettings = {
            autoClose: true,
             onClose: (sectionID, rowId, directionn) => {
                if(this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }              
            },          
            onOpen: (sectionID, rowId, direction) => {
                this.setState({ activeRowKey: this.props.item.key });
            },      
            right: [
                {
                    onPress: () => {    
                        this.setModalVisible(!this.state.modalVisible);
                    }, 
                    text: 'Reply', type: 'delete' 
                }
            ],
            rowId: this.props.index, 
            sectionId: 1    
        };

        return (
            <Swipeout {...swipeSettings}>
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
                            <Text>Go back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'                
                        backgroundColor: 'mediumseagreen'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            height: 100
                        }}>
                            <Text style={styles.flatListItem}>{this.props.item.title}</Text>
                            <Text style={styles.flatListItem}>{this.props.item.context}</Text>
                        </View>
                    </View>
                </Modal>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <TouchableOpacity onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'                
                            backgroundColor: 'mediumseagreen'
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                height: 100
                            }}>
                                <Text style={styles.flatListItem}>{this.props.item.title}</Text>
                                <Text style={styles.flatListItem}>{this.props.item.context}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        height: 2,
                        backgroundColor: 'white'
                    }}>
                    </View>
                </View>
            </Swipeout>
        )
    }
}
const styles = StyleSheet.create({
    flatListItem: {
        color: 'white',
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
    btnSignin: {
        marginTop: 5,
        width: 260,
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: 'pink'
    }
});
export default class Following extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            modalVisible: false,
            refreshing: false,
            data: [],
            title: '',
            content: ''
        });
    }
    updateValue(text, field) {
        this.setState({ [field]: text, });
    }
    componentDidMount() {
        this.refreshDataFromServer();
    }
    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const BuildingID = navigation.getParam('BuildingID');

        ListAllFeedbackbyReceiverID(UserID, BuildingID).then(res => {
            let services = JSON.parse(res);
            this.setState({ data: services });
        })
            .catch((error) => {
                this.setState({ data: [] });
            });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    onRefresh = () => {
        this.refreshDataFromServer();
    }
    submit() {
        if (this.state.title == '' || this.state.content == '') {
            alert('Please fill in all');
        } else {
            const { navigation } = this.props;
            const UserID = navigation.getParam('UserID');
            const BuildingID = navigation.getParam('BuildingID');

            GetSingleAdminbyBuildingID(BuildingID)
                .then(res => {
                    let user = JSON.parse(res);
                    Receiver = new String(user.id);
                    Status = 0;

                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var DatePost = date + ' ' + time;

                    AddFeedback(this.state.title, this.state.content, UserID, Receiver, DatePost, Status, BuildingID)
                        .then(response => {
                            if (response.toString() == "true") {
                                this.setModalVisible(!this.state.modalVisible);
                                alert(DatePost);
                                //alert('Send succeed')
                            } else {
                                alert('Send error !!!')
                            }
                        })
                        .catch((error) => {
                            alert('Send error !!!')
                        });
                })
                .catch((error) => {
                });
        }
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {/* <View style={{ flex: 1, marginTop: 22 }}>
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
                                <Text>Go back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput style={styles.textInput}
                                placeholder="Insert a title for Feedback"
                                onChangeText={(text) => this.updateValue(text, 'title')}>
                            </TextInput>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Write your Feedback in here"
                                onChangeText={(text) => this.updateValue(text, 'content')}>
                            </TextInput>
                        </View>
                        <TouchableOpacity style={styles.btnSignin}
                            onPress={() => this.submit()}>
                            <TextInput
                                style={styles.signinText} editable={false}>
                                Send
                            </TextInput>
                        </TouchableOpacity>
                    </Modal>
                    <TouchableOpacity style={styles.btnSignin}
                        onPress={() => {
                            this.setModalVisible(true);
                        }}>
                        <TextInput
                            style={styles.signinText} editable={false}>
                            Send Feedback
                        </TextInput>
                    </TouchableOpacity>
                    <View style={{
                        height: 4,
                        backgroundColor: 'white'
                    }}>
                    </View>
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
                </View> */}

                <Text>Đang trong quá trình nâng cấp</Text>
            </TouchableWithoutFeedback>
        );
    }
}
