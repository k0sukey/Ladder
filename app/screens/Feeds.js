import React, {Component} from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  WebView
} from 'react-native';
import {connect} from 'react-redux';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-spinkit';

import * as ApplicationActions from '../reducers/application/actions';
import * as FeedActions from '../reducers/feed/actions';

const {width, height} = Dimensions.get('window');
const ENABLE_COLOR = 'rgba(214,109,100,.8)';
const DISABLE_COLOR = 'rgba(204,204,204,.8)';

class Feeds extends Component {
  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      isSpinning: false,
      isMiscellaneous: false,
      channel: {},
      items: [],
      source: {html: ''},
      page: 0,
      backColor: DISABLE_COLOR,
      forwardColor: DISABLE_COLOR,
      browserColor: DISABLE_COLOR,
      browser: 'ios-browsers-outline'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.props.navigator.setTitle({
      title: nextProps.feed.channel.title
    });

    this.setState({
      channel: nextProps.feed.channel,
      items: nextProps.feed.items,
      source: {html: this._makeFeed(nextProps.feed.items[0])},
      page: 0,
      backColor: DISABLE_COLOR,
      forwardColor: nextProps.feed.items.length > 1 ? ENABLE_COLOR : DISABLE_COLOR,
      browserColor: 'rgba(214,109,100,.8)',
    });
  }

  onNavigatorEvent(event) {
    if (event.id === 'subscribes') {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true
      });
      return;
    }

    if (event.id === 'settings') {
      this.props.navigator.toggleDrawer({
        side: 'right',
        animated: true
      });
      return;
    }
  }

  render() {
    return (
      <View
        style={styles.container}>
        <StatusBar
          barStyle='light-content'
          />
        <WebView
          ref='webview'
          scalesPageToFit={true}
          decelerationRate='normal'
          source={this.state.source}
          onLoadStart={this._loadStart.bind(this)}
          onLoadEnd={this._loadEnd.bind(this)}
          onError={this._loadEnd.bind(this)}
          />
        <ActionButton
          position='left'
          buttonColor={this.state.backColor}
          icon={<Ionicons name='ios-arrow-back-outline' size={22} color='#ffffff'/>}
          onPress={this._goBack.bind(this)}
          />
        <ActionButton
          position='center'
          buttonColor={this.state.forwardColor}
          icon={<Ionicons name='ios-arrow-forward-outline' size={22} color='#ffffff'/>}
          onPress={this._goForward.bind(this)}
          />
        <ActionButton
          active={this.state.isMiscellaneous}
          position='right'
          buttonColor={this.state.browserColor}
          icon={<Ionicons name={this.state.browser} size={22} color='#ffffff'/>}
          onPress={this._goBrowser.bind(this)}
          />
        <Spinner
          style={styles.spinner}
          isVisible={this.state.isSpinning}
          size={60}
          type='ArcAlt'
          color='#ef6e67'
          />
      </View>
    );
  }

  _makeFeed(item) {
    return `<!doctype html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body {word-break : break-all;} img {width: 100%; height: auto;}</style></hrad>
<body><div style="padding: 10px 20px 60px 20px;"><h1 style="font-size: 24px;">${item.title}</h1><p>${item.body}</p></div></body>
</html>`;
  }

  _loadStart(event) {
    const isInternal = event.nativeEvent.url === 'about:blank';

    if (!isInternal && this.state.browser === 'ios-browsers-outline') {
      this.refs.webview.stopLoading();
      this._goBrowser();
      return;
    }

    this.setState({
      isSpinning: !isInternal,
      browser: isInternal ? 'ios-browsers-outline' : 'ios-close-outline'
    });
  }

  _loadEnd() {
    this.setState({
      isSpinning: false
    });
  }

  _goBack() {
    const previous = this.state.page - 1;
    if (previous < 0) {
      return;
    }

    this.setState({
      source: {html: this._makeFeed(this.state.items[previous])},
      page: previous,
      backColor: previous < 1 ? DISABLE_COLOR : ENABLE_COLOR,
      forwardColor: previous + 1 < this.state.items.length ? ENABLE_COLOR : DISABLE_COLOR,
      browser: 'ios-browsers-outline'
    });
  }

  _goForward() {
    const next = this.state.page + 1;

    if (next >= this.state.items.length) {
      return;
    }

    this.setState({
      source: {html: this._makeFeed(this.state.items[next])},
      page: next,
      backColor: next < 1 ? DISABLE_COLOR : ENABLE_COLOR,
      forwardColor: next + 1 < this.state.items.length ? ENABLE_COLOR : DISABLE_COLOR,
      browser: 'ios-browsers-outline'
    });
  }

  _goBrowser() {
    if (!this.state.items[this.state.page]) {
      return;
    }

    if (this.state.browser === 'ios-close-outline') {
      this.setState({
        source: {html: this._makeFeed(this.state.items[this.state.page])},
        browser: 'ios-browsers-outline'
      });
      return;
    }

    this.setState({
      source: {uri: this.state.items[this.state.page].link},
      browser: 'ios-close-outline'
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: (height - 120) / 2,
    marginLeft: (width - 60) / 2
  }
});

function mapStateToProps(state) {
  return {
    feed: state.feed
  };
}

export default connect(mapStateToProps)(Feeds);