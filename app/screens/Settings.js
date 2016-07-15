import React, {Component} from 'react';
import {
  ActionSheetIOS,
  AsyncStorage,
  ListView,
  RecyclerViewBackedScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as ApplicationActions from '../reducers/application/actions';

class Settings extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const items = [
      {title: '並び順', icon: 'ios-list-outline'},
      {title: '新着のみ', icon: 'ios-funnel-outline'},
      {title: 'ログアウト', icon: 'ios-log-out-outline'}
    ];

    this.state = {
      items: items,
      dataSource: dataSource.cloneWithRows(items)
    };
  }

  render() {
    return (
      <ListView
        style={styles.container}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator.bind(this)}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props}/>}
        />
    );
  }

  _renderRow(rowData, sectionId, rowId, highlightRow) {
    return (
      <TouchableHighlight
        underlayColor='#3e1c1c'
        style={styles.row}
        onPress={() => {
          this._pressRow(rowId);
          highlightRow(sectionId, rowId);
        }}>
        <View
          style={styles.wrapper}>
          <Ionicons
            name={rowData.icon}
            size={22}
            color='#f39f41'
            style={styles.icon}
            />
          <Text
            style={styles.title}
            >{rowData.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionId}-${rowId}`}
        style={{
          height: 1,
          backgroundColor: '#813c3a',
        }}
      />
    );
  }

  _pressRow(rowId) {
    switch (rowId) {
      case '0':
        ActionSheetIOS.showActionSheetWithOptions({
          options: ['新着順', '旧着順', '未読が多い', '未読が少ない',
            'タイトル', 'レート', '読者が多い', '読者が少ない', 'キャンセル'],
          cancelButtonIndex: 8
          }, this._order.bind(this));
        break;
      case '1':
        ActionSheetIOS.showActionSheetWithOptions({
          options: ['有効', '無効', 'キャンセル'],
          cancelButtonIndex: 2
        }, this._unread.bind(this));
        break;
      case '2':
        ActionSheetIOS.showActionSheetWithOptions({
          options: ['ログアウトする', 'キャンセル'],
          cancelButtonIndex: 1
        }, this._logout.bind(this));
        break;
    }
  }

  _order(event) {
    if (event === 8) {
      return;
    }

    try {
      AsyncStorage.setItem('order', `${event}`);
    } catch (error) {
      console.error(error);
    }
  }

  _unread(event) {
    if (event === 2) {
      return;
    }

    try {
      AsyncStorage.setItem('unread', event === 0 ? '1' : '0');
    } catch (error) {
      console.error(error);
    }
  }

  _logout(event) {
    if (event === 1) {
      return;
    }

    this.props.dispatch(ApplicationActions.logout());
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3e1c1c'
  },
  row: {
    height: 80
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  },
  icon: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 20
  },
  title: {
    flex: 3,
    alignSelf: 'center',
    color: '#ffffff'
  }
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Settings);