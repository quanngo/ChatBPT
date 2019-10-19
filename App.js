import React from 'react';
import { ScrollView, Image, Dimensions, Alert, SafeAreaView, View, Button, Text, TouchableOpacity } from 'react-native';
import { createSwitchNavigator,  DrawerItems, createDrawerNavigator, createAppContainer, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'; // Version can be specified in package.json
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import SignInScreen from './Source/SignInScreen'
import AsyncLoginScreen from './Source/AsyncLoginScreen'
import AuthLoadingScreen from './Source/AuthLoadingScreen'
import RoleAuthScreen from './Source/RoleAuthScreen'
import RoleScreen from './Source/RoleScreen'
import AppHomepageScreen from './AppHomepageScreen'
import MenuDrawerScreenSP from './Source/Component/MenuDrawerScreenSP'
import MenuDrawerScreenResident from './Source/Component/MenuDrawerScreenResident'

import SignInResident from './Source/Resident/SignIn'
import DetailsScreen from './Source/Resident/DetailScreen'
import ResidentBuildingScreen from './Source/Resident/BuildingScreen'
import HomepageResident from './Source/Resident/Homepage'
import FollowScreen from './Source/Resident/FollowScreen'
import FeedbackScreen from './Source/Resident/FeedbackScreen'
import FeedbackReplyScreen from './Source/Resident/FeedbackReplyScreen'
import DetailServiceScreen from './Source/Resident/DetailServiceScreen'
import ListChatScreenResident from './Source/Resident/ListChatScreen'
import ChatScreenResident from './Source/Resident/ChatScreen'
import ListChatPublicGroupScreenResident from './Source/Resident/ListChatPublicGroupScreen'
import InformationScreenResident from './Source/Resident/InformationScreen'
import EditInfoScreenResident from './Source/Resident/EditInfoScreen'
import ListResidentScreen from './Source/Resident/ListResidentScreen'

import SignInProvider from './Source/ServiceProvider/SignIn'
import ServiceProviderBuildingScreen from './Source/ServiceProvider/BuildingScreen'
import HomepageServiceProvider from './Source/ServiceProvider/Homepage'
import CreatePostScreen from './Source/ServiceProvider/CreatePostScreen'
import ListChatScreenSP from './Source/ServiceProvider/ListChatScreen'
import ChatScreenSP from './Source/ServiceProvider/ChatScreen'
import DetailPostScreen from './Source/ServiceProvider/DetailPostScreen'
import CreateGroupChatScreen from './Source/ServiceProvider/CreateGroupChatScreen'
import EditPostScreen from './Source/ServiceProvider/EditPostScreen'
import InformationScreenSP from './Source/ServiceProvider/InformationScreen'
import EditInfoScreenSP from './Source/ServiceProvider/EditInfoScreen'

const ResidentChatStack = createMaterialTopTabNavigator(
  {
    ListChatResident: {
      screen: ListChatScreenResident,
      navigationOptions: {
        title: 'Chat'
      },
    },
    ListChatPublicScreen: {
      screen: ListChatPublicGroupScreenResident,
      navigationOptions: {
        title: 'Nhóm cộng đồng'
      },
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      showIcon: true,
      swipeEnabled: true,
      tabBarPosition: 'top',
    }),
    tabBarOptions: {
      showIcon: false,
      labelStyle: {
        fontSize: 18,
        top: -10,
        fontWeight: '900',
      },
      activeTintColor: '#f2a2dd',
      inactiveTintColor: 'white',
      style: {
        height: 40,
        backgroundColor: '#4593ed',
      },
    },
    navigationOptions: {
      header: null
    },
  }
);
const ResidentServiceStack = createMaterialTopTabNavigator(
  {
    Services: {
      screen: HomepageResident,
      navigationOptions: {
        title: 'Tòa nhà'
      },
    },
    FollowScreen: {
      screen: FollowScreen,
      navigationOptions: {
        title: 'Yêu thích'
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      showIcon: true,
      swipeEnabled: true,
      tabBarPosition: 'top',
    }),
    tabBarOptions: {
      showIcon: false,
      labelStyle: {
        fontSize: 18,
        top: -10,
        fontWeight: '900',
      },
      activeTintColor: 'black',
      inactiveTintColor: 'white',
      style: {
        height: 40,
        backgroundColor: '#ffd36e',
      },
    },
    navigationOptions: {
      header: null
    },
  }
);

