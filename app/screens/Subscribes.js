import React, {Component} from 'react';
import {
  Image,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import {connect} from 'react-redux';

import * as FeedActions from '../reducers/feed/actions';
import * as SubscribeActions from '../reducers/subscribe/actions';

class Subscribes extends Component {
  constructor(props) {
    super(props);

    let dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      items: [],
      dataSource: dataSource,
      isRefreshing: true,
      selectedSubscribeId: undefined
    };
  }

  componentDidMount() {
    this.props.dispatch(SubscribeActions.get());
  }

  componentWillReceiveProps(nextProps) {
    let items = [];
    nextProps.subscribe.items.map((item) => {
      items.push({
        feedlink: item.feedlink,
        folder: item.folder,
        icon: item.icon,
        link: item.link,
        modified_on: item.modified_on,
        public: item.public,
        rate: item.rate,
        subscribe_id: item.subscribe_id,
        subscribers_count: item.subscribers_count,
        tags: item.tags,
        title: item.title,
        unread_count: item.unread_count
      });
    });

    this.setState({
      items: items,
      dataSource: this.state.dataSource.cloneWithRows(items),
      isRefreshing: false
    });
  }

  render() {
    return (
      <ListView
        style={styles.container}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        contentInset={{top: 30, right: 0, bottom: 0, left: 0}}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props}/>}
        refreshControl={<RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh.bind(this)}
          tintColor="#ffffff"
          />}
        />
    );
  }

  _renderRow(rowData, sectionId, rowId, highlightRow) {
    return (
      <TouchableHighlight
        underlayColor='#3e1c1c'
        style={styles.row}
        onPress={() => {
          this._pressRow(rowData, rowId);
          highlightRow(sectionId, rowId);
        }}>
        <View
          style={[styles.wrapper, this.state.selectedSubscribeId === rowData.subscribe_id && styles.activeRow]}>
          <Image
            style={styles.icon}
            source={{uri: rowData.icon}}
            />
          <Text
            style={styles.title}
            >{rowData.title}</Text>
          <Text
            style={styles.unreadcount}
            >{rowData.unread_count}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    });

    this.props.dispatch(SubscribeActions.get());
  }

  _pressRow(rowData, rowId) {
    let items = JSON.parse(JSON.stringify(this.state.items)); // evil
    items.map((item, index) => {
      if (rowData.subscribe_id === item.subscribe_id) {
        items[index].unread_count = 0;
      }
    });

    const item = this.state.dataSource.getRowData(0, rowId);
    this.props.dispatch(FeedActions.get({
      feedlink: item.feedlink,
      folder: item.folder,
      icon: item.icon,
      link: item.link,
      modified_on: item.modified_on,
      public: item.public,
      rate: item.rate,
      subscribe_id: item.subscribe_id,
      subscribers_count: item.subscribers_count,
      tags: item.tags,
      title: item.title,
      unread_count: item.unread_count
    }));

    this.setState({
      items: items,
      dataSource: this.state.dataSource.cloneWithRows(items),
      selectedSubscribeId: rowData.subscribe_id
    });

    this.props.navigator.toggleDrawer({
      side: 'left',
      animated: true
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#813c3a'
  },
  header: {
    height: 60,
    paddingTop: 20
  },
  row: {
    height: 30,
    marginTop: 4,
    marginRight: 10,
    marginBottom: 4,
    marginLeft: 10,
    borderRadius: 3
  },
  activeRow: {
    backgroundColor: '#f39f41',
    borderRadius: 3
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  },
  icon: {
    width: 16,
    height: 16,
    marginTop: 7,
    marginRight: 10,
    marginLeft: 8,
    resizeMode: 'cover'
  },
  title: {
    flex: 3,
    alignItems: 'flex-start',
    marginTop: 7,
    marginBottom: 7,
    color: '#ffffff',
    lineHeight: 16,
    textAlign: 'left'
  },
  unreadcount: {
    flex: 1,
    alignSelf: 'flex-end',
    marginTop: 7,
    marginBottom: 7,
    color: '#ef6e67',
    textAlign: 'center'
  }
});

function mapStateToProps(state) {
  return {
    subscribe: state.subscribe
  };
}

export default connect(mapStateToProps)(Subscribes);