
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  PixelRatio,
  Dimensions,
  Linking,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import Post from './post';
import { IconButton, Avatar, Dialog, Portal, Button, List, Colors } from 'react-native-paper';
import bearLogoImport from "./assets/reddit-logo-2.jpg"
import {api} from './App'

const bearLogo = Image.resolveAssetSource(bearLogoImport).uri;

export default class Subreddit extends Component {

  constructor(props) {
    super(props);
    this.filter = 'best';
    this.iconFilter = new Map();
    this.iconFilter.set("best", "rocket-outline");
    this.iconFilter.set("hot", "fire");
    this.iconFilter.set("new", "decagram-outline");
    this.iconFilter.set("top", "escalator-up");
    this.iconFilter.set("rising", "finance");
    this.state = {
      data: props.route.params.data["data"],
      subscribe: props.route.params.data["data"]["user_is_subscriber"],
      json: null,
      loaded: false
    }
    this.fetchData();
  }

  async fetchData() {
    this.setState({json: await (await api.requestApi("GET", `/r/${this.state.data["display_name"]}/` + this.filter)).json(),
      loaded: true});
  }

  handleSuscribe() {
    if (!this.state.subscribe)
      api.requestApi("POST", `/api/subscribe?action=sub&sr=${this.state.data["name"]}`);
    else
      api.requestApi("POST", `/api/subscribe?action=unsub&sr=${this.state.data["name"]}`);
    this.setState({subscribe: !this.state.subscribe})
  }

  fetchPost = async () => {
    this.setState({json: null, loaded: false})
    this.setState({json: await (await api.requestApi("GET", `/r/${this.state.data["display_name"]}/` + this.filter)).json(), loaded: true});
  }

  setFilter = (filter) => {
    this.filter = filter;
    this.fetchPost();
  }

  Filter = () => {
    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    return (
        <View>
          <Button icon={this.iconFilter.get(this.filter)} style={{alignItems: 'flex-start', margin: 0}} color={Colors.grey700} onPress={showDialog}>Filter</Button>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Content>
                <Text style={{borderBottomWidth: 1, borderBottomColor: 'gray', fontSize: 14}}>FILTER PUBLICATION BY</Text>
                <View style={{marginLeft: -20}}>
                  <List.Item
                    title="Best"
                    onPress={() => {this.setFilter("best"); hideDialog()}}
                    left={props => <List.Icon {...props} icon="rocket-outline" />}
                  />
                  <List.Item
                    title="Popular"
                    onPress={() => {this.setFilter("hot"); hideDialog()}}
                    left={props => <List.Icon {...props} icon="fire" />}
                  />
                  <List.Item
                    title="New"
                    onPress={() => {this.setFilter("new"); hideDialog()}}
                    left={props => <List.Icon {...props} icon="decagram-outline" />}
                  />
                  <List.Item
                    title="Top"
                    onPress={() => {this.setFilter("top"); hideDialog()}}
                    left={props => <List.Icon {...props} icon="escalator-up" />}
                  />
                  <List.Item
                    title="Rising"
                    onPress={() => {this.setFilter("rising"); hideDialog()}}
                    left={props => <List.Icon {...props} icon="finance" />}
                  />
                </View>
                <Button mode="contained" color={Colors.grey100}onPress={hideDialog}>Close</Button>
              </Dialog.Content>
            </Dialog>
          </Portal>
        </View>
    );
  };

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
            {this.state.data["banner_img"] == "" ? (<View style={{backgroundColor: this.state.data["key_color"] == "" ? "blue" : this.state.data["key_color"], width: '120%', height: 100,}}/>)
            : (<Image style={styles.bannerImg} source={{uri: this.state.data["banner_img"]}}/>)}
            <View style={{position: 'absolute', display:'flex'}}>
              <IconButton style={styles.back} icon='arrow-left-bold' size={50} color={"#ffffff"} onPress={() => this.props.navigation.replace("SearchSub")}/>
              <Avatar.Image style={styles.logoImg} size={60} source={{uri: this.state.data["icon_img"] == "" ? bearLogo : this.state.data["icon_img"]}} />
            </View>
            <View style={styles.subInfo}>
              <View style={{justifyContent: 'space-between', flexDirection:'row'}}>
                <Text style={{color: '#292727', fontWeight: "500", fontSize: 16}}>{this.state.data["title"]}</Text>
                <Button style={{marginTop: -10, marginRight: 15}} mode="contained" onPress={() => this.handleSuscribe()}>{this.state.subscribe ? "Leave" : "Join"}</Button>
              </View>
              <Text style={styles.subMember}>{this.state.data["subscribers"]} membres</Text>
              <Text style={styles.description}>{this.state.data["public_description"]}</Text>
            </View>
        </View>
        {this.state.loaded ? (
            <View>
              <this.Filter/>
              <Post data={this.state.json.data.children}/>
            </View>
          ) : (
            <ActivityIndicator />
          )}
      </SafeAreaView>
        );
  }
}

const styles = StyleSheet.create({
  container: {
      display: 'flex'
  },
  bannerImg: {
      width: '120%',
      height: 100,
  },
  logoImg: {
    marginLeft: 5,
    marginTop: -20
  },
  back: {
      transform: [{ scale: 0.8 }],
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
  },
  subInfo: {
    marginTop: 35,
    marginLeft: 10
  },
  subMember: {
    marginTop: 15
  },
  description: {
    color: '#292727',
    marginTop: 5,
  }
});