const ResidentStack = createMaterialTopTabNavigator(
  {
    ChatResident: {
      screen: ResidentChatStack,
      navigationOptions: {
        title: 'Chat'
      },
    },
    ListResident: {
      screen: ListResidentScreen,
      navigationOptions: {
        title: 'Cư dân'
      },
    },
    Services: {
      screen: ResidentServiceStack,
      navigationOptions: {
        title: 'Dịch vụ'
      },
    },
    Feedback: {
      screen: FeedbackScreen,
      navigationOptions: {
        title: 'Phản hồi'
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      showIcon: true,
      swipeEnabled: true,
      tabBarPosition: 'bottom',
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Services') {
          iconName = "ios-bookmarks";
        } else if (routeName === 'ListResident') {
          iconName = "ios-people";
        } else if (routeName === 'Feedback') {
          iconName = "ios-water";
        } else if (routeName === 'ChatResident') {
          iconName = "ios-chatbubbles";
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      showIcon: true,
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: 'white',
      },
    },
    navigationOptions: {
      header: null
    },
  }
);


const ServiceProviderStack = createMaterialTopTabNavigator(
  {
    ListChatScreenSP: {
      screen: ListChatScreenSP,
      navigationOptions: {
        title: 'Chat'
      },
    },
    Services: {
      screen: HomepageServiceProvider,
      navigationOptions: {
        title: 'Dịch vụ'
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      swipeEnabled: true,
      tabBarPosition: 'bottom',
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Services') {
          iconName = "ios-bookmarks";
        } else if (routeName === 'ListChatScreenSP') {
          iconName = "ios-chatbubbles";
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      showIcon: true,
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: 'white',
      },
    },
    navigationOptions: {
      header: null
    },
  }
);

const WIDTH = Dimensions.get('window').width;

const ResidentDrawerConfig = {
  drawerWidth: WIDTH * 0.6,
}

