import React from 'react';
import {
	View,
	Text,
	Image,
	ScrollView,
	Platform,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { GetSingleResidentbyId, GetSingleProviderService } from '../../APIs/APIclass'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class MenuDrawer extends React.Component {
	static navigationOptions = {
		activeTintColor: 'red',
	}
	constructor(props) {
		super(props);
		this.state = ({
			avatar: '',
			name: ''
		});
	}
	componentDidMount() {
		const { navigation } = this.props;

		this.focusListener = navigation.addListener('didFocus', () => {
			this.refreshDataFromServer();
		});
	}
	refreshDataFromServer = () => {
		const { navigation } = this.props;
		const UserID = navigation.getParam('UserID');

		GetSingleProviderService(UserID)
			.then(res => {
				if (res.toString() !== "false") {
					let sp = JSON.parse(res);
					name = new String(sp.serviceName);
					avatar = new String(sp.image);

					this.setState({
						name: name,
						avatar: avatar,
					});
				}
			});
	}
	navLink(nav, text) {
		return (
			<TouchableOpacity style={{ height: 50 }} onPress={() => this.props.navigation.navigate(nav)}>
				<Text style={styles.link}>{text}</Text>
			</TouchableOpacity>
		)
	}

	render() {
		const avatar = this.state.avatar
		return (
			<View style={styles.container}>
				<View style={styles.topLinks}>
					<View style={styles.profile}>
						<View style={styles.imgView}>
							<Image style={styles.img} source={{
								uri: 'data:image/jpeg;base64,' + avatar,
							}} />
						</View>
						<View style={styles.profileText}>
							<Text style={styles.name}>{this.state.name}</Text>
						</View>
					</View>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'lightgray',
	},
	profile: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#777777',
	},
	profileText: {
		flex: 3,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	name: {
		fontSize: 20,
		paddingBottom: 5,
		color: 'black',
		textAlign: 'left',
	},
	imgView: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
	},
	img: {
		height: 70,
		width: 70,
		borderRadius: 50,
	},
	topLinks: {
		height: 160,
		backgroundColor: '#abfbff',
	},
	bottomLinks: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: 10,
		paddingBottom: 450,
	},
	link: {
		flex: 1,
		fontSize: 20,
		padding: 6,
		paddingLeft: 14,
		margin: 5,
		textAlign: 'left',
	},
	footer: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: 'lightgray'
	},
	version: {
		flex: 1,
		textAlign: 'right',
		marginRight: 20,
		color: 'gray'
	},
	description: {
		flex: 1,
		marginLeft: 20,
		fontSize: 16,
	}
})