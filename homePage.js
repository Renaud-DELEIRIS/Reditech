import React, { Component } from "react";
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
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Post from './post';
import { api } from './App';
import { IconButton, Avatar, Dialog, Portal, Button, List, Colors } from 'react-native-paper';
import { thisExpression } from '@babel/types';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.loaded = false;
    this.filter = "best"
    this.state = { loaded: false, json: null, user: null};
    this.Filter = this.Filter.bind(this);
    this.fetchData();
    this.post = React.createRef();
    this.iconFilter = new Map();
    this.iconFilter.set("best", "rocket-outline");
    this.iconFilter.set("hot", "fire");
    this.iconFilter.set("new", "decagram-outline");
    this.iconFilter.set("top", "escalator-up");
    this.iconFilter.set("rising", "finance");
  }

  async fetchData() {
    this.setState({json: await (await api.requestApi("GET", "/" + this.filter)).json(),
    user: await (await api.requestApi("GET", "/api/v1/me")).json(),
      loaded: true});
  }

  fetchPost = async () => {
    this.setState({json: await (await api.requestApi("GET", "/" + this.filter)).json(), loaded: true});
    this.post.current.setState({data: null});
    this.post.current.setState({data: this.state.json.data.children});
  }

  setFilter = (filter) => {
    this.filter = filter;
    this.fetchPost();
  }

  Filter() {
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
        <View>
          {this.state.loaded ? (
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor:'#fff', justifyContent: 'space-between'}}>
                <Text style={{marginLeft: 30}}>Karma: {this.state.user["total_karma"]}</Text>
                <View>
                  <Avatar.Image source={{uri: this.state.user["icon_img"]}}/>
                  <Text>{this.state.user["name"]}</Text>
                </View>
                <Text style={{marginRight: 30}}>Coins: {this.state.user["coins"]}</Text>
              </View>
              <this.Filter/>
              <Post ref={this.post} data={this.state.json.data.children}/>
            </View>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