const ResidentDrawer = createDrawerNavigator(
  {
    Home: {
      screen: ResidentStack,
      navigationOptions: {
        title: 'Trang chính',
        drawerIcon: ({ tintColor }) => (
          <Image
            source={require('./Source/Images/Menu-Icons/HomeDrawer.png')}
            style={[style = { height: 30, width: 30, }]}
          />
        ),
      }
    },
    InfoScreen: {
      screen: InformationScreenResident,
      navigationOptions: {
        title: 'Thông tin tài khoản',
        drawerIcon: ({ tintColor }) => (
          <Image
            source={require('./Source/Images/Menu-Icons/InformationScreen.png')}
            style={[style = { height: 30, width: 30, }]}
          />
        ),
      }
    },
  },
  {
    contentComponent: (props) => (
      <View style={{ flex: 1 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <ScrollView>
            <MenuDrawerScreenResident {...props} />

            <DrawerItems {...props} />
           
            <TouchableOpacity title="Tòa nhà" onPress={() =>
              props.navigation.navigate('ResidentBuilding')
            } >
              <View style={{
                flex: 1,
                flexDirection: 'row',
                height: 100
              }}>
                <Image style={{ marginLeft: 14, height: 30, width: 30, }} source={require('./Source/Images/Menu-Icons/building.png')} />
                <Text style={{ marginLeft: 29, marginTop: 10, fontWeight: 'bold', }}>Tòa nhà</Text>
              </View>

            </TouchableOpacity>

            <TouchableOpacity title="Logout" onPress={() =>
              Alert.alert(
                'Đăng xuất',
                'Bạn có muốn đăng xuất tài khoản?',
                [
                  { text: 'Hủy', onPress: () => { return null } },
                  {
                    text: 'Đồng ý', onPress: () => {
                      AsyncStorage.clear();
                      props.navigation.navigate('SignInScreen')
                    }
                  },
                ],
                { cancelable: false }
              )
            } >
              <Text style={{ margin: 16, fontWeight: 'bold', color: 'blue', }}>Đăng xuất</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    ),
    contentOptions: {
      activeTintColor: '#ff94d4',
      drawerOpenRoute: 'DrawerOpen',
      drawerCloseRoute: 'DrawerClose',
      drawerToggleRoute: 'DrawerToggle',
    },
  },
);

const ServiceProviderDrawer = createDrawerNavigator(
  {
    HomeDrawerSP: {
      screen: ServiceProviderStack,
      navigationOptions: {
        title: 'Trang chính',
        drawerIcon: ({ tintColor }) => (
          <Image
            source={require('./Source/Images/Menu-Icons/HomeDrawer.png')}
            style={[style = { height: 30, width: 30, }]}
          />
        ),
      }
    },
    InformationScreenSP: {
      screen: InformationScreenSP,
      navigationOptions: {
        title: 'Thông tin tài khoản',
        drawerIcon: ({ tintColor }) => (
          <Image
            source={require('./Source/Images/Menu-Icons/InformationScreen.png')}
            style={[style = { height: 30, width: 30, }]}
          />
        ),
      }
    },
  },
  {
    contentComponent: (props) => (
      <View style={{ flex: 1 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <ScrollView>
            <MenuDrawerScreenSP {...props} />

            <DrawerItems {...props} />

            <TouchableOpacity title="Tòa nhà" onPress={() =>
              props.navigation.navigate('ServiceProviderBuilding')
            } >
              <View style={{
                flex: 1,
                flexDirection: 'row',
                height: 100
              }}>
                <Image style={{ marginLeft: 14, height: 30, width: 30, }} source={require('./Source/Images/Menu-Icons/building.png')} />
                <Text style={{ marginLeft: 29, marginTop: 10, fontWeight: 'bold', }}>Tòa nhà</Text>
              </View>

            </TouchableOpacity>

            <TouchableOpacity title="Logout" onPress={() =>
              Alert.alert(
                'Đăng xuất',
                'Bạn có muốn đăng xuất tài khoản?',
                [
                  { text: 'Hủy', onPress: () => { return null } },
                  {
                    text: 'Đồng ý', onPress: () => {
                      AsyncStorage.clear();
                      props.navigation.navigate('SignInScreen')
                    }
                  },
                ],
                { cancelable: false }
              )
            } >

              <Text style={{ margin: 16, fontWeight: 'bold', color: 'brown', }}>Đăng xuất</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    ),
    contentOptions: {
      activeTintColor: '#ff94d4',
      drawerOpenRoute: 'DrawerOpen',
      drawerCloseRoute: 'DrawerClose',
      drawerToggleRoute: 'DrawerToggle',
    },
  },
);

const AppStack = createStackNavigator(
  {
    SignInScreen: {
      screen: SignInScreen,
    },
    AsyncLoginScreen:{
      screen: AsyncLoginScreen,
    },
    RoleAuthScreen:{
      screen: RoleAuthScreen,
    },
    RoleScreen: {
      screen: RoleScreen,
    },
    AppHomePage: {
      screen: AppHomepageScreen,
    },
    Details: {
      screen: DetailsScreen,
    },

    //Resident
    SignInResident: {
      screen: SignInResident,
    },
    HomepageResidentDrawer: {
      screen: ResidentDrawer,
      navigationOptions: {
        header: null
      }
    },
    HomepageResident: {
      screen: ResidentStack
    },
    ResidentBuilding: {
      screen: ResidentBuildingScreen,
    },
    FeedbackReplyScreen: {
      screen: FeedbackReplyScreen,
    },
    DetailServiceScreen: {
      screen: DetailServiceScreen,
    },
    ChatScreenResident: {
      screen: ChatScreenResident,
    },
    EditInfoScreenResident: {
      screen: EditInfoScreenResident,
    },

    //Service Provider
    SignInProvider: {
      screen: SignInProvider,
    },
    ServiceProviderBuilding: {
      screen: ServiceProviderBuildingScreen,
    },
    HomepageSPdrawer: {
      screen: ServiceProviderDrawer,
      navigationOptions: {
        header: null,
      }
    },
    HomepageProvider: {
      screen: ServiceProviderStack,
    },
    CreatePostScreen: {
      screen: CreatePostScreen,
    },
    ChatScreenSP: {
      screen: ChatScreenSP,
    },
    CreateGroupChatScreen: {
      screen: CreateGroupChatScreen,
    },
    DetailPostScreen: {
      screen: DetailPostScreen,
    },
    EditPostScreen: {
      screen: EditPostScreen,
    },
    EditInfoScreenSP: {
      screen: EditInfoScreenSP,
    },
  },
  {
    initialRouteName: 'AsyncLoginScreen',
    //initialRouteName: 'RoleAuthScreen',
  }
);

const AuthStack = createStackNavigator({ SignInScreen: SignInScreen });

const AuthSwwitch = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
); 

const AppContainer = createAppContainer(AuthSwwitch);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}