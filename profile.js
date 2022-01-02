import React, { Component } from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { Switch } from "react-native-paper";
import { api } from "./App";
import { ActivityIndicator } from "react-native";

const MyComponent = (props) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(
    props.settings[props.settingsJson]
  );
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    props.settings[props.settingsJson] = !isSwitchOn;
    const jsonToString = JSON.stringify(
      props.settings,
      Object.keys(props.settings).sort()
    );
    api.requestPatchApi("/api/v1/me/prefs", jsonToString);
  };
  return (
    <View style={styles.button}>
      <View style={styles.buttonText}>
        <Text style={styles.buttonTextTitle}>{props.name}</Text>
        <Text style={styles.buttonTextDescription}>{props.description}</Text>
      </View>
      <View style={styles.buttonSwitch}>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      </View>
    </View>
  );
};

function updateSettings(jsonSettings) {
  const jsonToString = JSON.stringify(ret, Object.keys(ret).sort());
  api.requestPatchApi("/api/v1/me/prefs", jsonToString);
}

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.fetchData();
    this.state = {
      loaded: false,
      profileSettings: null,
      profile: null,
      data: [
        {
          id: 1,
          name: "Adult content",
          json: "over_18",
          description:
            "Enable to view adult and NSFW (not safe for work) content in your feed and search results",
        },
        {
          id: 2,
          name: "Allow people to follow you",
          json: "enable_followers",
          description:
            "Followers will be notified about posts you make to your profile and see them in their home feed.",
        },
        {
          id: 3,
          name: "Show up in search results",
          json: "hide_from_robots",
          description:
            "Allow search engines like Google to link to your profile in their search results.",
        },
        {
          id: 4,
          name: "Personalize all of Reddit based on the outbound links you click on",
          json: "allow_clicktracking",
          description:
            "Allow us to use the links to other sites you click on for operational purposes (that help us better understand how you and others use Reddit) and to show you better ads and recommendations.",
        },
        {
          id: 5,
          name: "Personalize recommendations based on your general location",
          json: "show_location_based_recommendations",
          description:
            "Allow us to use your city, state, or country (based on your IP) to recommend better posts and communities.",
        },
        {
          id: 6,
          name: "Personalize ads based on information from our partners",
          json: "third_party_site_data_personalized_content",
          description:
            "Allow us to use information that our advertising partners send us to show you better ads.",
        },
        {
          id: 7,
          name: "",
          json: "allow_clicktracking",
          description:
            "",
        },
      ],
    };
  }

  fetchData = async () => {
    this.setState({
      profileSettings: await (
        await api.requestApi("GET", "/api/v1/me/prefs")
      ).json(),
      profile: await (await api.requestApi("GET", "/api/v1/me")).json(),
      loaded: true,
    });
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
              <Image
                style={styles.backgroundImage}
                source={{
                  uri: this.state.profile["subreddit"]["banner_img"].substring(0, this.state.profile["subreddit"]["banner_img"].indexOf('?')),
                }}
              />
            <View style={styles.headerContent}>
              <Image
                style={styles.avatar}
                source={{
                  uri: this.state.profile["icon_img"],
                }}
              />
              <Text style={styles.name}>{this.state.profile["name"]}</Text>
              <Text style={styles.userInfo}>
                {this.state.profile["subreddit"]["public_description"]}
              </Text>
            </View>
          </View>

          <View style={styles.body}>
            <FlatList
              data={this.state.data}
              keyExtractor={(item) => {
                return item.id;
              }}
              renderItem={({ item }) => {
                return (
                  <MyComponent
                    name={item.name}
                    description={item.description}
                    settingsJson={item.json}
                    settings={this.state.profileSettings}
                  />
                );
              }}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#DCDCDC",
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "600",
  },
  userInfo: {
    fontSize: 16,
    color: "#778899",
    fontWeight: "600",
  },
  body: {
    backgroundColor: "white",
    height: 500,
    alignItems: "flex-start",
  },
  item: {
    flexDirection: "row",
  },
  infoContent: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 5,
  },
  iconContent: {
    flex: 1,
    alignItems: "flex-start",
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: "#FFFFFF",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonText: {
    display: "flex",
    flexDirection: "column",
    marginRight: 8,
    maxWidth: "80%",
    marginLeft: 8,
  },
  buttonTextTitle: {
    display: "flex",
    alignItems: "center",
  },
  buttonTextDescription: {
    display: "flex",
    fontWeight: "400",
    color: "#7c7c7c",
    fontSize: 12,
    lineHeight: 16,
  },
  buttonSwitch: {
    justifyContent: "flex-end",
    flexGrow: 1,
    marginRight: "5%",
    justifyContent: "center",
  },
});
