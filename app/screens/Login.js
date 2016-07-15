import React, {Component, PropTypes} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {connect} from 'react-redux';

import * as ApplicationActions from '../reducers/application/actions';

class Login extends Component {
  state: any;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isUsernameActive: false,
      isPasswordActive: false
    };
  }

  render() {
    return (
      <ScrollView
        style={{flex: 1}}>
        <StatusBar
          barStyle='light-content'
          />
        <View
          style={[styles.inputWrapper, {marginTop: 60}, this.state.isUsernameActive && styles.activeInput]}>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            placeholder='livedoor ID'
            placeholderTextColor='#ef6e67'
            onChangeText={(username) => this.setState({username})}
            onFocus={() => this.setState({isUsernameActive: true})}
            onBlur={() => this.setState({isUsernameActive: false})}
            />
          </View>
        <View
          style={[styles.inputWrapper, this.state.isPasswordActive && styles.activeInput]}>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            secureTextEntry={true}
            clearTextOnFocus={true}
            placeholder='パスワード'
            placeholderTextColor='#ef6e67'
            onChangeText={(password) => this.setState({password})}
            onFocus={() => this.setState({isPasswordActive: true})}
            onBlur={() => this.setState({isPasswordActive: false})}
            />
          </View>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => this._onLogin()}>
          <Text
            style={styles.button}>ログイン</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  _onLogin() {
    this.props.dispatch(ApplicationActions.login(this.state.username, this.state.password));
  }
}

const styles = StyleSheet.create({
  inputWrapper: {
    height: 44,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ef6e67'
  },
  input: {
    height: 44,
    marginRight: 10,
    marginLeft: 10,
    fontSize: 18,
    color: '#813c3a'
  },
  activeInput: {
    borderBottomColor: '#813c3a',
  },
  buttonWrapper: {
    height: 44,
    marginTop: 50,
    marginRight: 20,
    marginBottom: 10,
    marginLeft: 20,
    backgroundColor: '#ef6e67',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ef6e67'
  },
  button: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 20,
    color: '#ffffff'
  }
});

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Login);