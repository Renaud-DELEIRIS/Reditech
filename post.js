
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
  Linking
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { IconButton } from 'react-native-paper';
import { api } from './App';

const SimplePost = (props) => {
  const [data, setData] = React.useState(props.data);
  const [like, setLike] = React.useState(data["likes"])
  const [up, setUp] = React.useState(data["ups"])

  const PostContent = (props) => {
    const item = props.item;
    if (typeof(item["url_overridden_by_dest"]) === "undefined") {
      return (
      <View>
        <Text style={styles.content}>{item["selftext"]}</Text>
      </View>
      );
    }
    if (item["is_video"] === true) {
      return (
          <VideoPlayer
              video={{ uri: item["media"]["reddit_video"]["scrubber_media_url"] }}
              videoWidth={item["media"]["reddit_video"]["width"]}
              videoHeight={item["media"]["reddit_video"]["height"]}
              thumbnail={{ uri: item["thumbnail"] }}
              useNativeControls
          />
      );
    }
    if (item["post_hint"] === "image") {
      return (
          <Image style={{height: Dimensions.get('screen').height / 2, width: Dimensions.get('window').width}} source={{uri: item["url_overridden_by_dest"]}}/>
      );
    }
    if (item["post_hint"] === "link") {
      return (
        <Text style={{color: 'blue'}}
              onPress={() => Linking.openURL(item["url_overridden_by_dest"])}>
          {item["url_overridden_by_dest"]}
        </Text>
      );
    }
    return (<Text>Not handled post</Text>)
  }

  const handleUpClick = () => {
    let id = data["name"];
    if (like === null || like === false) {
      api.requestApi("POST", `/api/vote?dir=1&id=${id}`);
      setLike(true);
      if (like === null)
        setUp(up + 1);
      else
        setUp(up + 2)
    }
    else {
      api.requestApi("POST", `/api/vote?dir=0&id=${id}`);
      setLike(null);
      setUp(up - 1)
    }
  }

  const handleDownClick = () => {
    let id = data["name"];
    if (like === null || like == true) {
      api.requestApi("POST", `/api/vote?dir=-1&id=${id}`);
      setLike(false);
      if (like === null)
      setUp(up - 1);
    else
      setUp(up - 2)
    }
    else {
      api.requestApi("POST", `/api/vote?dir=0&id=${id}`);
      setLike(null);
      setUp(up + 1)
    }
  }

  return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
            <View style={styles.info}>
                {/* <Image style={styles.infoImg} source={{uri: item.icon}}/> */}
                <Text style={styles.infoText}>{data["subreddit_name_prefixed"]} created by: {data["author"]}</Text>
            </View>
            <View style={styles.title}>
                <Text style={{color: 'black', fontWeight: "700", fontSize: 16}}>{data["title"]}</Text>
            </View>
            <PostContent item={data}></PostContent>
        </View>
        <View style={styles.buttonBar}>
          <View style={styles.upvote}>
            <IconButton size={20} color={"#292727"} onPress={() => handleUpClick(data)} icon={((like == true) ? "arrow-up-bold" : "arrow-up-bold-outline")}/>
            <Text style={{marginTop: 10}}>{up}</Text>
            <IconButton size={20} color={"#292727"} onPress={() => handleDownClick(data)}  icon={((like == false) ? "arrow-down-bold" : "arrow-down-bold-outline")}/>
          </View>
          <View style={styles.comment}>
            <IconButton size={20} color={"#292727"} icon="comment-outline"/>
            <Text style={{marginTop: 10}}>{data["num_comments"]}</Text>
          </View>
        </View>
      </View>
  );
}

export default class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }
  _renderPost = ({ item }) => {
    return (
      <SimplePost data={item["data"]}/>
    );
  };

  render() {
    return (
      <View style={styles.post}>
        <FlatList
            style={styles.notificationList}
            extraData={this.state.data}
            data={this.state.data}
            renderItem={this._renderPost}/>
      </View>
        );
  }
}

const styles = StyleSheet.create({
  post: {
    marginTop: 0,
  },
  container: {
    marginBottom: 10,
    padding: 5,
    position: 'relative',
    backgroundColor: '#ffff',
    verticalAlign: 'baseline',
    justifyContent: 'center',
  },
  buttonBar: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 5,
  },
  upvote: {
    display: 'flex',
    flexDirection: 'row',
  },
  comment: {
    marginLeft: 40,
    display: 'flex',
    flexDirection: 'row',
  },
  textContainer: {
        background: '#fff',
        position: 'relative',
        paddingTop: 2.84,
        fontSize: '100%',
        verticalAlign: 'baseline',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 2,
  },
  info: {
    marginTop: 0,
    marginRight: 2.84,
    marginBottom: 2.84,
    marginLeft: 2.84,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
  },
  infoImg: {
    alignItems: 'flex-start',
    height: 15,
    marginRight: 1.42,
    width: 15,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 2
  },
  title: {
    padding: 0,
    border: 0,
    marginBottom: 5,
    verticalAlign: 'baseline',
    position: 'relative',
    textDecoration: 'none',
    wordBreak: 'break-work',
 },
 content: {
    marginTop: 3,
    color: 'black',
    fontWeight: "400",
    // padding: '5 8 10',
 },
 backgroundVideo: {
  position: 'absolute',
},
});