import React from 'react';
import { Modal, RefreshControl, Button, StyleSheet, FlatList, Text, View, Vibration, TextInput, TouchableOpacity, Image } from 'react-native';
import { GetSingleProviderPost} from '../../../APIs/APIclass';

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
        // const { navigation } = this.props;
        // const UserID = navigation.getParam('UserID');
        // const Token = navigation.getParam('Token');
        // const Building = navigation.getParam('Building');
        // const PostID = navigation.getParam('PostID');
        // const Title = navigation.getParam('Title');
        // const Description = navigation.getParam('Description');
        // const Status = navigation.getParam('Status');
        // const Image = navigation.getParam('Image');

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                {/* <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate('DetailPost', {
                            Token: Token,
                            UserID: UserID,
                            Building: Building,
                            PostID: this.props.item.id,
                            // Title: this.props.item.title,
                            // Description: this.props.item.description,
                            // Status: this.props.item.status,
                            // Image: this.props.item.image,
                        })
                    }>
                </TouchableOpacity> */}
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
                        <Text style={styles.flatListItem}>{this.props.item.title}</Text>
                        <Text style={styles.flatListItem}>{this.props.item.description}</Text>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    flatListItem: {
        color: 'black',
        padding: 10,
        fontSize: 24,
        textAlign: 'center',
    }
});
export default class DetailPost extends React.Component {
    _isMounted = false;

    static navigationOptions = {
        title: "Chi tiết bài đăng"
    }

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
    componentWillUnmount() {
        this._isMounted = false;
        this.focusListener.remove();
    }

    refreshDataFromServer = () => {
        const { navigation } = this.props;
        const UserID = navigation.getParam('UserID');
        const BuildingID = navigation.getParam('BuildingID');
        const Token = navigation.getParam('Token');
        const PostID = navigation.getParam('PostID');

        this.setState({ refreshing: true });
        GetSingleProviderPost(PostID).then(res => {
            let services = JSON.parse(res);
            this.setState({ data: services });
            this.setState({ refreshing: false });
        })
            .catch((error) => {
                //this.setState({ data: [] });
                this.setState({ refreshing: false });
            });
    }

    render() {

        return (
            <View style={{ flex: 1, marginTop: 22 }}>
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
            </View>
        );
    }
}
