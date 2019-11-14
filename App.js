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
import MenuDrawerScreenBA from './Source/Component/MenuDrawerScreenBA'
import MenuDrawerScreenSV from './Source/Component/MenuDrawerScreenSV'

import SignInResident from './Source/RC/Resident/SignIn'
import DetailsScreen from './Source/RC/Resident/DetailScreen'
import ResidentBuildingScreen from './Source/RC/Resident/BuildingScreen'
import HomepageResident from './Source/RC/Resident/Homepage'
import FollowScreen from './Source/RC/Resident/FollowScreen'
import FeedbackScreenResident from './Source/RC/Resident/FeedbackScreen'
import FeedbackReplyScreenResident from './Source/RC/Resident/FeedbackReplyScreen'
import DetailServiceScreen from './Source/RC/Resident/DetailServiceScreen'
import ListChatScreenResident from './Source/RC/Resident/ListChatScreen'
import ChatScreenResident from './Source/RC/Resident/ChatScreen'
import ListChatPublicGroupScreenResident from './Source/RC/Resident/ListChatPublicGroupScreen'
import InformationScreenResident from './Source/RC/Resident/InformationScreen'
import EditInfoScreenResident from './Source/RC/Resident/EditInfoScreen'
import ListResidentScreenResident from './Source/RC/Resident/ListResidentScreen'
import CreateGroupChatScreenResident from './Source/RC/Resident/CreateGroupChatScreen'

import SignInProvider from './Source/RC/ServiceProvider/SignIn'
import ServiceProviderBuildingScreen from './Source/RC/ServiceProvider/BuildingScreen'
import HomepageServiceProvider from './Source/RC/ServiceProvider/Homepage'
import CreatePostScreen from './Source/RC/ServiceProvider/CreatePostScreen'
import ListChatScreenSP from './Source/RC/ServiceProvider/ListChatScreen'
import ChatScreenSP from './Source/RC/ServiceProvider/ChatScreen'
import DetailPostScreen from './Source/RC/ServiceProvider/DetailPostScreen'
import CreateGroupChatScreenSP from './Source/RC/ServiceProvider/CreateGroupChatScreen'
import EditPostScreen from './Source/RC/ServiceProvider/EditPostScreen'
import InformationScreenSP from './Source/RC/ServiceProvider/InformationScreen'
import EditInfoScreenSP from './Source/RC/ServiceProvider/EditInfoScreen'

import BuildingAdministratorBuildingScreen from './Source/RC/BuildingAdministrator/BuildingScreen'
import HomepageBuildingAdministrator from './Source/RC/BuildingAdministrator/Homepage'
import FeedbackScreenBuildingAdministrator from './Source/RC/BuildingAdministrator/FeedbackScreen'
import FeedbackReplyScreenBuildingAdministrator from './Source/RC/BuildingAdministrator/FeedbackReplyScreen'
import ListChatScreenBuildingAdministrator from './Source/RC/BuildingAdministrator/ListChatScreen'
import ChatScreenBA from './Source/RC/BuildingAdministrator/ChatScreen'
import CreatePrivateGroupChatScreenBA from './Source/RC/BuildingAdministrator/CreatePrivateGroupChatScreen'
import CreatePublicGroupChatScreenBA from './Source/RC/BuildingAdministrator/CreatePublicGroupChatScreen'
import InformationScreenBA from './Source/RC/BuildingAdministrator/InformationScreen'
import EditInfoScreenBuildingAdministrator from './Source/RC/BuildingAdministrator/EditInfoScreen'
import ListResidentScreenBA from './Source/RC/BuildingAdministrator/ListResidentScreen'
import ListSPScreenBA from './Source/RC/BuildingAdministrator/ListSPScreen'
import DetailServiceScreenBA from './Source/RC/BuildingAdministrator/DetailServiceScreen'
import ListResidentRegisterScreen from './Source/RC/BuildingAdministrator/ListResidentRegisterScreen'
import ListSPRegisterScreen from './Source/RC/BuildingAdministrator/ListSPRegisterScreen'

import HomepageSupervisor from './Source/RC/Supervisor/Homepage'
import FeedbackReplyScreenSV from './Source/RC/Supervisor/FeedbackReplyScreen'
import ChatScreenSV from './Source/RC/Supervisor/ChatScreen'
import ListChatScreenSV from './Source/RC/Supervisor/ListChatScreen'
import CreatePrivateGroupChatScreenSV from './Source/RC/Supervisor/CreatePrivateGroupChatScreen'
import CreatePublicGroupChatScreenSV from './Source/RC/Supervisor/CreatePublicGroupChatScreen'
import InformationScreenSV from './Source/RC/Supervisor/InformationScreen'
import EditInfoScreenSV from './Source/RC/Supervisor/EditInfoScreen'

