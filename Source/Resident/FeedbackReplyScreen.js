import React from 'react';
import { Keyboard, TouchableWithoutFeedback, Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { AddSubFeedback, ListAllSubFeedbackbyMainFeedbackID, GetSingleAdminbyBuildingID } from '../../APIs/APIclass';

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

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: '#f4e0ff'
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        //height: 100
                    }}>
                        <Text style={styles.title}>{this.props.item.title}</Text>
                        <Text style={styles.content}>{this.props.item.context}</Text>
                    </View>
                </View>
                <View style={{
                    height: 2,
                    backgroundColor: 'white'
                }}>
                </View>
            </View>
        )
    }
}

export default class FeedbackReply extends React.Component {
    _isMounted = false;

    // static navigationOptions = {
    //     title: "Các dịch vụ"
    // }

    constructor(props) {
        super(props);
        this.state = ({
            refreshing: false,
            data: [],
            check: '',
            title: '',
            content: '',
            adminBuildingID: '',
        });
    }
    updateValue(text, field) {
        this.setState({ [field]: text, });
    }
    componentDidMount() {
        this._isMounted = true;
        const { navigation } = this.props;
        const BuildingID = navigation.getParam('BuildingID');

        this.refreshDataFromServer();

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
    }
    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const MainFeedbackID = navigation.getParam('MainFeedbackID');

        this.setState({ refreshing: true });
        ListAllSubFeedbackbyMainFeedbackID(MainFeedbackID)
            .then(res => {
                let feedback = JSON.parse(res);
                this.setState({ data: feedback });

                this.setState({ refreshing: false });
            })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });
    }
    onRefresh = () => {
        this.refreshDataFromServer();
    }
    submit() {
        if (this.state.content.trim() == '') {
            alert('Vui lòng điền nội dung');
        } else {
            const { navigation } = this.props;
            const UserID = navigation.getParam('UserID');
            const BuildingID = navigation.getParam('BuildingID');
            const NameInfo = navigation.getParam('NameInfo');
            const MainFeedbackID = navigation.getParam('MainFeedbackID');
            const Room = navigation.getParam('MainFeedbackID');

            Status = 0;

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var DatePost = date + ' ' + time;

            AddSubFeedback(NameInfo, this.state.content, UserID, this.state.adminBuildingID, DatePost, Status, BuildingID, MainFeedbackID, Room)
                .then(response => {
                    if (response.toString() == "true") {
                        this.textInput.clear();
                        this.refreshDataFromServer();

                        this.setState({ content: '' });
                    } else {
                        alert('Gửi phản hồi gặp lỗi xin vui lòng thử lại!')
                    }
                })
                .catch((error) => {
                    alert('Gửi phản hồi gặp lỗi xin vui lòng thử lại!')
                });

        }
    }
    render() {
        const { navigation } = this.props;
        const Title = navigation.getParam('Title');
        const Content = navigation.getParam('Content');

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <View>
                        <Text style={styles.firstTitle}>{Title}</Text>
                        <Text style={styles.first}>{Content}</Text>
                    </View>
                    <View style={{
                        height: 2,
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
                    <View style={{
                        height: 2,
                        backgroundColor: 'white'
                    }}></View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            ref={input => { this.textInput = input }}
                            style={styles.textInput}
                            placeholder="Nhập phản hồi..."
                            onChangeText={(text) => this.updateValue(text, 'content')}>
                        </TextInput>
                    </View>
                    <TouchableOpacity style={styles.btnSubmit}
                        onPress={() => { this.submit() }}>
                        <TextInput
                            style={styles.submitText} editable={false}>
                            gửi
                    </TextInput>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
    firstTitle: {
        color: 'red',
        padding: 5,
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'left',
    },
    first: {
        color: 'black',
        paddingLeft: 5,
    },
    title: {
        color: '#cf7500',
        padding: 5,
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'left',
    },
    content: {
        color: 'black',
        paddingLeft: 5,
    },
    img: {
        position: 'absolute',
        marginTop: 7,
        marginLeft: 5,
        width: 25,
        height: 25
    },
    screenname: {
        position: 'absolute',
        marginTop: 7,
        marginLeft: 100,
        fontSize: 20,
    },
    textInputContainer: {
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 20,
        backgroundColor: '#e0feff'
    },
    textInput: {
        width: 280,
        height: 45
    },
    btnSubmit: {
        //marginTop: 25,
        width: 260,
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    btnSend: {
        marginTop: 5,
        width: 260,
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: 'pink'
    },
    up: {
        //flex: 0.7,
        height: 50,
    },
    down: {
        //flex: 9.3,
    },
    submitText: {
        fontSize: 18,
        color: 'blue'
    }
});