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
} from "react-native";

import { api } from "./App";
import bearLogoImport from "./assets/reddit-logo-2.jpg";

const bearLogo = Image.resolveAssetSource(bearLogoImport).uri;

export default class ContactsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      search: "",
      typingTimeout: 0,
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  onClickListener = async (viewId) => {
    const data = await (await api.requestApi("GET", "/r/" + viewId + "/about")).json()
    this.props.navigation.replace("Subreddit", { data: data });
  };

  async searchData() {
    const json = await (
      await api.requestApi(
        "GET",
        `/api/subreddit_autocomplete?query=${this.state.search}`
      )
    ).json();
    this.setState({ data: json["subreddits"] });
  }

  handleSearch(valueToSearch) {
    const self = this;

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      search: valueToSearch,
      typingTimeout: setTimeout(function () {
        self.searchData();
      }, 500),
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formContent}>
          <View style={styles.inputContainer}>
            <Image
              style={[styles.icon, styles.inputIcon]}
              source={{
                uri: "https://png.icons8.com/search/androidL/100/000000",
              }}
            />
            <TextInput
              style={styles.inputs}
              ref={"txtPassword"}
              placeholder="Search"
              underlineColorAndroid="transparent"
              onChangeText={(name_address) => this.handleSearch(name_address)}
            />
          </View>
        </View>

        <FlatList
          style={styles.notificationList}
          data={this.state.data}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({ item }) => {
            if (item.name.startsWith("u_") == false) {
            return (
              <TouchableOpacity onPress={() => this.onClickListener(item["name"])}>
                <View style={styles.notificationBox}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.icon ? item.icon : (item.communityIcon) ? item.communityIcon : bearLogo,
                    }}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.description}>
                      Member: {item.numSubscribers}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
  },
  formContent: {
    flexDirection: "row",
    marginTop: 30,
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    margin: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconBtnSearch: {
    alignSelf: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: "center",
  },
  notificationList: {
    marginTop: 20,
    padding: 10,
  },
  notificationBox: {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 10,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 10,
    alignSelf: "center",
  },
  description: {
    fontSize: 15,
    color: "#909191",
    marginLeft: 10,
    alignSelf: "center",
  },
});