// const ResidentChatStack = createMaterialTopTabNavigator(
//   {
//     ListChatResident: {
//       screen: ListChatScreenResident,
//       navigationOptions: {
//         title: 'Chat'
//       },
//     },
//     ListChatPublicScreen: {
//       screen: ListChatPublicGroupScreenResident,
//       navigationOptions: {
//         title: 'Nhóm cộng đồng'
//       },
//     }
//   },
//   {
//     defaultNavigationOptions: ({ navigation }) => ({
//       showIcon: true,
//       swipeEnabled: true,
//       tabBarPosition: 'top',
//     }),
//     tabBarOptions: {
//       showIcon: false,
//       labelStyle: {
//         fontSize: 18,
//         top: -10,
//         fontWeight: '900',
//       },
//       activeTintColor: '#f2a2dd',
//       inactiveTintColor: 'white',
//       style: {
//         height: 40,
//         backgroundColor: '#4593ed',
//       },
//     },
//     navigationOptions: {
//       header: null
//     },
//   }
// );
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
    // ChatResident: {
    //   screen: ResidentChatStack,
    //   navigationOptions: {
    //     title: 'Chat'
    //   },
    // },
    ChatResident: {
      screen: ListChatScreenResident,
      navigationOptions: {
        title: 'Chat'
      },
    },
    ListResident: {
      screen: ListResidentScreenResident,
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
      screen: FeedbackScreenResident,
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
          iconName = "ios-paper";
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

const BuildingAdministratorStack = createMaterialTopTabNavigator(
  {
    ListChatScreenBuildingAmin: {
      screen: ListChatScreenBuildingAdministrator,
      navigationOptions: {
        title: 'Chat'
      },
    },
    Dashboard: {
      screen: HomepageBuildingAdministrator,
      navigationOptions: {
        title: 'Quản lí'
      },
    },
    Feedback: {
      screen: FeedbackScreenBuildingAdministrator,
      navigationOptions: {
        title: 'Phản hồi'
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
        if (routeName === 'ListChatScreenBuildingAmin') {
          iconName = "ios-chatbubbles";
        } else if (routeName === 'Dashboard') {
          iconName = "ios-stats";
        } else if (routeName === 'Feedback') {
          iconName = "ios-paper";
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

const SupervisorStack = createMaterialTopTabNavigator(
  {
    ListChatScreenSV: {
      screen: ListChatScreenSV,
      navigationOptions: {
        title: 'Chat'
      },
    },
    HomepageSupervisor: {
      screen: HomepageSupervisor,
      navigationOptions: {
        title: 'Phản hồi'
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
        if (routeName === 'ListChatScreenSV') {
          iconName = "ios-chatbubbles";
        } else if (routeName === 'HomepageSupervisor') {
          iconName = "ios-paper";
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

const BuildingAdministratorDrawer = createDrawerNavigator(
  {
    HomeDrawerBA: {
      screen: BuildingAdministratorStack,
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
    InformationScreenBA: {
      screen: InformationScreenBA,
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
            <MenuDrawerScreenBA {...props} />

            <DrawerItems {...props} />

            <TouchableOpacity title="Tòa nhà" onPress={() =>
              props.navigation.navigate('BuildingAdministratorBuilding')
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

const SupervisorDrawer = createDrawerNavigator(
  {
    Home: {
      screen: SupervisorStack,
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
      screen: InformationScreenSV,
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
            <MenuDrawerScreenSV {...props} />

            <DrawerItems {...props} />

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
    FeedbackReplyScreenResident: {
      screen: FeedbackReplyScreenResident,
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
    CreateGroupChatScreenResident: {
      screen: CreateGroupChatScreenResident,
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
    CreateGroupChatScreenSP: {
      screen: CreateGroupChatScreenSP,
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

    //Building Admin
    BuildingAdministratorBuilding: {
      screen: BuildingAdministratorBuildingScreen,
    },
    HomepageBAdrawer: {
      screen: BuildingAdministratorDrawer,
      navigationOptions: {
        header: null,
      }
    },
    HomepageBuildingAdministrator: {
      screen: BuildingAdministratorStack,
    },
    ChatScreenBA: {
      screen: ChatScreenBA,
    },
    CreatePrivateGroupChatScreenBA: {
      screen: CreatePrivateGroupChatScreenBA,
    },
    CreatePublicGroupChatScreenBA: {
      screen: CreatePublicGroupChatScreenBA,
    },
    FeedbackScreenBuildingAdministrator: {
      screen: FeedbackScreenBuildingAdministrator,
    },
    FeedbackReplyScreenBuildingAdministrator: {
      screen: FeedbackReplyScreenBuildingAdministrator,
    },
    EditInfoScreenBuildingAdministrator: {
      screen: EditInfoScreenBuildingAdministrator,
    },
    ListResidentScreenBA: {
      screen: ListResidentScreenBA,
    },
    ListSPScreenBA: {
      screen: ListSPScreenBA,
    },
    DetailServiceScreenBA: {
      screen: DetailServiceScreenBA,
    },
    ListResidentRegisterScreen: {
      screen: ListResidentRegisterScreen,
    },
    ListSPRegisterScreen: {
      screen: ListSPRegisterScreen,
    },

    //Supervisor
    HomepageSVdrawer: {
      screen: SupervisorDrawer,
      navigationOptions: {
        header: null,
      }
    },
    FeedbackReplyScreenSV: {
      screen: FeedbackReplyScreenSV,
    },
    EditInfoScreenSV: {
      screen: EditInfoScreenSV,
    },
    ChatScreenSV: {
      screen: ChatScreenSV,
    },
    ListChatScreenSV: {
      screen: ListChatScreenSV,
    },
    CreatePrivateGroupChatScreenSV: {
      screen: CreatePrivateGroupChatScreenSV,
    },
    CreatePublicGroupChatScreenSV: {
      screen: CreatePublicGroupChatScreenSV,
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